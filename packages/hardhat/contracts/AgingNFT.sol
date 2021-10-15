pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract AgingNFT is ERC721  {


  string[] public phases = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ];

  //Making the birth of the token for now just be 10/12/2021 12am GMT 
  uint256 birth = 1633996800;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("AgingNFT", "AGING") {
      //This is going to be filled with the addresses receiving the airdrop
     _tokenIds.increment();
     _mint(0xC9FFEe9e34723d882CB97a6c056100661d00Bfe1, _tokenIds.current());
      // Repeat 7? Times or so
  }


  function tokenURI(uint256 tokenId) public view override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

      string memory _tokenURI;

      uint256 age = block.timestamp - birth;

      string memory base = _baseURI();

      if(age< 10 seconds){
        _tokenURI = phases[0];
      }else if(age< 31 days){
        _tokenURI = phases[1];
      }else if(age< 193 days){
        _tokenURI = phases[2];
      }else if(age< 376 days){
        _tokenURI = phases[3];
      }else if(age< 558 days){
        _tokenURI = phases[4];
      }else if(age< 924 days){
        _tokenURI = phases[5];
      }else if(age< 1654 days){
        _tokenURI = phases[6];
      }else if(age< 3115 days){
        _tokenURI = phases[7];
      }else if(age< 6768 days){
        _tokenURI = phases[8];
      }else if(age< 14073 days){
        _tokenURI = phases[9];
      }else if(age< 28682 days){
        _tokenURI = phases[10];
      }else {
        _tokenURI = phases[11];
      return string(abi.encodePacked(base, _tokenURI));
  }

}

}
