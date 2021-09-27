pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ToColor.sol";

abstract contract Loogies {
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => uint256) public chubbiness;
}

contract YourContract is ERC721, IERC721Receiver {

  using Strings for uint256;
  using ToColor for bytes3;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  Loogies loogies = Loogies(0xE203cDC6011879CDe80c6a1DcF322489e4786eB3);
  constructor() ERC721("Loogie Tank", "LOOGTANK") {
  }

  mapping(uint256 => uint256[]) public idToLoogies;


  function mintItem()
      public
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      return id;
  }

  // Only for testing. Remove after testing.
  function addLoogie(uint256 id, uint256 loogieId) external {
    idToLoogies[id].push(loogieId);
  }

  // https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
  function toUint256(bytes memory _bytes) internal pure returns (uint256) {
        require(_bytes.length >= 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
    }

  // test it.
  function onERC721Received(
        address operator,
        address from,
        uint256 loogieTokenId,
        bytes calldata data
    ) external override returns (bytes4) {
      uint256 tokenId = toUint256(data);
      require(ownerOf(tokenId) == from, "you can only add loogies to a tank you own.");
      idToLoogies[tokenId].push(loogieTokenId);
      return this.onERC721Received.selector;
    } 

  function renderLoogie(bytes3 color, uint256 chubbiness, uint256 x, uint256 y) internal pure returns (string memory) {
    string memory loogieSVG = string(abi.encodePacked(
      '<g transform="translate(', x.toString(), ' ', y.toString(), ')">'
        '<g id="eye1">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>',
        '</g>',
        '<g id="head">',
          '<ellipse fill="#',
          color.toColor(),
          '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="',
          chubbiness.toString(),
          '" ry="51.80065" stroke="#000"/>',
        '</g>',
        '<g id="eye2">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>',
        '</g>'
      '</g>'
    ));
    return loogieSVG;
  }

  function renderLoogies(uint256 _id) internal view returns (string memory) {
    string memory loogieSVG = "";
    for (uint256 i=0; i < idToLoogies[_id].length; i++) {
      bytes3 color = loogies.color(idToLoogies[_id][i]);
      uint256 chubbiness = loogies.chubbiness(idToLoogies[_id][i]);
      loogieSVG = string(abi.encodePacked(loogieSVG, renderLoogie(color, chubbiness, i+20, i+20)));
    }

    return loogieSVG;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");

      return string(abi.encodePacked(
        '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
          '<rect x="0" y="0" width="400" height="400" stroke="black" fill="#8FB9EB" stroke-width="5"/>',
          renderLoogies(id),
        '</svg>'));
  }
}