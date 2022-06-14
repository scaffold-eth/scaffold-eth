pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Bank {

  mapping (address => uint256) public balance;

  function deposit() public payable {
    console.log(msg.sender,"DEPOST",msg.value,tx.origin);
    balance[msg.sender] += msg.value;
  }

  function withdraw() public {

    uint256 temp = balance[msg.sender];
    balance[msg.sender] = 0;

    (bool sent, ) = msg.sender.call{value: temp}("");
    require(sent, "Failed to send Ether");

  }

  // to support receiving ETH by default
  receive() external payable {
    deposit();
  }
  //fallback() external payable {}
}
