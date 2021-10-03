pragma solidity >=0.6.11 < 0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "./SqMulVerifier.sol";

contract YourContract is Verifier {

  //event SetPurpose(address sender, string purpose);

  uint256 public state = 2;

  constructor() public {
    // what should we do on deploy?
  }

  function changeState(
      uint[2] memory a,
      uint[2][2] memory b,
      uint[2] memory c,
      uint[2] memory input
  ) public {
      bool proof = verifyProof(a, b, c, input);
      require(input[1] == state, "Incorrect value");
      require(proof == true, "Invalid proof");
      state = input[0];
      console.log(msg.sender,"set state to",state);
      //emit SetPurpose(msg.sender, purpose);
  }
}
