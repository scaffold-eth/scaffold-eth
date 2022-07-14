pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourCollectible {
  uint256 public highestBid;
  address public highestBidder;
  function bid() public payable { }
  function finalize() public returns (uint256) { }
  function timeLeft() public view returns (uint256) { }
}

contract YourContract {

  function bid() public payable {
    bananaBrickMe.bid{value: msg.value}();
  }

  YourCollectible bananaBrickMe;

  constructor() {
    bananaBrickMe = YourCollectible(0xcD091e6fe4843c5e352D6d2d25C2671f8ca51f20);
  }

  // to support receiving ETH by default
  receive() external payable { revert(); }


  function finalize() public {
    bananaBrickMe.finalize();
  }

  function timeLeft() public view returns (uint256) {
    return bananaBrickMe.timeLeft();
  }

  function highestBid() public view returns (uint256) {
    return bananaBrickMe.highestBid();
  }

  function highestBidder() public view returns (address) {
    return bananaBrickMe.highestBidder();
  }
}
