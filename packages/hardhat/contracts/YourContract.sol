pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./hashVerifier.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Verifier {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Building Unstoppable Apps";

  uint256 public verifiedHash;

  constructor() public {
    // what should we do on deploy?
  }

  function setPurpose(string memory newPurpose) public {
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
    emit SetPurpose(msg.sender, purpose);
  }

  function testVerifyProof(
          uint[2] memory a,
          uint[2][2] memory b,
          uint[2] memory c,
          uint[2] memory input
      ) public {
      require(verifyProof(a, b, c, input), "Invalid Proof");
      verifiedHash = input[0];
  }

}
