pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Ownable {

  //idk it's a map of 0,0 to 65535,65535
  //it'll rollover if we use unchecked math 

  event Structure(address owner, uint16 x, uint16 y, string emoji);
  event Agent(address owner, uint16 x, uint16 y, int8 dx, int8 dy, string emoji, uint64 stopAfter, uint64 startTime);

  constructor() payable {

  }

  function structure(uint16 x, uint16 y, string memory emoji) public onlyOwner {
      emit Structure(msg.sender, x, y, emoji);
  }


  function agent(uint16 x, uint16 y, int8 dx, int8 dy, string memory emoji, uint64 stopAfter) public onlyOwner {
      emit Agent(msg.sender, x, y, dx, dy, emoji, stopAfter, uint64(block.timestamp));
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
