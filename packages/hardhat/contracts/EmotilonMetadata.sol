//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './ToColor.sol';
import './EmotilonRenderEyes.sol';
import './EmotilonRenderMouth.sol';

library EmotilonMetadata {

  struct StatsStruct {
      uint8 speed;
      uint8 strength;
      uint8 iq;
      uint8 skill;
      uint8 evil;
      uint8 accuracy;
      uint8 stamina;
      uint8 beauty;
  }

  using Strings for uint256;
  using ToColor for bytes3;

  function tokenURI(uint id, bytes32 genes, string memory svg) public pure returns (string memory) {
    string memory name = string.concat('Emotilon #', id.toString());
    string memory image = Base64.encode(bytes(svg));

    // TODO: add attributes

    return
      string.concat(
        'data:application/json;base64,',
        Base64.encode(
            bytes(
                  string.concat(
                      '{"name":"',
                      name,
                      '", "description":"',
                      name,
                      '", "external_url":"https://www.emotilon.com/emotilon/',
                      id.toString(),
                      '", "attributes": [{"trait_type": "Eyes Color", "value": "#',
                      'FFFFFF',
                      '"},{"trait_type": "Ears Color", "value": "#',
                      'AAAAAA',
                      '"}], "image": "',
                      'data:image/svg+xml;base64,',
                      image,
                      '"}'
                  )
                )
            )
      );
  }

  function statsByGenes(bytes32 genes) public pure returns (StatsStruct memory) {

    StatsStruct memory stats;

    stats.speed = uint8(genes[0]);
    stats.strength = uint8(genes[1]);
    stats.iq = uint8(genes[2]);
    stats.skill = uint8(genes[3]);
    stats.evil = uint8(genes[4]);
    stats.accuracy = uint8(genes[5]);
    stats.stamina = uint8(genes[6]);
    stats.beauty = uint8(genes[7]);

    return stats;
  }


  function colors() public pure returns (string[7] memory) {
    return [
      'fbd971',
      'fede65',
      'ffeeca',
      'e7c19c',
      'd4a082',
      'b37948',
      '7d5f50'
    ];
  }

  function renderEmotilonByGenes(bytes32 genes, uint256 healthStatus, bool dead) public pure returns (string memory) {

    string memory mouth = EmotilonRenderMouth.render(uint8(genes[8]), uint8(genes[9]), healthStatus);

    string memory eyes = EmotilonRenderEyes.render(uint8(genes[10]), uint8(genes[11]), healthStatus);

    string memory color = colors()[uint8(genes[12]) % 7];

    if (dead) {
      color = 'bd1613';
    }

    string memory render = string.concat(
      '<g>',
        '<circle style="fill:#', color, ';" cx="21" cy="21" r="21"/>',
        '<g class="eyes">', eyes, '</g>',
        '<g class="mouth" transform="translate(0, 2)">', mouth, '</g>',
      '</g>');

    return render;
  }

  function breedingGenes(uint256 fatherId, uint256 motherId, bytes32 fatherGenes, bytes32 motherGenes) public view returns (bytes32) {
    bytes32 newGenes = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this), fatherId, motherId ));

    bytes memory newGenesArray = abi.encodePacked(newGenes);

    for (uint8 i = 0; i < 8; i++) {
      uint8 newGen = uint8((uint16(uint8(fatherGenes[i])) + uint16(uint8(motherGenes[i]))) / 2);
      uint8 plus = uint8(newGenes[i]) % 20;
      if (uint8(newGenes[i]) > 127) {
        if (uint16(newGen) + uint16(plus) > 255) {
          newGen = 255;
        } else {
          newGen = newGen + plus;
        }
      } else {
        if (plus > newGen) {
          newGen = 0;
        } else {
          newGen = newGen - plus;
        }
      }
      newGenesArray[i] = bytes1(newGen);
    }

    for (uint8 i = 8; i < 13; i++) {
      uint8 newGen;
      if (uint8(newGenes[i]) < 120) {
        newGen = uint8(fatherGenes[i]);
      }
      if (uint8(newGenes[i]) >= 120 && uint8(newGenes[i]) < 240) {
        newGen = uint8(motherGenes[i]);
      }
      if (uint8(newGenes[i]) >= 240) {
        newGen = uint8((uint16(uint8(fatherGenes[i])) + uint16(uint8(motherGenes[i]))) / 2);
      }
      newGenesArray[i] = bytes1(newGen);
    }

    return bytes32(newGenesArray);
  }
}