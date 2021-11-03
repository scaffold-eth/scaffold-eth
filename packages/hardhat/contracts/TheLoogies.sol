//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two
abstract contract ILoogies {
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => uint256) public chubbiness;
  function ownerOf(uint256 tokenId) external virtual view returns (address owner);
  function safeTransferFrom(address from, address to, uint256 tokenId) external virtual;
}

abstract contract IBlueLoogies {
  mapping (uint256 => bytes1) public blue;
  mapping (uint256 => address) public grants;
  mapping (address => uint256) public grantPrice;
}

contract TheLoogies is ERC721Enumerable, Ownable, ERC721Holder {

  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address constant loogiesAddress = 0xE203cDC6011879CDe80c6a1DcF322489e4786eB3;
  ILoogies immutable loogies = ILoogies(loogiesAddress);
  IBlueLoogies immutable blueLoogies;
  mapping(uint256 => bytes3) public color;
  mapping(uint256 => uint256) public chubbiness;

  constructor(address _blueLoogies) ERC721("The Loogies", "THELOOG") {
    blueLoogies = IBlueLoogies(_blueLoogies);
  }

  function mintItem(uint256 loogieId, uint256 blueLoogieId) external payable returns (uint256) {
      require(_msgSender() == loogies.ownerOf(loogieId), "You are not the loogie's owner");
      require(address(0) != blueLoogies.grants(blueLoogieId), "Grant is not set for blue loogie");
      require(msg.value >= blueLoogies.grantPrice(blueLoogies.grants(blueLoogieId)),
        "Sent ETH not sufficient");

      loogies.safeTransferFrom(_msgSender(), address(this), loogieId);
      (bool sent, ) = payable(blueLoogies.grants(blueLoogieId)).call{value: msg.value}("");
      require(sent, "ETH transfer to grant failed");

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(_msgSender(), id);
      
      color[id] = loogies.color(loogieId) | (bytes3(blueLoogies.blue(blueLoogieId)) >> 16);
      chubbiness[id] = loogies.chubbiness(loogieId);
      
      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('The Loogie #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie is the color #', toColor(color[id]),' with a chubbiness of ', uint2str(chubbiness[id]),'!!!'));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              name,
                              '", "description":"',
                              description,
                              '", "external_url":"https://burnyboys.com/token/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "color", "value": "#',
                              toColor(color[id]),
                              '"},{"trait_type": "chubbiness", "value": ',
                              uint2str(chubbiness[id]),
                              '}], "owner":"',
                              (uint160(ownerOf(id))).toHexString(20),
                              '", "image": "',
                              'data:image/svg+xml;base64,',
                              image,
                              '"}'
                          )
                        )
                    )
              )
          );
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<g id="eye1">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>',
        '</g>',
        '<g id="head">',
          '<ellipse fill="#',
          toColor(color[id]),
          '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="',
          chubbiness[id].toString(),
          '" ry="51.80065" stroke="#000"/>',
        '</g>',
        '<g id="eye2">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>',
        '</g>'
      ));

    return render;
  }

  bytes16 internal constant ALPHABET = '0123456789abcdef';

  function toColor(bytes3 value) internal pure returns (string memory) {
    bytes memory buffer = new bytes(6);
    for (uint256 i = 0; i < 3; i++) {
        buffer[i*2+1] = ALPHABET[uint8(value[i]) & 0xf];
        buffer[i*2] = ALPHABET[uint8(value[i]>>4) & 0xf];
    }
    return string(buffer);
  }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }
}
