// SPDX-License-Identifier: MIT
/*
*/

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MetaDataGenerator.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract NataNFT is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewToken(address _minter, uint256 _tokenId, string _ipfsHash);

    address public dao;

    mapping(uint256 => string) public tokenIpfsHash;
    mapping(string => bool) public nataHash;

    address public trustedForwarder;

    constructor(address _dao, address _trustedForwarder) ERC721("NataNFT", "NATA") {
      dao = _dao;
      trustedForwarder = _trustedForwarder;
    }

    function setDao(address _dao) public {
      require(msg.sender == dao, 'only dao');
      dao = _dao;
    }

    function getHash(address _enjoyer, string calldata _ipfsHash) public view returns(bytes32) {
        return keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(_enjoyer, _ipfsHash)))
            );
    }

    function isValid(address _enjoyer, string calldata _ipfsHash, bytes calldata _signature) public view returns(bool) {
        bytes32 _hash = getHash(_enjoyer, _ipfsHash);
        return SignatureChecker.isValidSignatureNow(_enjoyer, _hash, _signature);
    }

    function mint(address _enjoyer, string calldata _ipfsHash, bytes calldata _signature) public returns (uint256) {

        require(!nataHash[_ipfsHash], "this nata has already been enjoyed");

        bytes32 _hash = getHash(_enjoyer, _ipfsHash);

        require(SignatureChecker.isValidSignatureNow(_enjoyer, _hash, _signature), "not a valid signature");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        tokenIpfsHash[newItemId] = _ipfsHash;
        nataHash[_ipfsHash] = true;

        emit NewToken(_enjoyer, newItemId, _ipfsHash);

        _safeMint(_enjoyer, newItemId);

        return newItemId;
    }

    function burn(uint256 _tokenId) public {
      require(msg.sender == dao, 'only dao');

      _burn(_tokenId);
    }

    function totalSupply() public view returns (uint256) {
      return _tokenIds.current();
    }

    function tokenURI(uint256 id) public view override returns (string memory) {

        require(_exists(id), "not exist");

        return MetaDataGenerator.tokenURI(
          MetaDataGenerator.MetaDataParams({
            tokenId: id,
            tokenIpfsHash:
            tokenIpfsHash[id],
            owner: ownerOf(id)
            }));

    }

    function isTrustedForwarder(address forwarder) public view virtual returns (bool) {
        return forwarder == trustedForwarder;
    }
}
