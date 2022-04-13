//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract NFTAvatar is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;


  struct Character {
      uint256 attackStrength;
      uint256 defenceStrength;
  }

  string[] private emojis = [
    unicode"😁",
    unicode"😂",
    unicode"😍",
    unicode"😭",
    unicode"😴",
    unicode"😎",
    unicode"🤑",
    unicode"🥳",
    unicode"😱",
    unicode"🙄"
  ];

  address public gameContract;
  mapping(uint => Character) public characters;
  mapping(address => uint) public yourTokens;

  constructor(address _gameContract) ERC721("NFTAvatar", "NFT") {
      gameContract = _gameContract;
  }

  function mint(uint256 randomNumber, address player) public {
        require(msg.sender == gameContract);

        uint256 tokenId = tokenIds.current();

        uint256 defenceStrength = randomNumber % 1000;
        uint256 attackStrength = defenceStrength + 500;

        characters[tokenId] = Character(attackStrength, defenceStrength);

        uint256 emojiIndex = (randomNumber % emojis.length) + 1;
        string memory emoji = emojis[emojiIndex];
        string memory color = pickRandomColor(randomNumber);
        string memory svg = createOnChainSvg(emoji, color);
        string memory tokenUri = createTokenUri(emoji, svg);

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

  function pickRandomColor(uint256 randomNumber)
    internal
    pure
    returns (string memory)
  {
    uint256 r = uint256(keccak256(abi.encode(randomNumber, 1))) % 256;
    uint256 g = uint256(keccak256(abi.encode(randomNumber, 2))) % 256;
    uint256 b = uint256(keccak256(abi.encode(randomNumber, 3))) % 256;

    return
      string(
        abi.encodePacked(
          "rgb(",
          Strings.toString(r),
          ", ",
          Strings.toString(g),
          ", ",
          Strings.toString(b),
          ");"
        )
      );
  }

  function createOnChainSvg(string memory emoji, string memory color) internal pure returns(string memory svg) {
    string memory baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { font-size: 100px; }</style><rect width='100%' height='100%' style='fill:";
    string memory afterColorSvg = "' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    svg = string(abi.encodePacked(baseSvg, color, afterColorSvg, emoji, "</text></svg>"));
  }

  function createTokenUri(string memory emoji, string memory svg) internal pure returns(string memory tokenUri) {
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            emoji,
            '", "description": "Random Emoji NFT Collection Powered by Chainlink VRF", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '"}'
          )
        )
      )
    );

    tokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
  }
}