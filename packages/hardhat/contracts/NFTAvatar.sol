//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTAvatar is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
  string constant tokenUri = "https://ipfs.io/ipfs/QmUpmeipNceYanSvrbcFDPA2Vw9FoaC2Cm8YB5XFHKpo9v";

  struct Character {
      uint256 attackStrength;
      uint256 defenceStrength;
  }

  address public gameContract;
  mapping(uint => Character) public characters;
  mapping(address => uint) public yourTokens;

  constructor(address _gameContract) ERC721("NFTAvatar", "NFT") {
      gameContract = _gameContract;
  }

  function mint(uint256 randomNumber, address player) public {
        require(msg.sender == gameContract);

        uint256 tokenId = tokenIds.current();

        uint256 defenceStrength = randomNumber % 500;
        uint256 attackStrength = defenceStrength + 250;

        characters[tokenId] = Character(attackStrength, defenceStrength);

        _safeMint(player, tokenId);
        _setTokenURI(tokenId, tokenUri);

        tokenIds.increment();
    }

    function getCharacterByTokenId(uint256 tokenId) public view returns(uint256 attackStrength, uint256 defenceStrength) {
        attackStrength = characters[tokenId].attackStrength;
        defenceStrength = characters[tokenId].defenceStrength;
    }

    function getCharacterByOwner(address owner) public view returns(uint256 tokenId, uint256 attackStrength, uint256 defenceStrength) {
        tokenId = yourTokens[owner];
        (attackStrength, defenceStrength) = getCharacterByTokenId(tokenId);
    }
}