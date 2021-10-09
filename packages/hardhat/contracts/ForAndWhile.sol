// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ForAndWhile {
  function forLoop() public {
    // for loop
    for (uint i = 0; i < 10; i++) {
      if (i == 3) {
        // Skip to the next iteration with continue keyword
        continue;
      }
      if (i == 5) {
        // Exit loop with break keyword
        break;
      }
    }
  }

  function whileLoop() public view returns (uint) {
    uint j;

    while (j < 10) {
      j++;
    }

    return j; // expect 10
  }
}
