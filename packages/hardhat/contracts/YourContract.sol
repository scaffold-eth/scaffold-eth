pragma solidity >=0.6.11 < 0.9.0;
//SPDX-License-Identifier: MIT


contract YourContract is Verifier {

  //event SetPurpose(address sender, string purpose);

  uint256 public state = 2;

  constructor() public {
    // what should we do on deploy?
  }

}
