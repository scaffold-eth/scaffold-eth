pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./GoodERC721.sol";
import "./IBalanceOf.sol";


contract GoodToken is GoodERC721 {
    
    /**
     * @dev Conditional Ownership Models
     */
    enum OwnershipModel {
        STATIC_BALANCE,
        DYNAMIC_BALANCE
    }


    address owner;
    mapping (address => bool) artistWhitelist;
    
    

    struct OwnershipConditionData {
        OwnershipModel ownershipModel;
        address targetContractAddress;
        uint256 balanceRequirement;
        uint256 balanceDuration; // for dynamic model
        uint256 purchaseDate;
    }

    // Mapping of tokenId => ownership conditions
    mapping (uint256 => OwnershipConditionData) ownershipData;

    // Mapping of tokenOwners to targetAddresses to tokenId
    //mapping (address => EnumerableMap) 



    function ownerOf(uint256 tokenId) public view override returns (address) {
        require(_exists(tokenId), "Token does not exist!");
        
        address tokenOwner = super.ownerOf(tokenId);
        OwnershipConditionData storage ownerData = ownershipData[tokenId];
        uint256 tokenBalance = IBalanceOf(ownerData.targetContractAddress).balanceOf(tokenOwner);

        bool ownershipValid = true;

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

        return address(0);
    }

    function whitelistArtist(address artistAddress) public {
        require(msg.sender == owner, "Only onwer can whitelistlist funds");
        artistWhitelist[artistAddress] = true;
    }


    constructor () GoodERC721("GoodToken", "GDTKN") public {
        owner = msg.sender;
    }

    /**
     * @dev Create tokens with ownership models
     */
    // function createArtwork(
    //     string memory artworkUrl,
    //     string memory revokedArtworkUrl,
    //     OwnershipModel ownershipModel,
    //     address targetTokenAddress,
    //     uint256 balanceRequirement, // could be static or dynamic

    // ) {
    //     require()
    // }




}
