// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ImportFoo.sol";

contract ImportImport {
  Foo public foo = new Foo();

  function getFooName() public view returns (string memory) {
    return foo.name();
  }
}
