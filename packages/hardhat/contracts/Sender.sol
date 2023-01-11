pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Sender {

  constructor() payable {
    // what should we do on deploy?
  }

  function transfer(address payable _to, uint _amount) public payable {
    _to.transfer(_amount);
  }

  function send(address payable _to, uint _amount) public payable {
    _to.send(_amount);
  }

  function call(address payable _to, uint _amount) public payable {
    _to.call{value: _amount}("");
  }



  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
