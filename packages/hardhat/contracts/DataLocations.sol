// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// storage — variable is a state variable (stored on the blockchain)
// memory — variable is in memory and it exists while a function is being called
// calldata — special data location that contains function arguments
//     (only available for external functions)

contract DataLocations {
  uint[] public array;
  mapping(uint => address) map;
  struct MyStruct {
    uint foo;
  }
  mapping(uint => MyStruct) myStructs;

  function f() public {
    // Call _f() with state variables
    _f(array, map, myStructs[1]);

    // get a struct from a mapping
    MyStruct storage myStruct = myStructs[1];
    
    // create a struct in memory
    MyStruct memory myMemStruct = MyStruct(0);
  }

  function _f(
    uint[] storage _arr,
    mapping(uint => address) storage _map,
    MyStruct storage _myStruct
  ) internal {
    // do something with storage variables
  }

  // you can return memory variables
  function g(uint[] memory _arr) public returns (uint[] memory) {
    // do something with memory array
  }

  function h(uint[] calldata _arr) external {
    // do something with calldata array
  }
}
