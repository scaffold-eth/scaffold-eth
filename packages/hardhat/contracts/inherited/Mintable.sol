pragma solidity 0.8.0;
import "hardhat/console.sol";
import "./Accountable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Mintable is Accountable{
    
    constructor (uint256 price){
        _uint['price'] = price;
    }

    function totalSupply() public view returns (uint256){

    }

    function balanceOf(address _owner) public view returns (uint256 balance){

    }
}