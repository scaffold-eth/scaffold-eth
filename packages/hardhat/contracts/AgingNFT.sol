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
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20"
  ];

  mapping (uint256 => uint256) public birth;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("AgingNFT", "AGING") {
  }

  function claim()
      public
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      birth[id] = block.timestamp;

      return id;
  }


  function tokenURI(uint256 tokenId) public view override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

      string memory _tokenURI;

      uint256 age = block.timestamp - birth[tokenId];

      uint256 timePerProgression = 1 minutes;

      string memory base = _baseURI();

      if(age<timePerProgression){
        _tokenURI = phases[0];
      }else if(age<timePerProgression*2){
        _tokenURI = phases[1];
      }else if(age<timePerProgression*3){
        _tokenURI = phases[2];
      }else if(age<timePerProgression*4){
        _tokenURI = phases[3];
      }else if(age<timePerProgression*5){
        _tokenURI = phases[4];
      }else if(age<timePerProgression*6){
        _tokenURI = phases[5];
      }else if(age<timePerProgression*7){
        _tokenURI = phases[6];
      }else if(age<timePerProgression*8){
        _tokenURI = phases[7];
      }else if(age<timePerProgression*9){
        _tokenURI = phases[8];
      }else if(age<timePerProgression*10){
        _tokenURI = phases[9];
      }else if(age<timePerProgression*11){
        _tokenURI = phases[10];
      }else if(age<timePerProgression*12){
        _tokenURI = phases[11];
      }else if(age<timePerProgression*13){
        _tokenURI = phases[12];
      }else if(age<timePerProgression*14){
        _tokenURI = phases[13];
      }else if(age<timePerProgression*15){
        _tokenURI = phases[14];
      }else if(age<timePerProgression*16){
        _tokenURI = phases[15];
      }else if(age<timePerProgression*17){
        _tokenURI = phases[16];
      }else if(age<timePerProgression*18){
        _tokenURI = phases[17];
      }else if(age<timePerProgression*19){
        _tokenURI = phases[18];
      }else{
          _tokenURI = phases[19];
      }
      return string(abi.encodePacked(base, _tokenURI));
  }

}
