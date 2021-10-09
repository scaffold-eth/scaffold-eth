// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract PrimitiveDataTypes {

    // boolean
    // uint
    // int
    // address

    bool public boo = true;

    uint8 public u8 = 1;
    uint256 public u256 = 456;
    uint public u = 123;

    int8 public i8 = -1;
    int256 public i256 = 456;
    int public i = -123;

    address public addr = 0x4BBa239C9cC83619228457502227D801e4738bA0;

    bool public defaultBoo; // false
    uint public defaultUint; // 0
    int public defaultIn; // 0
    address public defaultAddr; // 0x0000000000000000000000000000000000000000
}
