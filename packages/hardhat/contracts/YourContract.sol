pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  event Register(address origin, address yourContract);

  mapping(address => address) public yourContract;

  function register() public {
    require(tx.origin!=msg.sender, "NOT A CONTRACT");
    yourContract[tx.origin] = msg.sender;
    emit Register(tx.origin,msg.sender);
  }

}
