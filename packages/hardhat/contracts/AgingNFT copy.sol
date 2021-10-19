pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract AgingNFTcopy is ERC721  {


  string[] public phases = [
    "QmPqWcjfUzfQarRuP9d7QCyAZREZD9uSxEK9fzvn3abhXx",
    "QmPskmBY1MhpkdTyNKup8NkEFJFtr9u9ARUHc195GPoi92",
    "QmaACkqw4JHMNpdfaxM7QhfcjM8heoTo313JNdct9nwqgE",
    "QmRnEwVQW3Nc7ozy4ZrvFvZ5cAYEUWkaHzSxi8jbLpvwTZ",
    "QmdCvspMs58ZQYvzF4cw1kGde4xaYvFWFKDZQchYqtHJA9",
    "QmSmVKnnzuWkmB78E3hGCQAQEitvfEjfS3JGxryikGqwG2",
    "Qmdt8UAZ7DHe8hFo5cq2T77SrDeMnkvAffQB9Zccur6svM",
    "QmPz7nM1HEsyKtT4G3fpTeeqFFHY2uvW3Hs6GS5UfGdoca",
    "QmV7Uq3yMFVCwtofDghNnwG2PpytfeiMr6nN9yFxks5UEF",
    "QmbxZ5oxkCdPkiPs9nRRS9LVYLLmKAozyCUGvcfbQJHB6L",
    "QmTJCYegcWojfgZYMuJS1LmWGgoZkHjHdguahNFARwcXxj",
    "QmQK2XASY5sHYWamtAUzmXH1g1k7PSBr7Vx4VhbDhzR2gz"
  ];

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("AgingNFT", "AGING") {
      //This is going to be filled with the addresses receiving the airdrop
     _tokenIds.increment();
     _mint(0xC9FFEe9e34723d882CB97a6c056100661d00Bfe1, _tokenIds.current());
     _tokenIds.increment();
     _mint(0x34aA3F359A9D614239015126635CE7732c18fDF3, _tokenIds.current());
      // Repeat 7? Times or so
  }


  function tokenURI(uint256 tokenId) public view override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

      string memory _tokenURI;

      string memory base = _baseURI();

      //These need to be updated with the correct epoch times
      if(block.timestamp< 1636502400){
        _tokenURI = phases[0];
      }else if(block.timestamp< 1650585600){
        _tokenURI = phases[1];
      }else if(block.timestamp< 1666396800){
        _tokenURI = phases[2];
      }else if(block.timestamp< 1682121600){
        _tokenURI = phases[3];
      }else if(block.timestamp< 1713744000){
        _tokenURI = phases[4];
      }else if(block.timestamp< 1776816000){
        _tokenURI = phases[5];
      }else if(block.timestamp< 1903046400){
        _tokenURI = phases[6];
      }else if(block.timestamp< 2218665600){
        _tokenURI = phases[7];
      }else if(block.timestamp< 2849817600){
        _tokenURI = phases[8];
      }else if(block.timestamp< 4112035200){
        _tokenURI = phases[9];
      }else if(block.timestamp< 4774723200){
        _tokenURI = phases[10];
      }else {
        _tokenURI = phases[11];
  }
      return string(abi.encodePacked(base, _tokenURI));
}

}
