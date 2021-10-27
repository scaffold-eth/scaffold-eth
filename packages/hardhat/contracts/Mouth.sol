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

contract Mouth is ERC721Enumerable, Ownable {

  using Strings for uint256;
  //using Strings for uint8;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Loogie Mouth", "LOOGMT") {
    // RELEASE THE LOOGIE MOUTH!
  }

  // uint8 should be enough for length and position
  mapping (uint256 => uint256) public length;
  mapping (uint256 => uint256) public position;

  function mintItem() public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

      length[id] = 180+((30*uint256(uint8(genes[0])))/255);
      position[id] = ((45*uint256(uint8(genes[1])))/255);

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie Mouth #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie Mouth has length ',length[id].toString(),' and position ',position[id].toString(),'!!!'));
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
                              '"},{"trait_type": "position", "value": "',
                              position[id].toString(),
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

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    // translate x go from 0 (good for loogie with the max chubbiness) to 45 (good for a loogie with min chubbiness)
    // mounth length go from 180 to 210
    string memory render = string(abi.encodePacked(
      '<g class="mouth" transform="translate(',position[id].toString(),',0)">',
        '<path d="M 130 240 Q 165 250 ',length[id].toString(),' 235" stroke="black" stroke-width="3" fill="transparent"/>',
      '</g>'
      ));

    return render;
  }
}
