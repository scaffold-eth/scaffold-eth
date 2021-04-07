// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./GoodFundERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IGoodDataFeed.sol";
import "hardhat/console.sol";

contract GoodTokenFund is GoodFundERC1155, Ownable {
    using Counters for Counters.Counter;

    event FundCreated(
        address beneficiary,
        string metadataCid,
        uint256 tokenId
    );

    event ArtworkContribution(uint256 artworkId, uint256 weiContributed);

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

    // Tracks the next available fundId
    Counters.Counter private _tokenIdTracker;

    // mapping from tokenId => FundData
    mapping (uint256 => FundData) fundForToken;

    // mapping from fundId => tokenId
    mapping(string => uint256) tokenForFund;

    // mapping from tokenId => metadata ipfs cid
    mapping(uint256 => string) cidForToken;

    uint256 constant RANGE_DECIMALS = 5;
    uint256 constant TOKEN_DECIMALS_PER_ETH = 2; // basically 100 tokens per ETH

    constructor (
        address dataFeedAddress
    ) GoodFundERC1155("GoodTokenFund") public {
        dataFeed = IGoodDataFeed(dataFeedAddress);

        // start token tracker at 1 because 0 tokenId not in use
        _tokenIdTracker.increment();
    }

    /**
     @dev Returns the URI for a given token
     */
    function uri(uint256 id) external override view returns (string memory) {
        string memory ipfsPrefix = "ipfs://";
        return string(abi.encodePacked(ipfsPrefix, cidForToken[id]));
    }

    /**
     * @dev Calculates the correct amount of tokens to mint for a provided price.
     *   - Pulls in the feed data and then maps it to a range to find correct rate.
     */
    function calculateTokensToMint(uint256 tokenId, uint256 weiSupplied) public view returns (uint256) {
        
        FundData memory targetFund = fundForToken[tokenId];
        // check to make sure data exists
        require(targetFund.beneficiary != address(0), "GoodTokenFund: Not valid fund data!");
        
        uint256 latestFeedData = dataFeed.latestDataForFeed(targetFund.feedId);


        uint256 minRange = Math.min(targetFund.rangeMin, targetFund.rangeMax);
        uint256 maxRange = Math.max(targetFund.rangeMin, targetFund.rangeMax);
        uint256 clampedDataFeed = Math.max(minRange, Math.min(maxRange, latestFeedData));

        // the lerp value extended out "RANGE_DECIMALS" decimal places
        // need to check division by 0...
        uint256 divisor = Math.max(maxRange.sub(minRange), 1);
        uint256 lerp = ((clampedDataFeed.sub(minRange)).mul(RANGE_DECIMALS)).div(divisor);
        
        // check if should invert range
        if(targetFund.rangeMax < targetFund.rangeMin) {
            lerp = (10 ** RANGE_DECIMALS) - lerp;
        }

        console.log("lerp: %s", lerp);
        
        // mapping to range
        uint256 minMultiplier = 5 * (10 ** (RANGE_DECIMALS - 1)); // 50%
        uint256 maxMultiplier = 2 * (10 ** (RANGE_DECIMALS + 1)); // 200%

        uint256 lerpedMultipler = (minMultiplier + (maxMultiplier.sub(minMultiplier)).mul(lerp));
        console.log("Lerp multiplier: %s", lerpedMultipler);

        // TODO: mapping of range here!
        return weiSupplied.mul(lerpedMultipler).div(RANGE_DECIMALS + TOKEN_DECIMALS_PER_ETH);
        //console.log("Supplied wei: %s, Returned tokens: %s", weiSupplied, finalTokens);

    }


    /**
     * @dev Create a new token that is linked to a realworld data feed!
     *   - For now, only callable by the contract owner
     */
    function createNewToken(
        address beneficiary,
        string calldata fundId, // name of this fund
        string calldata feedId, // feedId on GoodDataFeed contract
        string calldata metadataCid,
        uint256 rangeMin,
        uint256 rangeMax
    ) external onlyOwner {
        uint256 tokenId = _tokenIdTracker.current();

        // no need to mint anything, just add new fund data
        fundForToken[tokenId] = FundData(
            beneficiary,
            feedId,
            rangeMin,
            rangeMax
        );

        tokenForFund[fundId] = tokenId;
        cidForToken[tokenId] = metadataCid;

        emit FundCreated(beneficiary, metadataCid, tokenId);
        _tokenIdTracker.increment();

    }


    /**
     * @dev Mints new tokens to msg.sender based on dynamic data feed and ETH provided
     */
    function mintFeedToken(string memory fundId) public payable {
        console.log(fundId);
        uint256 tokenId = tokenForFund[fundId];
        mint(tokenId);
    }

    /**
     * @dev Mints new tokens to msg.sender based on dynamic data feed and ETH provided
     */
    function mint(uint256 tokenId, uint256 artworkId) public payable {
        
        mint(tokenId);

        // emit artwork funding event
        emit ArtworkContribution(artworkId, msg.value);
    }

    function mint(uint256 tokenId) public payable {
        
        uint256 tokensToMint = calculateTokensToMint(tokenId, msg.value);

        // ensure not minting 0 tokens, so that in case of faulty data your ETH is returned
        require(tokensToMint > 0, "GoodTokenFund: Attempting to mint 0 tokens, aborting.");

        _mint(_msgSender(), tokenId, tokensToMint, "");
        address beneficiary = fundForToken[tokenId].beneficiary;
        payable(beneficiary).transfer(msg.value);

    }
}
