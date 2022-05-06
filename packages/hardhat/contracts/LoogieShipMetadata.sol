//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './ToColor.sol';
import './HexStrings.sol';

library LoogieShipMetadata {

  using Strings for uint256;
  using ToColor for bytes3;
  using HexStrings for uint160;

  function tokenURI(uint id, bytes3 wheelColor, bytes3 mastheadColor, bytes3 flagColor, bytes3 flagAlternativeColor, bool loogieMasthead, bool loogieFlag, string memory svg) public pure returns (string memory) {
    return
      string(
          abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(
                bytes(
                      abi.encodePacked(
                          '{"name":"Loogie Ship #',id.toString(),
                          '", "description":"Loogie Ship #',id.toString(),
                          '", "external_url":"https://sailor.fancyloogies.com/ship/',
                          id.toString(),
                          '", "attributes": [{"trait_type": "Flag Color", "value": "#',
                          flagColor.toColor(),
                          '"},{"trait_type": "Flag Secondary Color", "value": "#',
                          flagAlternativeColor.toColor(),
                          '"},{"trait_type": "Wheel Color", "value": "#',
                          wheelColor.toColor(),
                          '"},{"trait_type": "Masthead Color", "value": "#',
                          mastheadColor.toColor(),
                          '"},{"trait_type": "Loogie Masthead", "value": ',
                          loogieMasthead ? 'true' : 'false',
                          '},{"trait_type": "Loogie Flag", "value": ',
                          loogieFlag ? 'true' : 'false',
                          '}], "image": "',
                          'data:image/svg+xml;base64,',
                          Base64.encode(bytes(svg)),
                          '"}'
                      )
                    )
                )
          )
      );
  }
}