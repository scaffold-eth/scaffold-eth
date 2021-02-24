pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
  
  receive() external payable {
    deposit();
  }

  event Deposit(address sender, uint256 amount);
  event Withdraw(address sender, uint256 amount);

  mapping(address => uint256) public balance;
  bool public isActive = false;
  uint256 constant public threshold = 0.003 * 10**18;
  uint256 public deadline = now + 2 minutes;

  constructor() public {
    // what should we do on deploy?
  }
  
  function timeLeft() public view returns (uint256) {
    if (now >= deadline) return 0;
    return deadline - now;
  }

  function deposit() public payable {
    balance[msg.sender] += msg.value;
    
    if (now <= deadline && address(this).balance >= threshold) {
      isActive = true;
    }

    emit Deposit(msg.sender, msg.value);
  }

  function withdraw() public{
    require(now > deadline, "deadline hasn't passed yet");
    require(isActive == false, "Contract is active");
    require(balance[msg.sender] > 0, "You haven't deposited");

    uint256 amount = balance[msg.sender];
    balance[msg.sender] = 0;
    msg.sender.transfer(amount);

    emit Withdraw(msg.sender, amount);
  }

}
