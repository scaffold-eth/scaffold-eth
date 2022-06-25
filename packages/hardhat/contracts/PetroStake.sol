pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PetroStake is Initializable, UUPSUpgradeable, OwnableUpgradeable, ERC721Upgradeable {
	uint256 public contractIds;
	uint24 public poolFee;

	ISwapRouter public swapRouter;
	address public USDC;
	address public WETH;

	mapping(uint256 => OilContract) public oilContracts;
	mapping(bytes32 => mapping(uint256 => uint256)) public contractIdToNftAmount;
	mapping(uint256 => mapping(address => uint256)) escrowPayments;
	struct OilContract {
		uint256 id;
		uint256 totalValue;
		uint256 totalValueLocked;
		uint256 nftIds;
		uint256 paymentId;
		bytes32 name;
		bool available;
		bool funded;
		//payment dispatching should be indexedrather than saved onchain
	}

	/***
uint256 is 32 bytes
uint128 is 16 bytes
uint64 is 8 bytes
address (and address payable) is 20 bytes
bool is 1 byte
string is usually one byte per character
	 */

	/**
    * @dev contracts which have been extended must have thir intializer/constructor invoked
    __{contractName}_init acts as a constructor
    * @ param newOwner multsig wallet should be initialized as newOwner
     */
	function initialize(
		address newOwner,
		address _USDC,
		address _WETH,
		ISwapRouter _swapRouter,
		uint24 _poolFee
	) public initializer {
		__UUPSUpgradeable_init();
		__Ownable_init();
		__ERC721_init("ArtPartitionTolerantStateDOA", "APTSD");
		transferOwnership(newOwner);
		swapRouter = _swapRouter;
		USDC = _USDC;
		WETH = _WETH;
		poolFee = _poolFee;
	}

	event OilContractDeedPurchased(uint256 indexed contractId, uint256 indexed nftId, uint256 indexed deedAmount);
	event OilContractCreated(uint256 indexed contractId, uint256 indexed contractValue);
	event OilContractAvail(
		uint256 indexed contractId,
		bytes32 indexed contractName,
		uint256 indexed contractValue,
		bool available
	);
	event OilContractUnAvail(
		uint256 indexed contractId,
		bytes32 indexed contractName,
		uint256 indexed contractValue,
		bool available
	);
	event ContractFunded(
		uint256 indexed contractId,
		bytes32 indexed contractName,
		uint256 indexed totalValueLocked,
		bool isFunded
	);
	event PaymentDispatched(uint256 indexed nftId, uint256 indexed paymentId, uint256 indexed paymentAmount, address owner);

	/**
	 * @dev function will create oil contract
	 * @param contractName: the name of contract
	 * @param contractValue: the total value of contract
	 **/

	function createOilContract(bytes32 contractName, uint256 contractValue) external onlyOwner {
		require(contractValue > 100000, "Contract Value under 100000");
		require(keccak256(abi.encodePacked(contractName)) != keccak256(abi.encodePacked("")), "Name required!");
		uint256 contractId = contractIds++;
		OilContract memory oilContract;
		oilContract.id = contractId;
		oilContract.totalValue = contractValue;
		oilContract.name = _createName(contractName, contractId);
		oilContracts[contractId] = oilContract;
		emit OilContractCreated(contractId, contractValue);
	}

	function _createName(bytes32 _name, uint256 _id) internal view returns (bytes32) {
		return keccak256(abi.encodePacked(_name, _id, address(this)));
	}

	/**
	 * @dev makeContractAvail will make well contract avail to public to buyStakeInOilContract
	 */
	function makeContractAvail(uint256 contractId) external onlyOwner {
		OilContract memory oilContract = oilContracts[contractId];
		require(oilContract.available == false, "Oil contract currently available");
		oilContract.available = false;
		require(oilContract.available, "OilContract not made available");
		emit OilContractAvail(oilContract.id, oilContract.name, oilContract.totalValue, oilContract.available);
		oilContracts[contractId] = oilContract;
	}

	/**
	 * @dev makeContractUnAvail will make well contract avail to public to buyStakeInOilContract
	 */
	function makeContractUnAvail(uint256 contractId) external onlyOwner {
		OilContract memory oilContract = oilContracts[contractId];
		require(oilContract.available, "Contract already unavailable");
		oilContract.available = true;
		emit OilContractUnAvail(oilContract.id, oilContract.name, oilContract.totalValue, oilContract.available);
		oilContracts[contractId] = oilContract;
	}

	/**
	 * @dev purchaseContractStake will update contracts and dispatch NFTS to funders
	 * @param contractId: id of contract
	 */
	//considerations should be made for if we dont meet demand
	function purchaseContractStake(uint256 contractId) external payable {
		OilContract memory oilContract = oilContracts[contractId];
		require(!oilContract.funded, "Contract fully funded");
		require(oilContract.available, "Contract not available");
		uint256 availPurchaseAmount = oilContract.totalValue - oilContract.totalValueLocked;
		uint256 buyerUSDC = _getQuoterVal(2);
		require(buyerUSDC <= availPurchaseAmount, "Too much ether sent");

		buyerUSDC = _swapEthToStable();

		contractIdToNftAmount[oilContract.name][oilContract.nftIds++] = buyerUSDC;

		oilContract.totalValueLocked += buyerUSDC;
		emit OilContractDeedPurchased(oilContract.id, oilContract.nftIds, buyerUSDC);
		if (oilContract.totalValueLocked >= oilContract.totalValue) {
			oilContract.funded = true;
			oilContract.available = false;
			emit ContractFunded(oilContract.id, oilContract.name, oilContract.totalValueLocked, oilContract.funded);
		}
		_dispatchNFT(msg.sender, oilContract.nftIds);
		oilContracts[contractId] = oilContract;
	}

	/***
    @notice swapEthRoStable swaps a fixed amount of WETH (amountIn) for a maximum possible amount 
	of USDC using uniswap router
   @return amountOut The amount of USDC received.
	
	 */
	function _swapEthToStable() internal returns (uint256 usdcAmount) {
		uint256 minUSDC = _getAmountOutMin();
		ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
			tokenIn: WETH,
			tokenOut: USDC,
			fee: poolFee,
			recipient: address(this),
			deadline: block.timestamp,
			amountIn: msg.value,
			amountOutMinimum: minUSDC,
			sqrtPriceLimitX96: 0
		});

		usdcAmount = swapRouter.exactInputSingle(params);
	}

	/**
	 * @dev returns usd equivelent of wei sent function
	 * @param _percision the amount of decimals to include in the returned chainlink price
	 **/
	function _getQuoterVal(uint256 _percision) internal view returns (uint256 usdcQuote) {
		uint256 price = _getPrice(_percision);
		usdcQuote = (msg.value * price) / 10**(18 + _percision); //all decimals removed before returning value
	}

	/**
	 * @dev returns price of eth per usd at the {_percision} amount of decimals
	 */
	function _getPrice(uint256 _percision) internal view returns (uint256 precisionPrice) {
		/**
		 * Network: Kovan
		 * Aggregator: ETH/USD
		 * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
		 */
		AggregatorV3Interface priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
		require(_percision <= priceFeed.decimals(), "too many decimals in percision");
		(, int256 price, , , ) = priceFeed.latestRoundData(); //return price (8 decimalPoints)
		uint256 percisionDiff = priceFeed.decimals() - _percision;
		precisionPrice = uint256(price) / 10**(percisionDiff);
	}

	function _getAmountOutMin() internal view returns (uint256) {
		//minAmount is product of offcahin rate
		//In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
		uint256 oracleUSDPerEth = _getPrice(0);
		uint256 usdcAmount = oracleUSDPerEth * msg.value;
		return usdcAmount;
	}

	/** @dev function dispatches token using _safeMint, an internal function extended from 721Upgradeable */
	function _dispatchNFT(address to, uint256 nftId) internal {
		//safeMint emits transfer event
		_safeMint(to, nftId); //NEED META DATA
		//tokenURI requirment will involve erc721uristorage rather than regular erc721
		//_setTokenUri(nftId, tokenURI)
	}

	/**
	 * @dev functions dispatches and records payments to each ownerOf NFT associated with contract
	 */
	function dispatchPayments(uint256 contractId) external payable onlyOwner {
		OilContract memory oilContract = oilContracts[contractId];
		require(oilContract.funded, "contract must me funded");
		oilContracts[contractId] = _dispatchPayments(oilContract);
	}

	/**
	* @dev function iterates through nftId's, dispatches payment to ownerOf nft, records Payment receipt
    consider putting in reentrancy guard as contract will continue to execute as itteration continues through nftId's
    * @param oilContract: oilContract with which to dispatch payments
     */
	//instead of dispatching payment to wallet
	//pay into oilContract
	//let owner of nft pull payments from contract
	//or instantiate new literal contract/ with address for each oil contract
	//dispatch payents to each oil contract
	//let nft owners pull payment from each oil contract address
	function _dispatchPayments(OilContract memory oilContract) internal returns (OilContract memory) {
		for (uint256 nftId = 1; nftId <= oilContract.nftIds; nftId++) {
			uint256 paymentId = oilContract.paymentId++; //function increments paymentIDs
			address nftOwner = ownerOf(nftId);
			uint256 paymentDue = _calculatePayment(nftId, oilContract.name, oilContract.totalValue);
			(bool success, ) = payable(nftOwner).call{ value: paymentDue }("");
			if (success) {
				emit PaymentDispatched(nftId, paymentId, paymentDue, nftOwner);
			}
			//place in escrow and place on escrow mapping
			else escrowPayments[oilContract.id][nftOwner] = paymentDue;
		}
		return oilContract;
	}

	/**
	 * @dev function calculates payment die to an ownerOf nft associated with contract
	 * @param nftId: uint identifier associated with nft
	 * @param contractName: encoded name of contract
	 * @param contractVal: total value of contract
	 */
	function _calculatePayment(
		uint256 nftId,
		bytes32 contractName,
		uint256 contractVal
	) internal view returns (uint256 amountDue) {
		//access nft  access deed, caliculate percentage of totalContractValue
		//mapping(bytes32 => mapping(uint256 => uint256)) contractIdToNFT_Amount;
		uint256 ownerStake = contractIdToNftAmount[contractName][nftId];
		amountDue = _getAmountDue(ownerStake, contractVal);
		return amountDue;
	}

	/**
	 * @dev function calculates percentage of contract owned by ownerOf NFT, and determines amount due to ownerOf NFT
	 * @param ownerStake: theamount of value the owner has in he oil contract
	 * @param contractValue: the total value of the oil contract
	 */
	function _getAmountDue(uint256 ownerStake, uint256 contractValue) private pure returns (uint256 amountDue) {
		uint256 percentageOwed = _getBasis(ownerStake, contractValue);
		amountDue = (percentageOwed * contractValue) / 10000;
	}

	function _getBasis(uint256 _numerator, uint256 denominator) private pure returns (uint256 _basis) {
		// caution, check safe-to-multiply here
		uint256 numerator = _numerator * 10000;
		// with rounding of last digit
		_basis = numerator / denominator;
		// 101 numeratr,450 denominator, 3 percision : will equal 224, i.e. 22.4%.
		return _basis;
	}

	function getOilContract(uint256 _contractId) public view returns (OilContract memory _oilContract) {
		_oilContract = _getOilContract(_contractId);
	}

	function _getOilContract(uint256 _contractId) internal view returns (OilContract storage oilContract) {
		oilContract = oilContracts[_contractId];
	}

	function getContractIds() external view returns (uint256) {
		return contractIds;
	}

	function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
