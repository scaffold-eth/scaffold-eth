pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./VerifySignature.sol";

contract SilentAuction is IERC721Receiver, Ownable, VerifySignature {

    mapping(address => uint256) public stakedAmount;

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

    function stake() public payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        stakedAmount[msg.sender] += msg.value;
    }

    function getStakeAmount(address adr) public view returns(uint256) {
        return stakedAmount[adr];
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

    function completeAuction(address nft, uint256 tokenId, address bidder, uint256 amount, bytes memory signature) public {
        require(verify(bidder, tokenId, bidder, amount, signature), "Invalid signature");
        require(stakedAmount[bidder] >= amount, "Not enough staked");

        stakedAmount[bidder] -= amount;
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Failed to transfer tokens");

        IERC721(nft).safeTransferFrom(address(this), bidder, tokenId);
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