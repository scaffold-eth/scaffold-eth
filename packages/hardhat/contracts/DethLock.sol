pragma solidity 0.8.0;
import './inherited/Accountable.sol';

// SPDX-License-Identifier: UNLICENSED

contract DethLock is Accountable {

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

}