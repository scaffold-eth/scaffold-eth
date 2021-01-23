pragma solidity 0.8.0;
import './Accountable.sol';

// SPDX-License-Identifier: UNLICENSED

contract Storage is Accountable {
    bool public _initialized;

    // Dethlock core: ------------------------------------
    struct will{
        uint ethBalance;
        address payable tokenAddress;
        uint tokenBalance;
        uint deadline;
    }

    mapping (uint => will) masterWillList;
    mapping (address => uint[]) owners;
    mapping (address => uint[]) benificiaries; 

    // For upgradeability: -------------------------------
    mapping (string => bool) _bool;

    mapping (string =>  int256) _int;  // All int types store as 256.
    mapping (string => uint256) _uint; 


    mapping (string => address) _address;
    mapping (string => address payable) _payable;


    mapping (string =>  string) _string;
    mapping (string => bytes32) _bytes;

    // Not fully supported yet:
    mapping (string => fixed256x2) _fixed2;

}