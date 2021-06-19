pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable {

  // Each token can either be "ON" or "OFF"
  mapping (uint256 => bool) public isOn;

  // Mapping for token URI if the token is "OFF"
  mapping (uint256 => string) private _tokenURIsON;
  mapping (uint256 => string) private _tokenURIsOFF;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("YourCollectible", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  function mintItem(address to, string memory tokenOnURI, string memory tokenOffURI)
      public
      onlyOwner
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(to, id);
      _setTokenURI(id, tokenOnURI, tokenOffURI);

      isOn[id] = true;

      return id;
  }

  function toggle(uint256 tokenId) external onlyOwner {
    isOn[tokenId] = !isOn[tokenId];
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

      string memory _tokenURI;

      if(isOn[tokenId]){
        _tokenURI = _tokenURIsON[tokenId];
      }else{
        _tokenURI = _tokenURIsOFF[tokenId];
      }

      string memory base = baseURI();

      // If there is no base URI, return the token URI.
      //if (bytes(base).length == 0) {
      //    return _tokenURI;
      //}
      // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
      //if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(base, _tokenURI));
      //}
      // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
      //return string(abi.encodePacked(base, tokenId.toString()));
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURION, string memory _tokenURIOFF) internal {
      require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
      _tokenURIsON[tokenId] = _tokenURION;
      _tokenURIsOFF[tokenId] = _tokenURIOFF;
  }
}
