//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract BlueLoogies is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Blue Loogies", "BLUELOOG") {
    // RELEASE THE LOOGIES!
  }

  mapping(uint256 => bytes1) public blue;
  mapping(uint256 => address) public grants;
  mapping(address => uint256) public grantPrice;

  function mintItem(address _grant) external onlyOwner returns (uint256) {
      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(address(this), id);
      blue[id] = bytes20(_grant)[0];
      grants[id] = _grant;
      return id;
  }

  function setGrantPrice(address _grant, uint256 price) external onlyOwner {
    grantPrice[_grant] = price;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Blue Loogie #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie is the color #0000', toColor(blue[id]),'!'));
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
                              '", "attributes": [{"trait_type": "color", "value": "#0000',
                              toColor(blue[id]),
                              '"}], "grant":"',
                              (uint160(grants[id])).toHexString(20),
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
          '<circle fill="#0000',
          toColor(blue[id]),
          '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" r="50" stroke="#000"/>',
        '</g>',
        '<g id="eye2">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>',
        '</g>'
      ));

    return render;
  }

  bytes16 internal constant ALPHABET = '0123456789abcdef';

  function toColor(bytes1 value) private pure returns (string memory) {
    bytes memory buffer = new bytes(2);
    buffer[1] = ALPHABET[uint8(value) & 0xf];
    buffer[0] = ALPHABET[uint8(value>>4) & 0xf];
    return string(buffer);
  }
}
