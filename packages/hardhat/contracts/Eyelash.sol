//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Eyelash is ERC721Enumerable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public constant limit = 1000;
  uint256 public constant curve = 1002; // price increase 0,2% with each purchase
  uint256 public price = 0.001 ether;

  // all funds go to buidlguidl.eth
  address payable public constant recipient =
    payable(0xa81a6a910FeD20374361B35C451a4a44F86CeD46);

  // uint8 should be enough for length
  mapping (uint256 => uint256) public length;
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => bytes3) public rareColor;

  constructor() ERC721("Loogie Eyelash", "LOOGEL") {
    // RELEASE THE LOOGIE EYELASH!
  }

  function mintItem() public payable returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      price = (price * curve) / 1000;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

      length[id] = 110+((10*uint256(uint8(genes[0])))/255);
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );

      if (uint8(genes[3]) > 200) {
        rareColor[id] = bytes2(genes[4]) | ( bytes2(genes[5]) >> 8 ) | ( bytes3(genes[6]) >> 16 );
      } else {
        rareColor[id] = color[id];
      }

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              'Loogie Eyelash #',id.toString(),
                              '", "description":"',
                              'This Loogie Eyelash has length ',length[id].toString(),', color #',color[id].toColor(),' and middle eyelash color #',rareColor[id].toColor(),'!!!',
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
                              Base64.encode(bytes(generateSVGofTokenById(id))),
                              '"}'
                          )
                        )
                    )
              )
          );
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    return string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));
  }

  function renderLeftEyelash(uint256 id) internal view returns (string memory) {
    uint256[4] memory lengths = [length[id], length[id]-3, length[id]-4, length[id]-3];

    return string(abi.encodePacked(
        '<path d="M 164 130 Q 154 125 169 ',lengths[0].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 171 127 Q 161 122 176 ',lengths[1].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 179 125 Q 169 120 184 ',(length[id]-5).toString(),'" stroke="#',rareColor[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 186 126 Q 176 121 191 ',lengths[2].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 194 127 Q 184 122 199 ',lengths[3].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>'
    ));
  }

  function renderRightEyelash(uint256 id) internal view returns (string memory) {
    uint256[4] memory lengths = [length[id]+12, length[id]+10, length[id]+11, length[id]+13];

    return string(abi.encodePacked(
        '<path d="M 196 142 Q 186 137 201 ',lengths[0].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 203 140 Q 193 135 208 ',lengths[1].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 211 139 Q 201 134 216 ',(length[id]+9).toString(),'" stroke="#',rareColor[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 218 141 Q 208 136 223 ',lengths[2].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>',
        '<path d="M 226 143 Q 216 138 231 ',lengths[3].toString(),'" stroke="#',color[id].toColor(),'" stroke-width="1" fill="transparent"/>'
    ));
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    return string(abi.encodePacked(
      '<g class="eyelash">',
        renderLeftEyelash(id),
        renderRightEyelash(id),
      '</g>'
      ));
  }
}
