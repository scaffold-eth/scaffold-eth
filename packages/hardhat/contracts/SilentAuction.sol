pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SilentAuction is IERC721Receiver, Ownable {
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
        bool inProgress;
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
            endTime: block.timestamp + 60 seconds,
            inProgress: true
        });
        auction = a;
        IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}