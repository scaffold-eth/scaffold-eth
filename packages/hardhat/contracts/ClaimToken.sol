pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ClaimToken is ERC721, ERC721URIStorage, ERC721Enumerable,  Ownable  {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;                  // Claim Token Ids global variable, no two claims will ever have same ID number
    Counters.Counter public totalClaimTokens;            // Counter for total claim tokens created.
    using SafeMath for uint256;                          // Protects against overfill/underfill
    using EnumerableSet for EnumerableSet.AddressSet;    // Enumerable set of addresses

    //Possible beneficiary addresses
    address NGO=0x1dE26bAEf3d4Ff0fbAc28a6C1532494A40438B3D;
    address LocalExporterA=0xF08E19B6f75686f48189601Ac138032EBBd997f2;
    address LocalExporterB=0x3e49CdB6C633b50443A504134345738837634aD4;
    address CoopA=0x68C1766Fdf7fFae8ea8F10b26078bA47658BC5Bc;
    address CoopB=0x7Fd8898fBf22Ba18A50c0Cb2F8394a15A182a07d;


    // Initiate ERC721 contract using OpenZep library
    constructor() public ERC721("PropertyClaim", "PC") {}


    //------------------------------------------------Overrides---------------------------------------------------------------------//
    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //------------------------------------------------Events------------------------------------------------------------------------//
    event newClaimCreated(uint256 id, string location, address landlord, string propertiesHash, bool exists, uint256 beneficiaryPay);
    event newClaimMinted(uint256 id, string location,  address landlord, string propertiesHash);
    event addedBeneficiary(address _addedBene, address _addedBy, uint256 id, string location, string tags, uint256 benePay);



    //Claim Struct
    struct Claim {
      uint256 Id;                                                   // ID of goldAsset relative to the totalAssets counter.
      string location;                                              // Direct identifier of physical asset, can be scanable via QR to barcode. This property connects the item in real life to this struct. Can be verified via propertiesHash
      address payable landlord;                                     // Address associated can create and mint the asset as well as add beneficiaries to the asset.
      string propertiesHash;                                        // An algorithic hash of the claim properties.
      bool exists;                                                  // Used for security of the asset. More protection against duplicates.
      EnumerableSet.AddressSet Beneficiaries;                       // Beneficiaries which can recieve incentive tokens upon minting of asset. (NGO's, local exporter, Co-op, etc...). Can be added only by asset manager.
      uint256 beneficiaryPay;                                       // Amount of ADP the Beneficiaries will recieve. Based on the weight and purity inputted to claim. 
    }


    mapping (string => uint256) public claimIdByLocation;              // Input asset barcodeId to access ID of that specific asset.   
    mapping (uint256 => Claim) claimById;                              // Input asset ID provided from the mapping above to access asset struct.
    mapping (uint256 => string) public locationByTokenId;              // Input asset ID to get barcodeId of that asset.
    mapping (string => string) public claimByLocation;                 // Input asset barcode to get claim properties hash. 

    //Create a struct for a specific asset. Private Function.
    //Emit the tokenId for the event created. tokenId to be the totalAssets.incremented.
    function _createClaim(string memory location, address payable landlord, string memory propertiesHash, uint256 benePay, address[] memory beneAddresses) private returns (uint256) {
        totalClaimTokens.increment();             // Add to claim total
        uint id = totalClaimTokens.current();     // use current total integer as the token id
        Claim storage cm = claimById[id];         // set properties
        cm.Id = id;                               // set new token ID
        cm.location = location;                   // set physical property location
        cm.landlord = landlord;                   // set msg.sender as landlord
        cm.propertiesHash = propertiesHash;       // set properties hash
        cm.exists = true;                         // for quick lookup
        for (uint i=0; i<beneAddresses.length; i++) {
            cm.Beneficiaries.add(beneAddresses[i]);     // Add a beneficiary from pre-approved list. 
        }
        cm.beneficiaryPay = benePay;
        claimIdByLocation[location] = cm.Id;    // Connect claim token ID with the physical barcode on product.
        claimByLocation[location] = cm.propertiesHash;

        emit newClaimCreated(cm.Id, cm.location, cm.landlord, cm.propertiesHash, cm.exists, cm.beneficiaryPay);  
    }


    // Call this function for creating an claim struct. Then call the mintClaimToken function to mint the current token ID.
    function createClaim(string memory location, string memory propertiesHash, uint256 benePay, address[] memory beneAddresses) public returns (uint256) {
        require(!(claimIdByLocation[location] > 0), "This event already exists!");
        uint256 assetId = _createClaim(location, payable (msg.sender), propertiesHash, benePay, beneAddresses);

        return assetId;
    }


    // Internal function used to mint tokens for a specific event. Private Function.
    // Determine whether asset has been already minted or not. Validate inputs to the struct claim created.
    // This is taking the place of a "claims" office. This fucntion with others can validate information like the claims office. 
    function _mintClaim(address to, string memory location, string memory propertiesHash) private returns (uint256) {
        _tokenIds.increment();                   // new token ID
        uint256 id = _tokenIds.current();        //gets current events ID.
        locationByTokenId[id] = location;        //access the specific asset after inputing the barcodeId information.

        _mint(to, id);
        _setTokenURI(id, propertiesHash);

        emit newClaimMinted(id, location, msg.sender, propertiesHash);

        return id;
    }

    // Call this function for minting an asset to a specific landlord.
    // Function checks the msg.sender is the landlord and that particular asset has not already been minted.
    function mintClaim(string memory location, string memory propertiesHash) public returns (uint256) {
        string memory claimPropHash = claimByLocation[location];
        if ( keccak256(abi.encodePacked((claimPropHash))) == keccak256(abi.encodePacked((propertiesHash))) ){
            uint256 claimId = _mintClaim(msg.sender, location, propertiesHash);
            return claimId;
        }
        else{
            return(0);
        }
    }

    function createAndMintClaim(string memory location, string memory propertiesHash, uint256 benePay, address[] memory beneAddresses) public returns (uint256) {
        createClaim(location, propertiesHash, benePay, beneAddresses);
        mintClaim(location, propertiesHash);
    }

} 
