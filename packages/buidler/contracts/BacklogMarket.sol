pragma solidity >=0.6.0 <0.7.0;

//import "@nomiclabs/buidler/console.sol";

contract BacklogMarket {

  uint256 constant startingAt = 0.01 ether;
  uint16 constant numerator = 1337;
  uint16 constant denominator = 1000;

  mapping ( bytes32 => uint256 ) public price;
  mapping ( bytes32 => mapping ( address => uint256 ) ) public balanceOf;

  event Buy(address indexed buyer, bytes32 indexed id, uint256 price/*, bytes data*/); //would be fun to have github emojis buyable 👍 👎 👀 🎉 for signal instead of just number go up and down
  event Sell(address indexed buyer, bytes32 indexed id, uint256 price);

  function getId(string memory owner, string memory repo, uint256 issue) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(owner, repo, issue));
  }

  function nextPrice(string memory owner, string memory repo, uint256 issue) public view returns (uint256){
    bytes32 id = getId(owner, repo, issue);
    if(price[id]==0) return startingAt;
    return ( uint256(price[id] * numerator) / denominator);
  }

  function prevPrice(string memory owner, string memory repo, uint256 issue) public view returns (uint256){
    bytes32 id = getId(owner, repo, issue);
    if(price[id]<=startingAt) return startingAt;
    return ( uint256(price[id] * denominator) / numerator);
  }

  function buy(string memory owner, string memory repo, uint256 issue/*, bytes memory data*/) public payable {
    bytes32 id = getId(owner,repo,issue);
    price[id] = nextPrice(owner, repo, issue);
    require( msg.value == price[id], "WRONG AMOUNT SORRY");
    balanceOf[id][msg.sender]++;
    emit Buy(msg.sender, id, price[id]/*, data*/);
  }

  function sell(string memory owner, string memory repo, uint256 issue) public {
    bytes32 id = getId(owner,repo,issue);
    uint256 salePrice = price[id];
    price[id] = prevPrice(owner, repo, issue);
    require( balanceOf[id][msg.sender] > 0, "NONE TO SELL");
    balanceOf[id][msg.sender]--;
    msg.sender.transfer(salePrice);
    emit Sell(msg.sender, id, salePrice);
  }

}
