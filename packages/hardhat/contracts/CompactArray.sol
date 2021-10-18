// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract CompactArray {
  uint[] public array;

  // One trick to remove elements from an array and keep it compact and without gaps
  function remove(uint index) public {
    array[index] = array[array.length - 1];
    array.pop();
  }

  function test() public {
    array.push(1);
    array.push(2);
    array.push(3);
    array.push(4);

    // should be [1, 2, 3, 4]

    remove(1);
    // should be [1, 4, 3]

    remove (2);
    // should be [1, 4]
  }
}
