pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./GoodERC721.sol";
import "./IToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract GoodToken is GoodERC721, Ownable {
    using Counters for Counters.Counter;

    /**
     * @dev Conditional Ownership Models
     */
    enum OwnershipModel {
        STATIC_BALANCE,
        DYNAMIC_BALANCE
    }

    event ArtworkMinted(
        uint256 artwork, address artist, uint256 price, uint8 ownershipModel, 
        uint256 balanceRequirement, uint64 balanceDurationInSeconds, 
        string artworkCid, string artworkRevokedCid, 
        address targetTokenAddress, uint256 targetTokenId
    );

    struct OwnershipConditionData {
        OwnershipModel ownershipModel;
        address targetTokenAddress;
        uint256 targetTokenId; // if > 0, then ERC1155 token!
        uint256 balanceRequirement;
        uint64 balanceDurationInSeconds; // for dynamic model
        uint256 purchaseDate;
    }

    struct ArtworkData {
        address artist;
        string artworkCid;
        string artworkRevokedCid;
        uint256 price;
    }

    // Constants
    uint256 public constant PAYMENT_GRACE_PERIOD = 20 seconds;
    uint8 public constant GOOD_SAMARITAN_BONUS = 20; // 5% of revoked price -- basically platform fee

    // Mapping of tokenId => ownership conditions
    mapping (uint256 => OwnershipConditionData) ownershipData;

    // Mapping of token ids to artwork data
    mapping (uint256 => ArtworkData) artworkData;

    // Mapping of tokenId to previous owner
    mapping (uint256 => address) previousOwner;

    // Mapping of revoker to transfer funds to later
    mapping (uint256 => address) goodSamaritans;

    Counters.Counter private _tokenIdTracker;



    constructor () GoodERC721("GoodToken", "GDTKN") public {
    }


    // returns the current balance and required balance for a token
    function checkBalanceState(uint256 tokenId) public view returns (uint256, uint256) {
        address tokenOwner = ownerOf(tokenId);
        OwnershipConditionData memory ownerData = ownershipData[tokenId];

        uint256 tokenBalance;
        if(ownerData.targetTokenId > 0) {
            tokenBalance = IToken(ownerData.targetTokenAddress)
                .balanceOf(tokenOwner, ownerData.targetTokenId);
        } else {
            tokenBalance = IToken(ownerData.targetTokenAddress).balanceOf(tokenOwner);
        }
        
        // Check ownership requirements
        if(ownerData.ownershipModel == OwnershipModel.STATIC_BALANCE) {
            console.log("required balance: %s\nsupplied balance: %s", ownerData.balanceRequirement, tokenBalance);
            return (tokenBalance, ownerData.balanceRequirement);

        } else if (ownerData.ownershipModel == OwnershipModel.DYNAMIC_BALANCE) {
            uint256 holdDuration = block.timestamp - ownerData.purchaseDate;
            uint256 holdPeriod = holdDuration.div(ownerData.balanceDurationInSeconds);
            uint256 requiredBalance = ownerData.balanceRequirement * holdPeriod;
            console.log("holdDuration: %s\nholdPeriod: %s", holdDuration, holdPeriod);

            return (tokenBalance, requiredBalance);           
        }
        return (0, 0);
    }

    /**
     * @dev Called by liquidation bot to revoke artworks from owner
     */
    function canRevoke(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist!");
        address tokenOwner = ownerOf(tokenId);
        
        // ensure contract does not own the artwork
        if(tokenOwner == address(this)) {
            return false;
        }
        
        OwnershipConditionData memory ownerData = ownershipData[tokenId];
        ArtworkData memory currentArtwork = artworkData[tokenId];

        bool revoked = false;

        // check if artwork is still owned by artist
        if(tokenOwner == currentArtwork.artist) {
            return false;
        }

        // if we are still within the grace period, ownership is not revoked
        if(ownerData.purchaseDate + PAYMENT_GRACE_PERIOD >= block.timestamp) {
            console.log("purchase date: %s\ncurrent time: %s", ownerData.purchaseDate, block.timestamp);
            console.log("Token still within grace period!");
            return false;
        }

        (uint256 currentBalance, uint256 requiredBalance) = checkBalanceState(tokenId);
        console.log("required balance: %s\ncurrent balance: %s", requiredBalance, currentBalance);
        if(currentBalance < requiredBalance) {
            console.log("Balance insufficient! Ownership revoked!");
            revoked = true;
        }

        return revoked;
    }

    /**
     @dev Check if is revoked.
     */
    function isRevoked(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) == address(this);
    }


    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) public override view returns (string memory) {
        require(_exists(tokenId), "Token does not exist!");

        ArtworkData memory currentArtwork = artworkData[tokenId];
        string memory ipfsPrefix = "ipfs://";

        if(isRevoked(tokenId)) {
            return string(abi.encodePacked(ipfsPrefix, currentArtwork.artworkRevokedCid));
        }

        return string(abi.encodePacked(ipfsPrefix, currentArtwork.artworkCid));
    }

    function totalSupply() public view override virtual returns (uint256) {
        return _tokenIdTracker.current();
    }


    /**
     * @dev Create tokens with ownership models
     */
    function createArtwork(
        string memory artworkCid,
        string memory artworkRevokedCid,
        OwnershipModel ownershipModel,
        address targetTokenAddress, 
        uint256 targetTokenId, // tokenId exists if using ERC1155 token
        uint256 balanceRequirement, // could be static or dynamic
        uint64 balanceDurationInSeconds,
        uint256 price
    ) public {
        uint256 currentArtwork = _tokenIdTracker.current();

        // mint new token to current token index
        _safeMint(_msgSender(), currentArtwork);
        
        // store artwork URLs and initial min bid
        artworkData[currentArtwork] = ArtworkData (
            _msgSender(),
            artworkCid,
            artworkRevokedCid,
            price
        );

        // stoer artwork ownership data
        ownershipData[currentArtwork] = OwnershipConditionData (
            ownershipModel,
            targetTokenAddress,
            targetTokenId,
            balanceRequirement,
            balanceDurationInSeconds,
            block.timestamp
        );

        // emit artwork creation event
        emit ArtworkMinted(
            currentArtwork,
            _msgSender(),
            artworkData[currentArtwork].price,
            uint8(ownershipData[currentArtwork].ownershipModel),
            ownershipData[currentArtwork].balanceRequirement,
            ownershipData[currentArtwork].balanceDurationInSeconds,
            artworkData[currentArtwork].artworkCid,
            artworkData[currentArtwork].artworkRevokedCid,
            targetTokenAddress,
            targetTokenId
        );

        // increment token index for next mint
        _tokenIdTracker.increment();
    }

    function payout(uint256 tokenId, address artistAddress, bool wasRevoked) internal {
        // if was revoked, payout to good samaritan and previous owner
        if (wasRevoked) {
            uint256 goodSamaritanFee = msg.value.div(GOOD_SAMARITAN_BONUS);
            uint256 previousOwnerValue = msg.value.sub(goodSamaritanFee);

            // transfer payments
            payable(goodSamaritans[tokenId]).transfer(goodSamaritanFee);
            payable(previousOwner[tokenId]).transfer(previousOwnerValue);

        } else {
            payable(artistAddress).transfer(msg.value);
        }
    }

    function buyArtwork(uint256 tokenId) public payable {
        require(_exists(tokenId), "GoodToken: artwork id doesn't exist");
        
        address sender = _msgSender();
        address owner = ownerOf(tokenId);
        require(owner != sender, "GoodToken: Artwork already owned by you!");

        ArtworkData memory currentArtwork = artworkData[tokenId];
        // ensure token can actually be purchased
        bool wasRevoked = isRevoked(tokenId); 
        // if revoke is possible, but not yet revoked, good samaritan is the buyer
        if(!wasRevoked && canRevoke(tokenId)) {
            goodSamaritans[tokenId] = sender;
            wasRevoked = true;
        }
        require(owner == currentArtwork.artist || wasRevoked );
        // verify minimum price
        require(msg.value >= currentArtwork.price, "GoodToken: Offer must meet minimum price");        

        // handle payments
        payout(tokenId, currentArtwork.artist, wasRevoked);
       
        // transfer ownership -- bypass safeTransferFrom checks because already validated
        _safeTransfer(owner, sender, tokenId, "");
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        safeTransferFrom(from, to, tokenId);
    }

    /**
     * @dev EXTERNAL transfer function -- needs to have proper checks
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        
        bool isApprovedOrOwner = _isApprovedOrOwner(_msgSender(), tokenId);
        bool isRevokable = canRevoke(tokenId) && (to == address(this));

        require(isApprovedOrOwner || isRevokable, "GoodToken: cannot transfer if not owner, not approved, or not valid revokation!");
        
        _safeTransfer(from, to, tokenId, "");
    }

    /**
     * @dev INTERNAL transfer function -- updates ownership data
     */
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal override {
        OwnershipConditionData storage ownerData = ownershipData[tokenId];
        // update purchase data
        ownerData.purchaseDate = block.timestamp;
        super._safeTransfer(from, to, tokenId, _data);
    }



    /**
     * @dev Revocation of artwork -- called by bot or liquidator
     *   - 
     */
    function revokeArtwork(uint256 tokenId) public {
        previousOwner[tokenId] = ownerOf(tokenId);
        
        safeTransferFrom(address(this), address(this), tokenId);

        goodSamaritans[tokenId] = _msgSender();
    }
}
