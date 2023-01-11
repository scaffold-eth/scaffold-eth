pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Receiver {

  uint8 public counter = 0;

  constructor() payable {
    // what should we do on deploy?
  }

  // to support receiving ETH by default
  receive() external payable {
    console.log("Received", msg.value);
    counter++;
    //revert();
  }
  fallback() external payable {}
  
}
