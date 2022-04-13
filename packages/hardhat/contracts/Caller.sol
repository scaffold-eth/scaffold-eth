//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./Game.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Caller is Ownable {
    Game public registry;

    constructor(address _registry, address _owner) {
        registry = Game(_registry);
        transferOwnership(_owner);
    }

    function setRegistry(address _registry) public onlyOwner {
        registry = Game(_registry);
    }

    function register() public onlyOwner {
        registry.register();
    }

    function move(MoveDirection direction) public onlyOwner {
        registry.move(direction);
    }
}
