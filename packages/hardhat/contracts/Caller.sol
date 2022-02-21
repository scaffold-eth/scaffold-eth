pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "./YourContract.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Caller is Ownable {

    YourContract public registry;

    constructor(address _registry, address _owner) {
        registry = YourContract(_registry);
        transferOwnership(_owner);
    }

    function setRegistry(address _registry) public {
        registry = YourContract(_registry);
    }

    function callRegistry() public onlyOwner {
        registry.register();
    }

    function move(string calldata _move) public onlyOwner {
        registry.move(_move);
    }
}
