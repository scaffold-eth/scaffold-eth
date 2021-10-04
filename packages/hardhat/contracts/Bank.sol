pragma solidity ^0.6.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Bank {

  mapping( address => uint256 ) balances;

  constructor() public {}

  function deposit() public payable {
      balances[msg.sender] += msg.value;
  }

  function withdraw_via_transfer(uint256 amount) public {
      // forwards 2300 gas, not adjustable
      require(balances[msg.sender] >= amount, "Invalid withdraw request");
      payable(msg.sender).transfer(amount);
      balances[msg.sender] -= amount;
  }

  function withdraw_via_send(uint256 amount) public {
      // forwards 2300 gas, not adjustable
      // returns success condition
      // fails if stack depth is at 1024
      require(balances[msg.sender] >= amount, "Invalid withdraw request");
      bool sent = payable(msg.sender).send(amount);
      require(sent, "Failed to send Ether");
      balances[msg.sender] -= amount;
  }

  function withdraw_via_call(uint256 amount) public {
      // forwards all available gas
      // returns success condition and data
      require(balances[msg.sender] >= amount, "Invalid withdraw request");
      // (bool sent, bytes memory _data) = msg.sender.call.value(amount}("");
      (bool sent, bytes memory _data) = msg.sender.call{value: amount}("");
      require(sent, "Failed to send Ether");
      balances[msg.sender] -= amount;
  }
}
