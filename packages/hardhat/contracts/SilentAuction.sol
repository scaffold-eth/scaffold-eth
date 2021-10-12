pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract SilentAuction {
    // assuming just 1 item for now
    mapping(address => uint) public bids;
    uint public highestBid = 0;

    function bid(uint256 amount) public {
        bids[msg.sender] = amount;
        if (amount > highestBid) {
            highestBid = amount;
        }
    }
}