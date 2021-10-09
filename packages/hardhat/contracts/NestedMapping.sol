// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract NestedMapping {
  mapping(address => mapping(uint => bool)) public nestedMap;

  function get(address _addr, uint _i) public view returns (bool) {
    return nestedMap[_addr][_i];
  }

  function set(address _addr, uint _i, bool _boo) public {
    nestedMap[_addr][_i] = _boo;
  }

  function remove(address _addr, uint _i) public {
    delete nestedMap[_addr][_i];
  }
}
