pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

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

  function mintItem(string memory tokenURI)
      public
      returns (uint256)
  {
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
