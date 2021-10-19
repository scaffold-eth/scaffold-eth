// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// An error undoes all changes made to the state during a transaction

// You can throw an error by calling require, revert, or assert

// Require — used to validate inputs and conditions before execution
// Revert — similar to require, used in more complex scenarios
// Assert — used to check for code that should never be false (failing probably means there is a bug)

// Use custom error to save gas

contract Error {
  function testRequire(uint _i) public pure {
    require(_i > 10, "Input must be greater than 10");
  }

  function testRevert(uint _i) public pure {
    if (_i <= 10) {
      revert("Input must be greater than 10");
    }
  }

  uint public num;

  function testAssert() public view {
    assert(num == 10);
  }

  error InsufficientBalance(uint balance, uint withdrawAmount);

  function testCustomError(uint _withdrawAmount) public view {
    uint bal = address(this).balance;
    if (bal < _withdrawAmount) {
      revert InsufficientBalance({balance: bal, withdrawAmount: _withdrawAmount});
    }
  }
}
