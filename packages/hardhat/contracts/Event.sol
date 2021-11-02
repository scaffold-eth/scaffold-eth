// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Event {
  event Log(address indexed sender, string message);
  event AnotherLog();

  function test() public {
    emit Log(msg.sender, "Hello World!");
    emit Log(msg.sender, "Hello EVM!");
    emit AnotherLog();
  }
}
