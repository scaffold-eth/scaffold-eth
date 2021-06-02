pragma solidity ^0.8.0;
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "hardhat/console.sol";
import "./Collectible.sol";

contract Collections is Ownable, Pausable {
	using SafeMath for uint256;

	IERC20 public token;
	Collectible public collectible;

  uint256 private _totalSupply;
	// Objects balances [id][address] => balance
	mapping(uint256 => mapping(address => uint256)) internal _balances;
	mapping(address => uint256) private _accountBalances;
	mapping(uint256 => uint256) private _poolBalances;

	struct Card {
    uint256 id;
		uint256 points; // Cost of minting a card in points
		uint256 releaseTime; // When the card becomes available for minting
		uint256 mintFee; // Cost of minting a card in eth
	}

	struct Pool {
		uint256 periodStart; // When the collection launches and starts accepting staking tokens.
		uint256 maxStake; // How many tokens you can stake max on the pool. 
		uint256 rewardRate; // 11574074074000, 1 point per day per staked EMEM
		uint256 feesCollected; // Tally of eth collected from cards that require an additional $ to be minted
		uint256 spentPoints; // Tally of points spent in this pool
		uint256 controllerShare; // Revenue share scheme of eth fees collected
		address artist;
    string title;
		mapping(address => uint256) lastUpdateTime;
		mapping(address => uint256) points;
		mapping(uint256 => Card) cards;
    uint256 cardsInPool;
    Card[] cardsArray;
	}

	address public controller;
	mapping(address => uint256) public pendingWithdrawals;
	mapping(uint256 => Pool) public pools;
  uint256 public poolsCount;

	event UpdatedArtist(uint256 poolId, address artist);
	event PoolAdded(uint256 poolId, address artist, uint256 periodStart, uint256 rewardRate, uint256 maxStake);
	event CardAdded(uint256 poolId, uint256 cardId, uint256 points, uint256 mintFee, uint256 releaseTime);
	event Staked(address indexed user, uint256 poolId, uint256 amount);
	event Withdrawn(address indexed user, uint256 poolId, uint256 amount);
	event Transferred(address indexed user, uint256 fromPoolId, uint256 toPoolId, uint256 amount);
	event Redeemed(address indexed user, uint256 poolId, uint256 amount);

	modifier updateReward(address account, uint256 id) {
		if (account != address(0)) {
			pools[id].points[account] = earned(account, id);
			pools[id].lastUpdateTime[account] = block.timestamp;
		}
		_;
	}

	modifier poolExists(uint256 id) {
		require(pools[id].rewardRate > 0, "pool does not exists");
		_;
	}

	modifier cardExists(uint256 pool, uint256 card) {
		require(pools[pool].cards[card].points > 0, "card does not exists");
		_;
	}

	constructor(
		address _controller,
		Collectible _collectibleAddress,
		IERC20 _tokenAddress
	)
  {
		controller = _controller;
		collectible = _collectibleAddress;  
    token = IERC20(_tokenAddress);
	}

	function stake(uint256 pool, uint256 amount)
		public
		poolExists(pool)
		updateReward(msg.sender, pool)
		whenNotPaused()
	{
		Pool storage p = pools[pool];
		require(block.timestamp >= p.periodStart, "pool not open");
		require(amount.add(balanceOf(msg.sender, pool)) <= p.maxStake, "stake exceeds max");

		_totalSupply = _totalSupply.add(amount);
		_poolBalances[pool] = _poolBalances[pool].add(amount);
		_accountBalances[msg.sender] = _accountBalances[msg.sender].add(amount);
		_balances[pool][msg.sender] = _balances[pool][msg.sender].add(amount);
		token.transferFrom(msg.sender, address(this), amount);
		emit Staked(msg.sender, pool, amount);
	}

	function withdraw(uint256 pool, uint256 amount) public poolExists(pool) updateReward(msg.sender, pool) {
		require(amount > 0, "cannot withdraw 0");

		_totalSupply = _totalSupply.sub(amount);
		_poolBalances[pool] = _poolBalances[pool].sub(amount);
		_accountBalances[msg.sender] = _accountBalances[msg.sender].sub(amount);
		_balances[pool][msg.sender] = _balances[pool][msg.sender].sub(amount);
		token.transfer(msg.sender, amount);
		emit Withdrawn(msg.sender, pool, amount);
	}

	function transfer(
		uint256 fromPool,
		uint256 toPool,
		uint256 amount
	)
		public
		poolExists(fromPool)
		poolExists(toPool)
		updateReward(msg.sender, fromPool)
		updateReward(msg.sender, toPool)
		whenNotPaused()
	{
		Pool storage toP = pools[toPool];

		require(block.timestamp >= toP.periodStart, "pool not open");
		require(amount.add(balanceOf(msg.sender, toPool)) <= toP.maxStake, "stake exceeds max");

		_poolBalances[fromPool] = _poolBalances[fromPool].sub(amount);
		_balances[fromPool][msg.sender] = _balances[fromPool][msg.sender].sub(amount);

		_poolBalances[toPool] = _poolBalances[toPool].add(amount);
		_balances[toPool][msg.sender] = _balances[toPool][msg.sender].add(amount);
		emit Transferred(msg.sender, fromPool, toPool, amount);
	}

	function transferAll(uint256 fromPool, uint256 toPool) external {
		transfer(fromPool, toPool, balanceOf(msg.sender, fromPool));
	}

	function exit(uint256 pool) external {
		withdraw(pool, balanceOf(msg.sender, pool));
	}

	function redeem(uint256 pool, uint256 card)
		public
		payable
		poolExists(pool)
		cardExists(pool, card)
		updateReward(msg.sender, pool)
	{
		Pool storage p = pools[pool];
		Card memory c = p.cards[card];
    console.log("Points needed: ", c.points);
    console.log("Points:", p.points[msg.sender]);
		
    require(block.timestamp >= c.releaseTime, "card not released");
		require(p.points[msg.sender] >= c.points, "not enough points");
		require(msg.value == c.mintFee, "support our artists, send eth");

		if (c.mintFee > 0) {
			uint256 _controllerShare = msg.value.mul(p.controllerShare).div(1000);
			uint256 _artistRoyalty = msg.value.sub(_controllerShare);
			require(_artistRoyalty.add(_controllerShare) == msg.value, "problem with fee");

			p.feesCollected = p.feesCollected.add(c.mintFee);
			pendingWithdrawals[controller] = pendingWithdrawals[controller].add(_controllerShare);
			pendingWithdrawals[p.artist] = pendingWithdrawals[p.artist].add(_artistRoyalty);
		}

		p.points[msg.sender] = p.points[msg.sender].sub(c.points);
		p.spentPoints = p.spentPoints.add(c.points);
		collectible.mint(msg.sender, card, 1, "");
		emit Redeemed(msg.sender, pool, c.points);
	}

	function setArtist(uint256 pool, address artist) public onlyOwner {
		uint256 amount = pendingWithdrawals[artist];
		pendingWithdrawals[artist] = 0;
		pendingWithdrawals[artist] = pendingWithdrawals[artist].add(amount);
		pools[pool].artist = artist;

		emit UpdatedArtist(pool, artist);
	}

	function setController(address _controller) public onlyOwner {
		uint256 amount = pendingWithdrawals[controller];
		pendingWithdrawals[controller] = 0;
		pendingWithdrawals[_controller] = pendingWithdrawals[_controller].add(amount);
		controller = _controller;
	}

	function setControllerShare(uint256 pool, uint256 _controllerShare) public onlyOwner poolExists(pool) {
		pools[pool].controllerShare = _controllerShare;
	}

	function createCard(
		uint256 pool,
		uint256 supply,
		uint256 points,
		uint256 mintFee,
		uint256 releaseTime
	) public onlyOwner poolExists(pool) returns (uint256) {
		uint256 tokenId = collectible.create(supply, 0, "", "");
		require(tokenId > 0, "ERC1155 create did not succeed");

		Card storage c = pools[pool].cards[tokenId];
		c.points = points;
		c.releaseTime = releaseTime;
		c.mintFee = mintFee;
    c.id = tokenId;
    pools[pool].cardsArray.push(c);
    pools[pool].cardsInPool++;
		emit CardAdded(pool, tokenId, points, mintFee, releaseTime);
		return tokenId;
	}

	function createPool(
		uint256 id,
		uint256 periodStart,
		uint256 maxStake,
		uint256 rewardRate,
		uint256 controllerShare,
		address artist,
    string memory title
	) public onlyOwner returns (uint256) {
		require(pools[id].rewardRate == 0, "pool exists");

		Pool storage p = pools[id];

		p.periodStart = periodStart;
		p.maxStake = maxStake;
		p.rewardRate = rewardRate;
		p.controllerShare = controllerShare;
		p.artist = artist;
    p.title = title;

    poolsCount++;
		emit PoolAdded(id, artist, periodStart, rewardRate, maxStake);
	}

  	function cardMintFee(uint256 pool, uint256 card) public view returns (uint256) {
		return pools[pool].cards[card].mintFee;
	}

	function cardReleaseTime(uint256 pool, uint256 card) public view returns (uint256) {
		return pools[pool].cards[card].releaseTime;
	}

	function cardPoints(uint256 pool, uint256 card) public view returns (uint256) {
		return pools[pool].cards[card].points;
	}

	function earned(address account, uint256 pool) public view returns (uint256) {
		Pool storage p = pools[pool];
		uint256 blockTime = block.timestamp;
    console.log("Balance: ", balanceOf(account, pool));
    console.log("Blocktime: ", blockTime);
    console.log("Last Updated: ", p.lastUpdateTime[account]);
    console.log("Reward rate: ", p.rewardRate);
    console.log("Points:", p.points[account]);
    uint256 earned = balanceOf(account, pool).mul(blockTime.sub(p.lastUpdateTime[account]).mul(p.rewardRate)).div(1e18).add(
				p.points[account]
			);
    console.log("Earned: ", earned);
		return earned;
	}

  function totalSupply() public view returns (uint256) {
		return _totalSupply;
	}

	function balanceOfAccount(address account) public view returns (uint256) {
		return _accountBalances[account];
	}

	function balanceOfPool(uint256 id) public view returns (uint256) {
		return _poolBalances[id];
	}

	function balanceOf(address account, uint256 id) public view returns (uint256) {
		return _balances[id][account];
	}

  function cardsInPool(uint256 id) public view returns (uint256) {
		return pools[id].cardsInPool;
	}

  function getCardsArray(uint256 id) public view returns (Card[] memory) {
		return pools[id].cardsArray;
	}

  function getLastUpdate(address account, uint256 id) public view returns (uint256) {
		return pools[id].lastUpdateTime[account];
	}

   function getPoints(address account, uint256 id) public view returns (uint256) {
		return pools[id].points[account];
	}

	function withdrawFee() public {
		uint256 amount = pendingWithdrawals[msg.sender];
		require(amount > 0, "nothing to withdraw");
		pendingWithdrawals[msg.sender] = 0;
		payable(msg.sender).transfer(amount);
	}
}