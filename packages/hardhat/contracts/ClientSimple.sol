pragma solidity ^0.6.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./Bank.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract ClientSimple {

  Bank bank;

  constructor(address bank_addr) public payable {
    bank = Bank(bank_addr);
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
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}

}
