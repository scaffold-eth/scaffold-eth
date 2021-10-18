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
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @title Bufficorn - EthDenver PFP
/// @dev 
///  3 types of minting - cappted admin reserve, capped presale at discount, capped public sale
///
///  Presale:
///   - Merkle drop style validation of whitelist
///   - Price set on deploy
///   - Cap set on deploy
///   - Max 20 minted at a time
///
///  Open sale:
///   - Price set on deploy
///   - Cap set on deploy
///   - Max 20 minted at a time
///
///  Reserve mints:
///   - Owner can mint up to max reserved tokens
///
///  Token IDs: - Public and Presale tokens use the same incrementer
///             - Reserve mint uses reserved token IDs from 1-> reserve cap
///
///  Token URI: - base URI set on deploy
///             - Intended behavior: set a centralized CDN for assets on deploy and mint
///             - After reveal, swap base URI to decentralized storage like IPFS folder
///
contract Bufficorn is ERC721Enumerable, Ownable {
    uint256 constant MAX_PER_MINT = 20; /*Don't let people buy more than 20 per transaction*/
    uint256 RESERVED; /*Max token ID for reserve*/
    uint256 PRESALE_LIMIT; /*Max token ID for presale- set in constructor*/
    uint256 PUBLIC_LIMIT; /*Max token ID - set in constructor*/
    uint256 constant PRESALE_PRICE = 0.0528 ether; /*Discount for qualified addresses*/
    uint256 constant PUBLIC_PRICE = 0.1 ether; /*Public sale price*/

    address payable public ethSink; /*recipient for ETH*/

    using Counters for Counters.Counter;
    Counters.Counter private _reservedTokenIds; /*Tokens 1-> RESERVED*/
    Counters.Counter private _tokenIds; /*Tokens RESERVE + 1 -> PUBLIC_LIMIT*/

    bytes32 public root; /*Merkle root for presale*/
    string public baseURI; /*baseURI_ String to prepend to token IDs*/

    /// @dev Construtor sets the token and sale params
    /// @param baseURI_ String to prepend to token IDs
    /// @param _root Presale merkle tree root
    /// @param _reserved Number of tokens to reserve for special minting
    /// @param _presaleLimit Max token ID for presale - starts after _reserved
    /// @param _publicSaleLimit Max token ID - starts after _reserved
    /// @param _sink Recipient of sale ETH
    constructor(
        string memory baseURI_,
        bytes32 _root,
        uint256 _reserved,
        uint256 _presaleLimit,
        uint256 _publicSaleLimit,
        address payable _sink
    ) ERC721("Bufficorn Buidl Brigade", "BBB") {
        _setBaseURI(baseURI_);
        root = _root;

        RESERVED = _reserved;
        PRESALE_LIMIT = _presaleLimit;
        PUBLIC_LIMIT = _publicSaleLimit;

        ethSink = _sink;

        _tokenIds = Counters.Counter({_value: RESERVED}); /*Start token IDs after reserved tokens*/
    }

    // Track when presales and public sales are allowed
    enum ContractState {
        Presale,
        Public
    }
    mapping(ContractState => bool) public contractState;

    /*****************
    CONFIG FUNCTIONS
    *****************/

    /// @notice Set states enabled or disabled as owner
    /// @param _state 0: presale, 1: public sale
    /// @param _enabled specified state on or off
    function setContractState(ContractState _state, bool _enabled)
        external
        onlyOwner
    {
        contractState[_state] = _enabled;
    }

    /// @notice Set new base URI for token IDs
    /// @param baseURI_ String to prepend to token IDs
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _setBaseURI(baseURI_);
    }

    /// @notice Set new Merkle root for presale whitelist
    /// @param _root Merkle root of address tree
    function setRoot(bytes32 _root) external onlyOwner {
        root = _root;
    }


    /*****************
    EXTERNAL MINTING FUNCTIONS
    *****************/
    /// @notice Mint presale by qualified address. Must include valid proof for contract root
    /// @dev Presale state must be enabled
    /// @param _quantity How many tokens to buy - up to 20 at a time
    /// @param _proof Merkle proof for msg sender for contract root
    function mintPresale(uint256 _quantity, bytes32[] calldata _proof)
        external
        payable
    {
        require(contractState[ContractState.Presale], "!round");
        require(_verify(_leaf(msg.sender), _proof), "Invalid merkle proof");
        _purchase(_quantity, PRESALE_LIMIT, PRESALE_PRICE);
    }

    /// @notice Mint public by anyone
    /// @dev Public sale state must be enabled
    /// @param _quantity How many tokens to buy - up to 20 at a time
    function mintOpensale(uint256 _quantity) external payable {
        require(contractState[ContractState.Public], "!round");
        _purchase(_quantity, PUBLIC_LIMIT, PUBLIC_PRICE);
    }

    /// @notice Mint special reserve by owner
    /// @param _quantity How many tokens to mint
    function mintSpecial(uint256 _quantity) external onlyOwner {
        require(
            (_reservedTokenIds.current() + _quantity) <= RESERVED,
            "EXCEEDS CAP"
        );
        for (uint256 index = 0; index < _quantity; index++) {
            _mintReserved(msg.sender);
        }
    }


    /*****************
    INTERNAL MINTING FUNCTIONS AND HELPERS
    *****************/
    /// @notice Mint tokens and transfer eth to sink
    /// @dev Validations:
    ///      - Msg value is checked in comparison to price and quantity
    ///      - Quantity is checked in comparison to max per mint
    ///      - Quantity is checked in comparison to max supply
    /// @param _quantity How many tokens to mint
    /// @param _limit Limit for tokenIDs
    /// @param _price Price per token
    function _purchase(
        uint256 _quantity,
        uint256 _limit,
        uint256 _price
    ) internal {
        require((_tokenIds.current() + _quantity) <= _limit, "EXCEEDS CAP"); /*Check max new token ID compared to total cap*/
        require(_quantity <= MAX_PER_MINT, "TOO MUCH"); /*Check requested qty vs max*/
        require(msg.value >= _price * _quantity, "NOT ENOUGH"); /*Check if enough ETH sent*/

        (bool _success, ) = ethSink.call{value: msg.value}(""); /*Send ETH to sink first*/
        require(_success, "could not send");

        for (uint256 _index = 0; _index < _quantity; _index++) {
            _mintItem(msg.sender); /*Mint all tokens to sender*/
        }
    }

    /// @notice Mint tokens from presale and public pool
    /// @dev Token IDs come from separate pool after reserve
    /// @param _to Recipient of reserved tokens
    function _mintItem(address _to) internal {
        _tokenIds.increment();

        uint256 _id = _tokenIds.current();
        _safeMint(_to, _id);
    }

    /// @notice Mint tokens from reserve
    /// @dev Token IDs come from separate pool at beginning of counter
    /// @param _to Recipient of reserved tokens
    function _mintReserved(address _to) internal {
        _reservedTokenIds.increment();

        uint256 _id = _reservedTokenIds.current();
        _safeMint(_to, _id);
    }


    /// @notice internal helper to retrieve private base URI for token URI construction
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// @notice internal helper to update token URI
    /// @param baseURI_ String to prepend to token IDs
    function _setBaseURI(string memory baseURI_) internal {
        baseURI = baseURI_;
    }



    /*****************
    MERKLE DROP HELPERS
    *****************/
    /// @notice Internal util to calculate leaf for address
    /// @param _account Account to calculate
    function _leaf(address _account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_account));
    }

    /// @notice Internal verify merkle proof
    /// @param leaf_ Leaf to verify
    /// @param _proof Array of other hashes for proof calculation
    function _verify(bytes32 leaf_, bytes32[] memory _proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(_proof, root, leaf_);
    }

}
