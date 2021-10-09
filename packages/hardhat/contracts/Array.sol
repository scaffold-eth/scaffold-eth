// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Array {
  uint[] public array;
  uint[] public array2 = [1, 2, 3];
  uint[10] public fixedSizeArray; // fixed size array, all elements initialize to 0

  function get(uint i) public view returns (uint) {
    return array[i];
  }

  // Solidity can get the full array, but should be avoided
  // for arrays that can grow indefinitely in length.
  function getArray() public view returns (uint[] memory) {
    return array;
  }

  function push(uint i) public {
    array.push(i); // append element, will increase array length by 1
  }

  function pop() public {
    array.pop(); // remove last element, will decrease array length by 1
  }

  function getLength() public view returns (uint) {
    return array.length;
  }

  function remove(uint index) public {
    delete array[index]; // resets value at index to default value, does not change array length
  }
}
