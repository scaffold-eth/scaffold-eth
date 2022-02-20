pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

interface IYourContract {
    function register() external;
}

contract MyContract is Ownable {
    mapping(address => address) public yourContract;

    function register(address _target) public onlyOwner {
        IYourContract target = IYourContract(_target);
        target.register();
    }
}
