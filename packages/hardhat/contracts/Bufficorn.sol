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

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Bufficorn is ERC721Enumerable, Ownable {
    uint256 constant MAX_PER_MINT = 20;
    uint256 constant RESERVED = 150;
    uint256 constant PRESALE_LIMIT = 5280;
    uint256 constant PUBLIC_LIMIT = 10000;
    uint256 constant PRESALE_PRICE = 0.0528 ether;
    uint256 constant PUBLIC_PRICE = 0.1 ether;

    address payable public constant ethSink =
        payable(0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6);

    using Counters for Counters.Counter;
    Counters.Counter private _reservedTokenIds;
    Counters.Counter private _tokenIds = Counters.Counter({_value: RESERVED});

    bytes32 public root;
    string public baseURI;

    constructor(string memory baseURI_, bytes32 _root)
        ERC721("Bufficorn Buidl Brigade", "BBB")
    {
        _setBaseURI(baseURI_);
        root = _root;
    }

    // todo on script - full set attribute

    enum ContractState {
        Presale,
        Public
    }

    mapping(ContractState => bool) public contractState;

    function _mintReserved(address to) internal returns (uint256) {
        _reservedTokenIds.increment();

        uint256 id = _reservedTokenIds.current();
        _safeMint(to, id);

        return id;
    }

    function _mintItem(address to) internal returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(to, id);

        return id;
    }

    function _purchase(
        uint256 quantity,
        uint256 limit,
        uint256 price
    ) internal {
        require((_tokenIds.current() + quantity) < limit, "EXCEEDS CAP");
        require(quantity <= MAX_PER_MINT, "TOO MUCH");
        require(msg.value >= price * quantity, "NOT ENOUGH");

        (bool success, ) = ethSink.call{value: msg.value}("");

        require(success, "could not send");

        for (uint256 index = 0; index < quantity; index++) {
            _mintItem(msg.sender);
        }
    }

    function mintPresale(uint256 quantity, bytes32[] calldata proof)
        external
        payable
    {
        require(contractState[ContractState.Presale], "!round");
        require(_verify(_leaf(msg.sender), proof), "Invalid merkle proof");
        // require qualifies
        _purchase(quantity, PRESALE_LIMIT, PRESALE_PRICE);
    }

    function mintOpensale(uint256 quantity) external payable {
        require(contractState[ContractState.Public], "!round");
        // require qualifies
        _purchase(quantity, PUBLIC_LIMIT, PUBLIC_PRICE);
    }

    function mintSpecial(uint256 quantity) external onlyOwner {
        require(
            (_reservedTokenIds.current() + quantity) < RESERVED,
            "EXCEEDS CAP"
        );
        for (uint256 index = 0; index < quantity; index++) {
            _mintReserved(msg.sender);
        }
    }

    function setContractState(ContractState _state, bool _enabled)
        external
        onlyOwner
    {
        contractState[_state] = _enabled;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _setBaseURI(baseURI_);
    }

    function setRoot(bytes32 _root) external onlyOwner {
        root = _root;
    }

    function _leaf(address account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _setBaseURI(string memory baseURI_) internal {
        baseURI = baseURI_;
    }
}
