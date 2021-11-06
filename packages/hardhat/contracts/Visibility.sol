// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Functions can be declared as:
// public — any contract and account can call
// private — only inside the contract that defines the function
// internal — only inside contract that inherits an internal function (only ?)
// external — only other contracts and accounts call

// Variables can be declared as public, private, or internal but not external

contract Base {
  function privateFunc() private pure returns (string memory) {
    return "private function called";
  }

  function testPrivateFunc() public pure returns (string memory) {
    return privateFunc();
  }

  function internalFunc() internal pure returns (string memory) {
    return "internal function called";
  }

  function testInternalFunc() public pure virtual returns (string memory) {
    return internalFunc();
  }

  function publicFunc() public pure returns (string memory) {
    return "public function called";
  }

  function externalFunc() external pure returns (string memory) {
    return "external function called";
  }

  string private privateVar = "my private variable";
  string internal internalVar = "my internal variable";
  string public publicVar = "my public variable";
}

contract Child is Base {
  function testInternalFunc() public pure override returns (string memory) {
    return internalFunc();
  }
}
