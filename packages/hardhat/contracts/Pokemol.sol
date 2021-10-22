pragma solidity >=0.8.0;
//SPDX-License-Identifier: MIT

/*
 ___             .-.    .-.                                          
(   )           /    \ /    \  .-.                                   
 | |.-. ___  ___| .`. ;| .`. ;( __) .--.    .--.  ___ .-.  ___ .-.   
 | /   (   )(   ) |(___) |(___|''")/    \  /    \(   )   \(   )   \  
 |  .-. | |  | || |_   | |_    | ||  .-. ;|  .-. ;| ' .-. ;|  .-. .  
 | |  | | |  | (   __)(   __)  | ||  |(___) |  | ||  / (___) |  | |  
 | |  | | |  | || |    | |     | ||  |    | |  | || |      | |  | |  
 | |  | | |  | || |    | |     | ||  | ___| |  | || |      | |  | |  
 | '  | | |  ; '| |    | |     | ||  '(   ) '  | || |      | |  | |  
 ' `-' ;' `-'  /| |    | |     | |'  `-' |'  `-' /| |      | |  | |  
  `.__.  '.__.'(___)  (___)   (___)`.__,'  `.__.'(___)    (___)(___) 
                                                                     
*/

// https://github.com/scaffold-eth/scaffold-eth/tree/bufficorn-buidl-brigade

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/base64.sol";

interface IMOLOCH {
    // brief interface for moloch dao v2

    function depositToken() external view returns (address);

    function tokenWhitelist(address token) external view returns (bool);

    function totalShares() external view returns (uint256);

    function getProposalFlags(uint256 proposalId)
        external
        view
        returns (bool[6] memory);

    function getUserTokenBalance(address user, address token)
        external
        view
        returns (uint256);

    function members(address user)
        external
        view
        returns (
            address,
            uint256,
            uint256,
            bool,
            uint256,
            uint256
        );

    function memberAddressByDelegateKey(address user)
        external
        view
        returns (address);

    function userTokenBalances(address user, address token)
        external
        view
        returns (uint256);

    function cancelProposal(uint256 proposalId) external;

    struct Proposal {
        address applicant; // the applicant who wishes to become a member - this key will be used for withdrawals (doubles as guild kick target for gkick proposals)
        address proposer; // the account that submitted the proposal (can be non-member)
        address sponsor; // the member that sponsored the proposal (moving it into the queue)
        uint256 sharesRequested; // the # of shares the applicant is requesting
        uint256 lootRequested; // the amount of loot the applicant is requesting
        uint256 tributeOffered; // amount of tokens offered as tribute
        address tributeToken; // tribute token contract reference
        uint256 paymentRequested; // amount of tokens requested as payment
        address paymentToken; // payment token contract reference
        uint256 startingPeriod; // the period in which voting can start for this proposal
        uint256 yesVotes; // the total number of YES votes for this proposal
        uint256 noVotes; // the total number of NO votes for this proposal
        bool[6] flags; // [sponsored, processed, didPass, cancelled, whitelist, guildkick]
        string details; // proposal details - could be IPFS hash, plaintext, or JSON
        uint256 maxTotalSharesAndLootAtYesVote; // the maximum # of total shares encountered at a yes vote on this proposal
    }

    function proposals(uint256 proposalId)
        external
        view
        returns (
            address,// the applicant who wishes to become a member - this key will be used for withdrawals (doubles as guild kick target for gkick proposals)
            address,// the account that submitted the proposal (can be non-member)
            address,// the member that sponsored the proposal (moving it into the queue)
            uint256,// the # of shares the applicant is requesting
            uint256,
            uint256,
            address,
            uint256,
            address,
            uint256,
            uint256,
            uint256
        );
}

/// @title Pokemol
/// @dev 
///  Purchase a portal for a DAO
///  DAO members can mint Pokemols
contract Pokemol is ERC721Enumerable, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; /*Tokens RESERVE + 1 -> PUBLIC_LIMIT*/

    /// @dev Construtor sets the token and sale params
    constructor(
    ) ERC721("Pokemol", "PKM") {
    }


    /*****************
    CONFIG FUNCTIONS
    *****************/


    /*****************
    EXTERNAL MINTING FUNCTIONS
    *****************/


    /// @notice Mint special reserve by owner
    function mintDemo() external {
            _mintItem(msg.sender);
    }


    /*****************
    INTERNAL MINTING FUNCTIONS AND HELPERS
    *****************/

    /// @notice Mint tokens from presale and public pool
    /// @dev Token IDs come from separate pool after reserve
    /// @param _to Recipient of reserved tokens
    function _mintItem(address _to) internal {
        _tokenIds.increment();

        uint256 _id = _tokenIds.current();
        _safeMint(_to, _id);
    }


    /// @notice Constructs the tokenURI, separated out from the public function as its a big function.
    /// @dev Generates the json data URI and svg data URI that ends up sent when someone requests the tokenURI
    /// @param _tokenId the tokenId
    function _constructTokenURI(uint256 _tokenId)
        internal
        view
        returns (string memory)
    {
        // address _address = _owners[_tokenId];
        // Member storage _member = members[_address];

        string memory _nftName = string(
            abi.encodePacked("Pokemol ")
        );

        string memory _baalMetadataSVGs =
                string(abi.encodePacked(
                    '<image href="https://gateway.pinata.cloud/ipfs/QmWen79eThj9GgwCVt9kw8GuvGPXEReFESE6u9JL9PdpnN/Gittron__Arms--1.svg"/>',
                    '<image href="https://gateway.pinata.cloud/ipfs/QmWen79eThj9GgwCVt9kw8GuvGPXEReFESE6u9JL9PdpnN/Gittron__Legs--4.svg"/>'
                ));

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" style="font:14px serif"><rect width="400" height="400" fill="black" />',
            _baalMetadataSVGs,
            "</svg>"
        );

        bytes memory _image = abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                _nftName,
                                '", "image":"',
                                _image,
                                // Todo something clever
                                '", "description": "Member of Baal. Dynamically generated NFT showing member voting weight"}'
                            )
                        )
                    )
                )
            );
    }

    /// @notice Returns the json data associated with this token ID
    /// @param _tokenId the token ID
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return string(_constructTokenURI(_tokenId));
    }



}
