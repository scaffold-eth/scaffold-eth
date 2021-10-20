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
        uint endTime;
    }

    Auction public auction;

    function stake() public payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        stakedAmount[msg.sender] += msg.value;
    }

    function widthdrawStake() public payable {
        require(stakedAmount[msg.sender] > 0, "No stake to widthdraw");
        uint256 amount = stakedAmount[msg.sender];
        stakedAmount[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw staked amount");
    }

    function getStakeAmount(address adr) public view returns(uint256) {
        return stakedAmount[adr];
    }

    function currentAuction() public view returns (Auction memory) {
        return auction;
    }

    function createAuction(address nft, uint256 tokenId) public onlyOwner {
        require(auction.endTime < block.timestamp, "Auction already in progress");

        Auction memory a = Auction({
            nft: nft,
            tokenId: tokenId,
            endTime: block.timestamp + 24 hours
        });
        auction = a;
        IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function completeAuction(address nft, uint256 tokenId, address bidder, uint256 amount, bytes memory signature) public {
        require(0 < auction.endTime, "Auction has not started");
        require(block.timestamp < auction.endTime, "Auction has not ended");
        require(stakedAmount[bidder] >= amount, "Not enough staked");
        require(verify(bidder, tokenId, bidder, amount, signature), "Invalid signature");

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