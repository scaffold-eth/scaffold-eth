pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourToken is ERC20 {

  constructor() ERC20("GoodTokenCool","GTC") {
    // what should we do on deploy?
    _mint(msg.sender,100 ether);
  }

}
