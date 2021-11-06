// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Shadowing inherited state variables

contract A {
  string public name = "Contract A";

  function getName() public view returns (string memory) {
    return name;
  }
}

contract C is A {
  constructor() {
    name = "Contract C";
  }
}
