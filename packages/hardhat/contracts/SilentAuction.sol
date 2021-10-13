pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SilentAuction is Ownable {
    // assuming just 1 item for now
    mapping(address => uint) public bids;
    uint public highestBid = 0;

    struct Auction {
        address nft;
        uint256 tokenId;
        uint startPrice;
        uint endPrice;
        uint startTime;
        uint endTime;
    }

    Auction public auction;

    modifier onlyBeforeEnd() {
        require(block.timestamp < auction.endTime, "Auction has ended");
        _;
    }

    function bid(uint256 amount) public onlyBeforeEnd {
        bids[msg.sender] = amount;
        if (amount > highestBid) {
            highestBid = amount;
        }
    }

    function auctionInProgress() public view returns (bool) {
        return auction.startTime < block.timestamp && block.timestamp < auction.endTime;
    }

    function currentAuction() public view returns (Auction memory) {
        return auction;
    }

    function createAuction(address nft, uint256 tokenId) public onlyOwner {
        Auction memory a = Auction({
            nft: nft,
            tokenId: tokenId,
            startPrice: 0,
            endPrice: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + 60 seconds
        });
        auction = a;
    }
}