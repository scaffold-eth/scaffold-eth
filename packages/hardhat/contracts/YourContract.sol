pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Building Unstoppable Apps!!!";
  address public owner = 0xbf022f8F8c944666959Ad0229C2F2B6a641EaF35;

  constructor() payable {
    // what should we do on deploy?
  }

  uint256 public price = 0.001 ether;

  function setPurpose(string memory newPurpose) public payable {
      // require(msg.sender == owner, "Not the owner");
      require(msg.value >= price, "not enough!");
      price = price * 1001 / 1000; // way of multiplying by decimal?

      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      emit SetPurpose(msg.sender, purpose);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
