pragma solidity >=0.5.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet {

  string public purpose = "Hello World!!!";
  address public owner;

  constructor() public {
    owner = msg.sender;
    console.log("Smart Contract Wallet is owned by:",owner);
  }

  function updateOwner(address newOwner) public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    owner = newOwner;
  }

}
