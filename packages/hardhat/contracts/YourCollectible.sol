pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint public price = 80000000000000000; // 0.08 ether is the default price

  constructor(bytes32[] memory assetsForSale) public ERC721("YourCollectible", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
    for(uint256 i=0;i<assetsForSale.length;i++){
      forSale[assetsForSale[i]] = true;
    }
  }

  //this marks an item in IPFS as "forsale"
  mapping (bytes32 => bool) public forSale;
  //this lets you look up a token by the uri (assuming there is only one of each uri for now)
  mapping (bytes32 => uint256) public uriToTokenId;
  //this holds price data for individual NFTs
  mapping (bytes32 => uint) public priceData;

  function updatePrice(string memory uri, uint newPrice) public onlyOwner() {
    priceData[keccak256(abi.encodePacked(uri))] = newPrice;
  }

  function updateDefaultPrice(uint newDefaultPrice) public onlyOwner() {
    price = newDefaultPrice;
  }

  function getPrice(string memory uri) public view returns(uint) {

    if (priceData[keccak256(abi.encodePacked(uri))] == 0) {
      return price;
    } else {
      return priceData[keccak256(abi.encodePacked(uri))];
    }
  }

  function mintItem(string memory tokenURI)
      public 
      payable
      returns (uint256)
  {

      require(msg.value == getPrice(tokenURI), "Not enough to buy this NFT");
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      //make sure they are only minting something that is marked "forsale"
      require(forSale[uriHash],"NOT FOR SALE");
      forSale[uriHash]=false;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);
      _setTokenURI(id, tokenURI);

      uriToTokenId[uriHash] = id;

      return id;
  }
}
