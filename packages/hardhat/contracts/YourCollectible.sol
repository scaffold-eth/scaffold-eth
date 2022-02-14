// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YourCollectible is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;


  constructor(bytes32[] memory assetsForSale) public ERC721("YourCollectible", "YCB") {
    
    for(uint256 i=0;i<assetsForSale.length;i++){
      forSale[assetsForSale[i]] = true;
      forSecondarySale[assetsForSale[i]] = false;
    }
    price = startingAt;
  }

  event Action(address sender, uint256 tokenId, string action);

  uint256 public price;
  uint256 constant startingAt = 0.01 ether;
  uint16 constant numerator = 1337;
  uint16 constant denominator = 1000;

  //this marks an item in IPFS as "forsale"
  mapping (bytes32 => bool) public forSale;
  mapping (bytes32 => bool) public forSecondarySale;
  //this lets you look up a token by the uri (assuming there is only one of each uri for now)
  mapping (bytes32 => uint256) public uriToTokenId;


  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }



  function mintItem(string memory tokenURI)
      public payable
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      //make sure they are only minting something that is marked "forsale"
      require(forSale[uriHash],"ALREADY MINTED");
      forSale[uriHash]=false;

      _tokenIdCounter.increment();

      uint256 id = _tokenIdCounter.current();
      _mint(msg.sender, id);
      _setTokenURI(id, tokenURI);

      uriToTokenId[uriHash] = id;

      price = uint256(price * numerator) / denominator;
      return id;
  }

  function sellItem(string memory tokenURI)
      public
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      require(!forSecondarySale[uriHash],"ALREADY FOR SECONDARY SALE");
      forSecondarySale[uriHash]=true;

      uint256 id = uriToTokenId[uriHash];
      emit Action(msg.sender, id, "sell");

      return id;
  }

  function cancelSellItem(string memory tokenURI)
      public
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      require(forSecondarySale[uriHash],"NOT FOR SECONDARY SALE");
      forSecondarySale[uriHash]=false;

      uint256 id = uriToTokenId[uriHash];
      emit Action(msg.sender, id, "cancel sell");

      return id;
  }

  function buyItem(string memory tokenURI)
      public payable
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      require(forSecondarySale[uriHash],"NOT FOR SECONDARY SALE");
      forSecondarySale[uriHash]=false;

      uint256 id = uriToTokenId[uriHash];
      address payable itemOwner = payable(ownerOf(id));

      _transfer(itemOwner, msg.sender, id);
      itemOwner.transfer(price);

      return id;
  }

  // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


