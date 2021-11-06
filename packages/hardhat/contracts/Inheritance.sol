// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract A {
  function foo() public pure virtual returns (string memory) {
    return "A";
  }
}

contract B is A {
  function foo() public pure virtual override returns (string memory) {
    return "B";
  }
}

contract C is A {
  function foo() public pure virtual override returns (string memory) {
    return "C";
  }
}

contract D is C, B {
  function foo() public pure override(C, B) returns (string memory) {
    return super.foo();
  }
}

contract F is A, B {
  function foo() public pure override(A, B) returns (string memory) {
    return super.foo();
  }
}
