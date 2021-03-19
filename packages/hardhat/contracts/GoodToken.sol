pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./GoodERC721.sol";
import "./IBalanceOf.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



contract GoodToken is GoodERC721, AccessControl {
    using Counters for Counters.Counter;

    /**
     * @dev Conditional Ownership Models
     */
    enum OwnershipModel {
        STATIC_BALANCE,
        DYNAMIC_BALANCE
    }

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    Counters.Counter private _tokenIdTracker;

    struct OwnershipConditionData {
        OwnershipModel ownershipModel;
        address targetAddress;
        uint256 balanceRequirement;
        uint256 balanceDuration; // for dynamic model
        uint256 purchaseDate;
    }

    struct ArtworkData {
        address artist;
        string artworkUrl;
        string artworkRevokedUrl;
        uint256 price;
    }

    // Mapping of tokenId => ownership conditions
    mapping (uint256 => OwnershipConditionData) ownershipData;


    // Mapping of token ids to artwork data
    mapping (uint256 => ArtworkData) artworkData;

    function ownerOf(uint256 tokenId) public view override returns (address) {
        require(_exists(tokenId), "Token does not exist!");
        
        address tokenOwner = super.ownerOf(tokenId);
        
        OwnershipConditionData memory ownerData = ownershipData[tokenId];
        ArtworkData memory currentArtwork = artworkData[tokenId];

        uint256 tokenBalance = IBalanceOf(ownerData.targetAddress).balanceOf(tokenOwner);

        bool ownershipValid = true;

        // check if artwork is still owned by artist
        if(tokenOwner == currentArtwork.artist) {
            return tokenOwner;
        }

        // Check ownership requirements
        if(ownerData.ownershipModel == OwnershipModel.STATIC_BALANCE) {

            if(tokenBalance < ownerData.balanceRequirement) {
                ownershipValid = false;
            }
            
        } else if (ownerData.ownershipModel == OwnershipModel.DYNAMIC_BALANCE) {
            uint256 holdDuration = block.timestamp - ownerData.purchaseDate;
            uint256 holdWeeks = holdDuration.div(ownerData.balanceDuration);
            uint256 requiredBalance = ownerData.balanceRequirement * holdWeeks;

            if(tokenBalance < requiredBalance) {
                ownershipValid = false;
            }            

        }

        if(ownershipValid) {
            return tokenOwner;
        }

        return address(this);
    }

    constructor () GoodERC721("GoodToken", "GDTKN") public {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function whitelistArtist(address artistAddress, bool whitelisted) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "GoodToken: must have admin role to whitelist");
        
        if(whitelisted) {
            grantRole(MINTER_ROLE, artistAddress);
        } else {
            revokeRole(MINTER_ROLE, artistAddress);
        }
    }

    /**
     * @dev Create tokens with ownership models
     */
    function createArtwork(
        string memory artworkUrl,
        string memory revokedArtworkUrl,
        OwnershipModel ownershipModel,
        address targetAddress, 
        uint256 balanceRequirement, // could be static or dynamic
        uint256 balanceDuration,
        uint256 price
    ) public {
        address sender = _msgSender();

        require(hasRole(MINTER_ROLE, sender), "GoodToken: must have minter role to mint");
        
        uint256 currentArtwork = _tokenIdTracker.current();

        // mint new token to current token index
        _safeMint(sender, currentArtwork);
        
        // store artwork URLs and initial min bid
        artworkData[currentArtwork] = ArtworkData (
            sender,
            artworkUrl,
            revokedArtworkUrl,
            price
        );

        // stoer artwork ownership data
        ownershipData[currentArtwork] = OwnershipConditionData (
            ownershipModel,
            targetAddress,
            balanceRequirement,
            balanceDuration,
            block.timestamp
        );

        // increment token index for next mint
        _tokenIdTracker.increment();
    }

    function buyArtwork(uint256 artwork) public payable {
        address sender = _msgSender();
        address owner = ownerOf(artwork);
        ArtworkData memory currentArtwork = artworkData[artwork];

        require(_exists(artwork), "GoodToken: artwork id doesn't exist");

        // verify minimum price
        require(msg.value >= currentArtwork.price, "GoodToken: Offer must meet minimum price");
        
        // verify artwork is up for sale
        require(owner == address(this) || owner == currentArtwork.artist, "GoodToken: Artwork is not currently for sale");

        // transfer ownership
        safeTransferFrom(owner, sender, artwork);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(ownerOf(tokenId), tokenId), "GoodToken: transfer caller is not owner nor approved");

        OwnershipConditionData storage ownerData = ownershipData[tokenId];

        // update purchase data
        ownerData.purchaseDate = block.timestamp;

        _transfer(from, to, tokenId);
    }
}
