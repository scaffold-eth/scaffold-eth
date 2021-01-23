pragma solidity 0.8.0;
import "hardhat/console.sol";
import './Pausable.sol';

// SPDX-License-Identifier: UNLICENSED

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Pausable {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Programming Unstoppable Money";

  constructor() {
    // what should we do on deploy?
  }

  function setPurpose(string memory newPurpose) public {
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
    emit SetPurpose(msg.sender, purpose);
  }

}
