pragma solidity >=0.6.0 <0.7.0;

//import "@openzeppelin/contracts/access/Ownable.sol";
import "./YourToken.sol";

contract Vendor {

  YourToken yourToken;

  constructor(address tokenAddress) public {
    yourToken = YourToken(tokenAddress);
  }

  //create a payable buyTokens() function:

  //create a withdraw() function that lets the owner


}
