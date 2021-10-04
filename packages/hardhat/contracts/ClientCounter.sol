pragma solidity ^0.6.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./Bank.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract ClientCounter {

  uint256 public count;
  Bank bank;

  constructor(address bank_addr) public payable {
    bank = Bank(bank_addr);
    count = 0;
  }

  function deposit(uint amount) public payable {
    bank.deposit{value: amount}();
  }

  function withdraw_via_transfer(uint amount) public payable {
    bank.withdraw_via_transfer(amount);
  }

  function withdraw_via_send(uint amount) public payable {
    bank.withdraw_via_send(amount);
  }

  function withdraw_via_call(uint amount) public payable {
    bank.withdraw_via_call(amount);
  }

  // Function to receive Ether. msg.data must be empty
  receive() external payable {
      count++;
  }
  // Fallback function is called when msg.data is not empty
  fallback() external payable {
      count++;
  }

}
