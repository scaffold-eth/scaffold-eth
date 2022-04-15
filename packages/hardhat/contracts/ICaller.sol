// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

enum MoveDirection {
    Up,
    Down,
    Left,
    Right
}

interface IGame {
    function setRegistry(address _registry) external;
    function register() external;
    function move(MoveDirection direction) external;
    function collectTokens() external;
    function collectHealth() external;
    function update(address myNewContract) external;
}