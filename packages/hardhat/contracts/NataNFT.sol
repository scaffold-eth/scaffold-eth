// SPDX-License-Identifier: MIT
/*

                     ___
                    (   )
 ___ .-.     .---.   | |_       .---.
(   )   \   / .-, \ (   __)    / .-, \
 |  .-. .  (__) ; |  | |      (__) ; |
 | |  | |    .'`  |  | | ___    .'`  |
 | |  | |   / .'| |  | |(   )  / .'| |
 | |  | |  | /  | |  | | | |  | /  | |
 | |  | |  ; |  ; |  | ' | |  ; |  ; |
 | |  | |  ' `-'  |  ' `-' ;  ' `-'  |
(___)(___) `.__.'_.   `.__.   `.__.'_.


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
    Counters.Counter private _burnedTokens;

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

    function createToken(address _enjoyer, string calldata _ipfsHash) internal returns (uint256) {
      _tokenIds.increment();
      uint256 newItemId = _tokenIds.current();

      tokenIpfsHash[newItemId] = _ipfsHash;
      nataHash[_ipfsHash] = true;

      emit NewToken(_enjoyer, newItemId, _ipfsHash);

      _safeMint(_enjoyer, newItemId);

      return newItemId;
    }

    function mintFromSignature(address _enjoyer, string calldata _ipfsHash, bytes calldata _signature) public returns (uint256) {

        require(!nataHash[_ipfsHash], "this nata has already been enjoyed");

        bytes32 _hash = getHash(_enjoyer, _ipfsHash);

        require(SignatureChecker.isValidSignatureNow(_enjoyer, _hash, _signature), "not a valid signature");

        return createToken(_enjoyer, _ipfsHash);
    }

    function mint(string calldata _ipfsHash) public returns (uint256) {

        require(!nataHash[_ipfsHash], "this nata has already been enjoyed");

        return createToken(_msgSender(), _ipfsHash);
    }

    function burn(uint256 _tokenId) public {
      require(msg.sender == dao, 'only dao');

      delete tokenIpfsHash[_tokenId];
      _burn(_tokenId);
      _burnedTokens.increment();
    }

    function totalSupply() public view returns (uint256) {
      return _tokenIds.current() - _burnedTokens.current();
    }

    function totalMinted() public view returns (uint256) {
      return _tokenIds.current();
    }

    function totalBurned() public view returns (uint256) {
      return _burnedTokens.current();
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
