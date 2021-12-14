//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import "hardhat/console.sol";
import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Eyelash is ERC721Enumerable, Ownable {

  using Strings for uint256;
  //using Strings for uint8;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Loogie Eyelash", "LOOGEL") {
    // RELEASE THE LOOGIE EYELASH!
  }

  // uint8 should be enough for length
  mapping (uint256 => uint256) public length;
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => bytes3) public rareColor;

  function mintItem() public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

      length[id] = 110+((10*uint256(uint8(genes[0])))/255);
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );

      if (uint8(genes[3]) > 200) {
        rareColor[id] = bytes2(genes[4]) | ( bytes2(genes[5]) >> 8 ) | ( bytes3(genes[6]) >> 16 );
      }

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie Eyelash #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie Eyelash has length ',length[id].toString(),', color #',color[id].toColor(),' and middle eyelash color #',rareColor[id].toColor(),'!!!'));
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
                              '", "attributes": [{"trait_type": "length", "value": "',
                              length[id].toString(),
                              '"},{"trait_type": "color", "value": "#',
                              color[id].toColor(),
                              '"},{"trait_type": "middleRareColor", "value": "#',
                              rareColor[id].toColor(),
                              '"}], "owner":"',
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

  function rareColorForId(uint256 id) internal view returns (bytes3) {
    bytes3 rareColorMiddle = color[id];
    if (rareColor[id] > 0) {
      rareColorMiddle = rareColor[id];
    }
    return rareColorMiddle;
  }

  function renderLeftMiddleEyelash(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
        '<path d="M 179 125 Q 169 120 184 ',(length[id]-5).toString(),'" stroke="#',rareColorForId(id).toColor(),'" stroke-width="1" fill="transparent"/>'
    ));

    return svg;
  }

  function renderLeftEyelash(uint256 id) internal view returns (string memory) {
    uint256[4] memory lengths = [length[id], length[id]-3, length[id]-4, length[id]-3];

    string memory svg = string(abi.encodePacked(
        '<path d="M 164 130 Q 154 125 169 ',lengths[0].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 171 127 Q 161 122 176 ',lengths[1].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        renderLeftMiddleEyelash(id),
        '<path d="M 186 126 Q 176 121 191 ',lengths[2].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 194 127 Q 184 122 199 ',lengths[3].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>'
    ));

    return svg;
  }

  function renderRightMiddleEyelash(uint256 id) internal view returns (string memory) {
    string memory svg = string(abi.encodePacked(
        '<path d="M 211 139 Q 201 134 216 ',(length[id]+9).toString(),'" stroke="#',rareColorForId(id).toColor(),'" stroke-width="1" fill="transparent"/>'
    ));

    return svg;
  }

  function renderRightEyelash(uint256 id) internal view returns (string memory) {
    uint256[4] memory lengths = [length[id]+12, length[id]+10, length[id]+11, length[id]+13];
    string memory svg = string(abi.encodePacked(
        '<path d="M 196 142 Q 186 137 201 ',lengths[0].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 203 140 Q 193 135 208 ',lengths[1].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        renderRightMiddleEyelash(id),
        '<path d="M 218 141 Q 208 136 223 ',lengths[2].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 226 143 Q 216 138 231 ',lengths[3].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<g class="eyelash">',
        renderLeftEyelash(id),
        renderRightEyelash(id),
      '</g>'
      ));

    return render;
  }
}
