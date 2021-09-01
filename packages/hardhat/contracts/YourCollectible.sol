pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

import "./MetadataGenerator.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("Nubs", "Nubs") {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  mapping (uint256 => bytes3) public color;
  mapping (uint256 => uint256) public chubbiness;

  function mintItem()
      public
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes2(predictableRandom[2]) >> 16 );
      chubbiness[id] = 35+((55*uint256(uint8(predictableRandom[3])))/255);

      return id;
  }

  function possibleHash() public view returns (bytes32) {
    return blockhash(block.number-1);
  }


  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      return MetadataGenerator.tokenURI( ownerOf(id), id, color[id], chubbiness[id] );
  }
}
