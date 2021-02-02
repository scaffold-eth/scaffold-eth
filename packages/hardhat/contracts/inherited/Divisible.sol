pragma solidity 0.8.0;
import "hardhat/console.sol";
import "./Storage.sol";

// SPDX-License-Identifier: UNLICENSED

contract Divisible is Storage{

    constructor(uint _decimals) {
        _uint['decimals'] = _decimals;
    }

    function decimals() public view returns (uint8) {
        return uint8(_uint['decimals']);
    }

}