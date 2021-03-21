pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./GoodERC721.sol";
import "./IToken.sol";
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

    event ArtworkRevoked(uint256 tokenId, address revokedFrom);
    event ArtworkMinted(
        uint256 artwork, address artist, uint256 price, uint8 ownershipModel, uint256 balanceRequirement, uint64 balanceDurationInSeconds, string artworkCid, string artworkRevokedCid, 
        address beneficiaryAddress, string beneficiaryName
    );

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant PAYMENT_GRACE_PERIOD = 20 seconds;


    Counters.Counter private _tokenIdTracker;

    struct OwnershipConditionData {
        OwnershipModel ownershipModel;
        address beneficiaryAddress;
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

    // Mapping of tokenId => ownership conditions
    mapping (uint256 => OwnershipConditionData) ownershipData;


    // Mapping of token ids to artwork data
    mapping (uint256 => ArtworkData) artworkData;


    // returns the current balance and required balance for a token
    function checkBalanceState(uint256 tokenId) public view returns (uint256, uint256) {
        address tokenOwner = super.ownerOf(tokenId);
        OwnershipConditionData memory ownerData = ownershipData[tokenId];
        ArtworkData memory currentArtwork = artworkData[tokenId];

        uint256 tokenBalance = IToken(ownerData.beneficiaryAddress).balanceOf(tokenOwner);
        
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
     * @dev Check if a token owner has defaulted on their artwork, resulting in
     * revoked ownership.
     */
    function isRevoked(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist!");
        address tokenOwner = super.ownerOf(tokenId);
        
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



    function ownerOf(uint256 tokenId) public view override returns (address) {
        require(_exists(tokenId), "Token does not exist!");
        
        bool revoked = isRevoked(tokenId);

        // If is revoked, the owner becomes the platform so can resell
        if(revoked) {
            return address(this);
        }

        return super.ownerOf(tokenId);
    }

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) public override view returns (string memory) {
        require(_exists(tokenId), "Token does not exist!");

        bool revoked = isRevoked(tokenId);

        ArtworkData memory currentArtwork = artworkData[tokenId];
        string memory ipfsPrefix = "ipfs://";

        if(revoked) {
            return string(abi.encodePacked(ipfsPrefix, currentArtwork.artworkRevokedCid));
        }

        return string(abi.encodePacked(ipfsPrefix, currentArtwork.artworkCid));
    }

    function totalSupply() public view override virtual returns (uint256) {
        return _tokenIdTracker.current();
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
        string memory artworkCid,
        string memory artworkRevokedCid,
        OwnershipModel ownershipModel,
        address beneficiaryAddress, 
        uint256 balanceRequirement, // could be static or dynamic
        uint64 balanceDurationInSeconds,
        uint256 price
    ) public  {
        //require(hasRole(MINTER_ROLE, sender), "GoodToken: must have minter role to mint");
        
        uint256 currentArtwork = _tokenIdTracker.current();

        // get metadata from associated token contract
        IToken token = IToken(beneficiaryAddress);

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
            beneficiaryAddress,
            balanceRequirement,
            balanceDurationInSeconds,
            block.timestamp
        );

        // emit artwork creation event
        emit ArtworkMinted(
            currentArtwork,
            _msgSender(),
            price,
            uint8(ownershipModel),
            balanceRequirement,
            balanceDurationInSeconds,
            artworkCid,
            artworkRevokedCid,
            beneficiaryAddress,
            token.name()
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
        
        require(owner != sender, "GoodToken: Artwork already owned by you!");

        if(owner == address(this)) {
            emit ArtworkRevoked(artwork, super.ownerOf(artwork));
        }

        // transfer ownership
        safeTransferFrom(owner, sender, artwork);

        payable(currentArtwork.artist).transfer(msg.value);
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
        _safeTransfer(from, to, tokenId, "");
    }
}
