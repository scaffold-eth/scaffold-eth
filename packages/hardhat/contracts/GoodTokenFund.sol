// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IGoodDataFeed.sol";
import "hardhat/console.sol";

contract GoodTokenFund is ERC1155, Ownable {
    using Counters for Counters.Counter;

    struct FundData {
        // fund recipient -- most likely will be a charity
        address beneficiary;
        // the feedId for external data from orable feed
        string feedId;
        // mapping for calculating the amount of tokens to mint
        // or should this be done in the ORACLE? -- could have health factor in oracle
        uint256 rangeMin;
        uint256 rangeMax;
    }

    // Orable contract that updates real data from nonprofits
    IGoodDataFeed dataFeed;

    Counters.Counter private _tokenIdTracker;

    // mapping from tokenId => FundData
    mapping( uint256 => FundData) tokenData;


    constructor (
        address dataFeedAddress
    ) ERC1155("GoodTokenFund") public {
        dataFeed = IGoodDataFeed(dataFeedAddress);

        // start token tracker at 1 because 0 tokenId not in use
        _tokenIdTracker.increment();
    }


    function calculateTokensToMint(uint256 tokenId, uint256 ethSupplied) public view returns (uint256) {
        
        FundData memory targetFund = tokenData[tokenId];
        // check to make sure data exists
        require(targetFund.beneficiary != address(0), "GoodTokenFund: Not valid fund data!");
        
        uint256 latestFeedData = dataFeed.latestDataForFeed(targetFund.feedId);

        // TODO: mapping of range here!
        return latestFeedData * ethSupplied;
    }


    /**
     * @dev Create a new token that is linked to a realworld data feed!
     */
    function createNewToken(
        address beneficiary,
        string calldata feedId, // feedId on GoodDataFeed contract
        uint256 rangeMin,
        uint256 rangeMax
    ) external onlyOwner {




    }


    function mint(uint256 tokenId) public payable {
        
        uint256 tokensToMint = calculateTokensToMint(tokenId, msg.value);

        // ensure not minting 0 tokens, so that in case of faulty data your ETH is returned
        require(tokensToMint > 0, "GoodTokenFund: Attempting to mint 0 tokens, aborting.");

        _mint(_msgSender(), tokenId, tokensToMint, "");
        address beneficiary = tokenData[tokenId].beneficiary;
        payable(beneficiary).transfer(msg.value);
    }
}
