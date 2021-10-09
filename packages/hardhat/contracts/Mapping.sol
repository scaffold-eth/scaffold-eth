pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

contract Mapping {
  mapping(address => uint) public myMap;

  function get(address _addr) public view returns (uint) {
    // If value was never set, Mapping will return the default value
    return myMap[_addr];
  }

  function set(address _addr, uint _i) public {
    myMap[_addr] = _i;
  }

  function remove(address _addr) public {
    delete myMap[_addr];
  }
}
