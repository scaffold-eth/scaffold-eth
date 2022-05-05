//SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract YourContract is ERC721URIStorage {
    address public owner;
    uint256 public _minted;
    uint256 public _ownerMinted;
    uint256 public MAX_SUPPLY = 100;
    uint256 public OWNER_SUPPLY = 5;
    uint256 public WHITELIST_PRICE = 1;
    uint256 public PUBLIC_MINT_PRICE = 2;
    uint256 public MAX_MINT_PER_WALLET = 1;
    string public baseURI;
    string public _name = "MotherNFT";
    string public _symbol = "MNFT";
    address[] public _payees;
    uint256[] public _shares;

    uint256 public _publicMintTimestamp;
    uint256 private _whitelistMintTimestamp;

    mapping(address => bool) private _whitelist;

    constructor() ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    modifier isContractOwner(address _owner) {
        require(msg.sender == _owner, "Not owner");
        _;
    }
    modifier whitelist() {
        require(isWhitelisted(msg.sender), "USER_IS_NOT_WHITELISTED");
        _;
    }

    modifier validateMint(uint256 buyAmount, bool isWhitelist) {
        require(
            isWhitelist
                ? _whitelistMintTimestamp > 0 &&
                    block.timestamp > _whitelistMintTimestamp + 20
                : _publicMintTimestamp > 0 &&
                    block.timestamp > _publicMintTimestamp + 20,
            "MINT_NOT_AVAILABLE"
        );

        require(
            isWhitelist
                ? msg.value >= WHITELIST_PRICE * buyAmount
                : msg.value >= PUBLIC_MINT_PRICE * buyAmount,
            "TRANSACTION_UNDERVALUED"
        );

        require(buyAmount <= MAX_MINT_PER_WALLET,
            "MAX_MINT_REACHED"
        );
        _;
    }

    function addToWhitelist(address[] memory addrs)
        public
        isContractOwner(owner)
    {
        for (uint256 i = 0; i < addrs.length; i++) {
            _whitelist[addrs[i]] = true;
        }
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return _whitelist[addr];
    }

    function setPublicMintDate(uint256 publicMintTimestamp)
        public
        isContractOwner(owner)
    {
        _publicMintTimestamp = publicMintTimestamp;
    }

    function setWhitelistMintDate(uint256 whitelistMintTimestamp)
        public
        isContractOwner(owner)
    {
        _whitelistMintTimestamp = whitelistMintTimestamp;
    }

    function teamMint() public isContractOwner(owner) {
        require(_ownerMinted < OWNER_SUPPLY, "OWNER_SUPPLY_REACHED");
        uint256 i;
        for (i = 0; i < OWNER_SUPPLY; i++) {
            _safeMint(msg.sender, _minted);
            _minted += 1;
            _ownerMinted += 1;
        }
    }

    function whitelistMint(uint256 buyAmount)
        public
        payable
        whitelist
        validateMint(buyAmount, true)
    {
        for (uint8 i = 0; i < buyAmount; i++) {
            _safeMint(msg.sender, _minted);
            _minted += 1;
        }
    }

    function publicMint(uint256 buyAmount)
        public
        payable
        validateMint(buyAmount, false)
    {
        for (uint8 i = 0; i < buyAmount; i++) {
            _safeMint(msg.sender, _minted);
            _minted += 1;
        }
    }

    function transferOwnership(address newOwner) public isContractOwner(owner) {
        owner = newOwner;
    }

    function getTokenIds() public view virtual returns (uint256) {
        return _minted;
    }

    function getOwnerTokenIds() public view virtual returns (uint256) {
        return _ownerMinted;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Nonexistent token");
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        ".jpeg"
                    )
                )
                : "";
    }

    function getBaseURI() public view returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _baseUri) public isContractOwner(owner) {
        baseURI = _baseUri;
    }
}