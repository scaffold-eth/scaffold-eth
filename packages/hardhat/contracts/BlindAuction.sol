pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BlindAuction is IERC721Receiver, Ownable {
    bool public auctionInProgress;

    struct Bid {
        bytes32 blindBid;
        bool revealed;
    }

    mapping(uint256 => mapping(address => Bid)) public bids;

    struct Auction {
        address nft;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address payable bidder;
        bool settled;
    }

    Auction public auction;

    event AuctionSettled(address _nft, uint256 _tokenId, uint256 _amount, address _bidder);
    event BidRevealed(address _nft, uint256 _tokenId, uint256 _amount, address _bidder);

    function currentAuction() public view returns (Auction memory) {
        return auction;
    }

    function createAuction(address nft, uint256 tokenId) public onlyOwner {
        require(auctionInProgress == false, "Auction already in progress");

        auctionInProgress = true;

        auction = Auction({
            nft: nft,
            tokenId: tokenId,
            startTime: block.timestamp,
            endTime: block.timestamp + 3 minutes,
            highestBid: 0,
            bidder: payable(0),
            settled: false
        });

        IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function revealBid(uint256 tokenId, bytes32 blindBid) public payable {
        require(bids[tokenId][msg.sender].blindBid != 0, "You haven't placed a bid");
        require(bids[tokenId][msg.sender].revealed == false, "You already revealed your bid");
        require(bids[tokenId][msg.sender].blindBid == blindBid, "Your bid is invalid");

        bids[tokenId][msg.sender].revealed = true;

        emit BidRevealed(auction.nft, auction.tokenId, msg.value, msg.sender);

        require(msg.value > auction.highestBid, "Your bid is not higher than the current highest bid");

        address previousHighBidder = auction.bidder;
        uint256 previousHighestBid = auction.highestBid;

        auction.highestBid = msg.value;
        auction.bidder = payable(msg.sender);

        (bool success, ) = previousHighBidder.call{value: previousHighestBid}("");
        require(success, "Failed to send last bid amount");
    }

    function createBid(uint256 tokenId, bytes32 blindBid) public {
        require(auction.tokenId == tokenId, "TokenId not up for auction");
        require(block.timestamp < auction.endTime, "Auction already ended");
        require(bids[tokenId][msg.sender].blindBid == 0, "You already placed a bid");

        bids[tokenId][msg.sender].blindBid = blindBid;
        bids[tokenId][msg.sender].revealed = false;
    }

    function settleAuction() public onlyOwner {
        require(auction.startTime != 0, "Auction has not started");
        require(!auction.settled, "Auction has already been settled");

        auction.settled = true;
        auctionInProgress = false;
        (bool success, ) = owner().call{value: auction.highestBid}("");
        require(success, "Failed to transfer tokens");

        // Transfer back to owner if there were no bids
        if (auction.bidder != address(0)) {
            IERC721(auction.nft).safeTransferFrom(address(this), auction.bidder, auction.tokenId);
        } else {
            IERC721(auction.nft).safeTransferFrom(address(this), owner(), auction.tokenId);
        }

        emit AuctionSettled(auction.nft, auction.tokenId, auction.highestBid, auction.bidder);
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