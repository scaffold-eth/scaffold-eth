//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './ToColor.sol';
import './HexStrings.sol';

library MandalaMetadata {

  using Strings for uint256;
  using Strings for uint8;
  using ToColor for bytes3;
  using HexStrings for uint160;

  function tokenURI(uint256 id, address owner, bool claimed, string memory svg) public pure returns (string memory) {
      string memory name = string(abi.encodePacked('Mandala Merge #',id.toString()));
      string memory description = string(abi.encodePacked('Random on-chain Mandala Merge animated SVG NFT'));
      string memory image = Base64.encode(bytes(svg));
      string memory claimedBoolean = 'false';
      if (claimed) {
        claimedBoolean = 'true';
      }

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
                              '", "external_url":"https://mandalamerge.com/token/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "claimed", "value": ',
                              claimedBoolean,
                              '}], "owner":"',
                              uint160(owner).toHexString(20),
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

  function renderMandalaById(bytes32 genes) public pure returns (string memory) {

    string memory render = string.concat('<defs><g id="svg-group">');

    for (uint i = 0; i < 5; i++) {
      render = string.concat(
        render,
        '<circle cx="', uint8(genes[(i*6)+3]).toString(), '" cy="', uint8(genes[(i*6)+4]).toString(), '" r="', uint8(genes[(i*6)+5]).toString(), '" stroke="#', (bytes2(genes[(i*6)+0]) | (bytes2(genes[(i*6)+1]) >> 8) | (bytes3(genes[(i*6)+2]) >> 16)).toColor(), '" fill-opacity="0">',
        '<animate attributeName="r" begin="0s" dur="5s" repeatCount="indefinite" values="', uint8(genes[(i*6)+5]).toString(), ';', uint8(genes[(i*6)+5]) > 10 ? (uint8(genes[(i*6)+5]) - 10).toString() : '0', ';', uint8(genes[(i*6)+5]) > 20 ? (uint8(genes[(i*6)+5]) - 20).toString() : '0', ';', uint8(genes[(i*6)+5]) > 10 ? (uint8(genes[(i*6)+5]) - 10).toString() : '0', ';', uint8(genes[(i*6)+5]).toString(), '"/>',
        '</circle>'
      );
    }

    render = string.concat(
      render,
      '</g></defs>',
      '<g id="svg-mandala" transform="translate(600, 600)"><g id="svg-layer">'
    );

    for (uint i = 0; i < 72; i++) {
      render = string.concat(render, '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-group" transform="rotate(',(i*5).toString(),')"/>');
    }

    render = string.concat(render, '</g></g>');

    return render;
  }

  function renderUnclaimedMandalaById(bytes32 genes) public pure returns (string memory) {

    string memory render = string.concat('<defs><g id="svg-group">');

    render = string.concat(
      render,
      '<circle cx="', uint8(genes[3]).toString(), '" cy="', uint8(genes[4]).toString(), '" r="', uint8(genes[5]).toString(), '" stroke="#', (bytes2(genes[0]) | (bytes2(genes[1]) >> 8) | (bytes3(genes[2]) >> 16)).toColor(), '" fill-opacity="0">',
      '<animate attributeName="r" begin="0s" dur="5s" repeatCount="indefinite" values="', uint8(genes[5]).toString(), ';', uint8(genes[5]) > 10 ? (uint8(genes[5]) - 10).toString() : '0', ';', uint8(genes[5]) > 20 ? (uint8(genes[5]) - 20).toString() : '0', ';', uint8(genes[5]) > 10 ? (uint8(genes[5]) - 10).toString() : '0', ';', uint8(genes[5]).toString(), '"/>',
      '</circle>'
    );

    render = string.concat(
      render,
      '</g></defs>',
      '<g id="svg-mandala" transform="translate(600, 600)"><g id="svg-layer">'
    );

    for (uint i = 0; i < 72; i++) {
      render = string.concat(render, '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-group" transform="rotate(',(i*5).toString(),')"/>');
    }

    render = string.concat(render, '</g></g>');

    return render;
  }
}