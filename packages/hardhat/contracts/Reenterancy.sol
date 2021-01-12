pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

contract Reenterancy {
  // event SetPurpose(address sender, string purpose);
  // event Withdraw(address sender, uint256 amount);

  constructor() public { }

  mapping(address => uint256) public balance;
  
  receive() external payable { deposit(); }

  function deposit() public payable {
    balance[msg.sender] += msg.value;
  }

  function withdraw() public {
    msg.sender.call.gas(gasleft()).value(balance[msg.sender])(""); // msg.sender.transfer(balance[msg.sender]);
    // vulnerability
    balance[msg.sender] = 0;    
  }

  function withdraw_safe() public {
    uint256 amount = balance[msg.sender];
    balance[msg.sender] = 0;
    msg.sender.call.gas(gasleft()).value(amount)(""); // msg.sender.transfer(balance[msg.sender]);
  }
}
