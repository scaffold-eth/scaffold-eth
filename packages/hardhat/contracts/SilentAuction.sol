pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./VerifySignature.sol";

contract SilentAuction is IERC721Receiver, Ownable, VerifySignature {
    bool public auctionInProgress;

    struct Auction {
        address nft;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
        uint256 amount;
        address payable bidder;
        bool settled;
    }

    // Since it's a blind auction, don't expose the current bid/bidder info
    struct AuctionView {
        address nft;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
    }

    Auction public auction;

    event AuctionSettled(address _nft, uint256 _tokenId, uint256 _amount, address _bidder);

    function currentAuction() public view returns (AuctionView memory) {
        return AuctionView({
            nft: auction.nft,
            tokenId: auction.tokenId,
            startTime: auction.startTime,
            endTime: auction.endTime
        });
    }

    function createAuction(address nft, uint256 tokenId) public onlyOwner {
        require(auctionInProgress == false, "Auction already in progress");

        auctionInProgress = true;

        auction = Auction({
            nft: nft,
            tokenId: tokenId,
            startTime: block.timestamp,
            endTime: block.timestamp + 180 seconds,
            amount: 0,
            bidder: payable(0),
            settled: false
        });

        IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function createBid(uint256 tokenId) public payable {
        require(auction.tokenId == tokenId, "TokenId not up for auction");
        require(block.timestamp < auction.endTime, "Auction already ended");
        require(msg.value > auction.amount, "You are not the high bidder");

        address payable lastBidder = auction.bidder;
        if (lastBidder != address(0)) {
            uint256 lastAmount = auction.amount;
            (bool success, ) = lastBidder.call{value: lastAmount}("");
            require(success, "Failed to send last bid amount");
        }

        auction.amount = msg.value;
        auction.bidder = payable(msg.sender);
    }

    function settleAuction() public onlyOwner {
        require(auction.startTime != 0, "Auction has not started");
        require(!auction.settled, "Auction has already been settled");

        auction.settled = true;
        auctionInProgress = false;
        (bool success, ) = owner().call{value: auction.amount}("");
        require(success, "Failed to transfer tokens");

        IERC721(auction.nft).safeTransferFrom(address(this), auction.bidder, auction.tokenId);

        emit AuctionSettled(auction.nft, auction.tokenId, auction.amount, auction.bidder);
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