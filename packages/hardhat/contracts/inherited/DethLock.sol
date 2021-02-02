pragma solidity 0.8.0;
import './Accountable.sol';

// SPDX-License-Identifier: UNLICENSED

contract DethLock is Accountable {

    // Dethlock core: ------------------------------------
    struct will{
        address payable owner;
        address payable beneficiary;
        uint ethBalance;
        address payable tokenAddress;
        uint tokenBalance;
        uint deadline;
    }

    will[] _masterWillList;
    mapping (address => uint[]) _owners;
    mapping (address => uint[]) _beneficiaries; 

}