// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Getter functions can be declared view or pure
// View function declares that no state will be changed
// Pure function declares that no state variable will be changed or read

contract ViewAndPure {
  uint public x = 1;

  // Promise not to modify the state
  function addToX(uint y) public view returns (uint) {
    return x + y;
  }

  // Promise not to modify or read from the state
  function add(uint i, uint j) public pure returns (uint) {
    return i + j;
  }
}
