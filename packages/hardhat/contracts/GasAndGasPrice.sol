// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract GasAndGasPrice {
  uint public i = 0;

  // All gas is spent and transaction fails
  function forever() public {
    while (true) {
      i += 1;
    }
  }
}
