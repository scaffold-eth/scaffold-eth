pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Clicker {

  event Click(address sender);

  mapping(address => uint256) public clicks;

  function increment() public {
    clicks[msg.sender]++;
    emit Click(msg.sender);
  }

  function decrement() public {
    clicks[msg.sender]--;
    emit Click(msg.sender);
  }
}
