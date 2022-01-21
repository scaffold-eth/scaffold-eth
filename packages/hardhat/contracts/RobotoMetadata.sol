//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './ToColor.sol';

library RobotoMetadata {

  using Strings for uint256;
  using ToColor for bytes3;

  function tokenURI(uint id, bytes3 eyeColor, bytes3 earColor, bool gold, string memory svg) public pure returns (string memory) {
    string memory name = string(abi.encodePacked('Roboto #',id.toString()));
    string memory goldBoolean = 'false';
    if (gold) {
      goldBoolean = 'true';
    }
    string memory image = Base64.encode(bytes(svg));

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
                          description(eyeColor, earColor, gold),
                          '", "external_url":"https://www.roboto-svg.com/roboto/',
                          id.toString(),
                          '", "attributes": [{"trait_type": "Eyes Color", "value": "#',
                          eyeColor.toColor(),
                          '"},{"trait_type": "Ears Color", "value": "#',
                          earColor.toColor(),
                          '"},{"trait_type": "Gold", "value": ',
                          goldBoolean,
                          '}], "image": "',
                          'data:image/svg+xml;base64,',
                          image,
                          '"}'
                      )
                    )
                )
          )
      );
  }

  function description(bytes3 eyeColor, bytes3 earColor, bool gold) public pure returns (string memory) {
    string memory goldText = '';
    if (gold) {
      goldText = 'Gold ';
    }
    return string(abi.encodePacked(goldText,'Roboto with eyes color #',eyeColor.toColor(),' and ears color #',earColor.toColor(),'.'));
  }

  function robotColors(bool gold) public pure returns (string[6] memory) {
    if (gold) {
      return ['ffdf00', 'ffdc01', 'fed205', 'fcc20c', 'faac16', 'f8961f'];
    }
    return ['EEEEEE', 'ECECEC', 'E5E5E5', 'DADADA', 'C9C9C9', 'ACACAC'];
  }

  function renderRobotoById(bytes3 eyeColor, bytes3 earColor, bool gold, uint batteryStatus) public pure returns (string memory) {

    string[6] memory colors = robotColors(gold);

    string memory batteryStatusText;

    if (batteryStatus == 100000) {
      batteryStatusText = '1';
    } else {
      batteryStatusText = string(abi.encodePacked('0.',batteryStatus.toString()));
    }

    string memory batteryColor;

    if (batteryStatus <= 20000) {
      batteryColor = 'red' ;
    } else {
      batteryColor = '#00e90f';
    }

    string memory eyesText;

    if (batteryStatus == 0) {
      eyesText = string(abi.encodePacked(
        '<g id="XMLID_3_">',
          '<path id="XMLID_4_" class="st0" d="M313.3 379.4h4.7v1h-4.7z"/>',
        '</g>',
        '<g id="XMLID_12_">',
          '<path id="XMLID_13_" class="st0" d="M300.2 379.4h4.7v1h-4.7z"/>',
        '</g>'
      ));
    } else {
      eyesText = string(abi.encodePacked(
        '<circle id="XMLID_13_" class="st5" cx="314.9" cy="379.9" r="2.6"/>',
        '<circle id="XMLID_27_" class="st5" cx="303.3" cy="379.9" r="2.6"/>'
      ));
    }

    string memory render = string(abi.encodePacked(
      '<g transform="translate(-826, -1065) scale(3 3)">',
        '<style>',
          '.st0{fill:#848383}.st1{fill:#',earColor.toColor(),'}.st5{fill:#',eyeColor.toColor(),'}.st6{fill:#',colors[0],'}',
        '</style>',
        '<g id="XMLID_2_">',
          '<linearGradient id="XMLID_8_" gradientUnits="userSpaceOnUse" x1="309.3" y1="422.2" x2="309.3" y2="393.5" gradientTransform="matrix(1 0 0 -1 0 792)">',
            '<stop offset="0" style="stop-color:#',colors[0],'"/>',
            '<stop offset=".3" style="stop-color:#',colors[1],'"/>',
            '<stop offset=".5" style="stop-color:#',colors[2],'"/>',
            '<stop offset=".7" style="stop-color:#',colors[3],'"/>',
            '<stop offset=".9" style="stop-color:#',colors[4],'"/>',
            '<stop offset="1" style="stop-color:#',colors[5],'"/>',
          '</linearGradient>',
          '<path id="XMLID_36_" d="M324.7 373.3v17.6c0 1.8-1.5 3.3-3.3 3.3h-7.5a4.5 4.5 0 0 1-9 0h-7.7a3.3 3.3 0 0 1-3.3-3.3v-17.6c0-2 1.6-3.5 3.5-3.5h23.9c1.9 0 3.4 1.6 3.4 3.5z" style="fill:url(#XMLID_8_)"/>',
        '</g>',
        '<g id="XMLID_1_">',
          '<path id="XMLID_29_" class="st1" d="M293 376.4c1 0 1.8.8 1.8 1.8v5.6c0 1-.8 1.8-1.8 1.8"/>',
          '<linearGradient id="XMLID_11_" gradientUnits="userSpaceOnUse" x1="293" y1="379.1" x2="295.4" y2="379.1" gradientTransform="translate(0 2)">',
            '<stop offset=".3" style="stop-color:#fff"/>',
            '<stop offset="1" style="stop-color:#acacac"/>',
          '</linearGradient>',
          '<path id="XMLID_22_" d="M293 375.9c1.3 0 2.4 1 2.4 2.4v5.6c0 1.3-1 2.4-2.4 2.4m0-1.2c.7 0 1.2-.5 1.2-1.2v-5.6c0-.7-.5-1.2-1.2-1.2" style="fill:url(#XMLID_11_)"/>',
        '</g>',
        '<g id="XMLID_5_">',
          '<path id="XMLID_21_" class="st1" d="M325.3 385.7c-1 0-1.8-.8-1.8-1.8v-5.6c0-1 .8-1.8 1.8-1.8"/>',
          '<linearGradient id="XMLID_12_" gradientUnits="userSpaceOnUse" x1="33.7" y1="142.5" x2="36" y2="142.5" gradientTransform="rotate(180 179.5 261.8)">',
            '<stop offset=".3" style="stop-color:#fff"/>',
            '<stop offset="1" style="stop-color:#acacac"/>',
          '</linearGradient>',
          '<path id="XMLID_18_" d="M325.3 386.2c-1.3 0-2.4-1-2.4-2.4v-5.6c0-1.3 1-2.4 2.4-2.4m0 1.2c-.7 0-1.2.5-1.2 1.2v5.6c0 .7.5 1.2 1.2 1.2" style="fill:url(#XMLID_12_)"/>',
        '</g>',
        '<g id="XMLID_24_">',
          '<path id="XMLID_15_" style="fill:#848383" d="M303.4 387.8H315v1h-11.6z"/>',
        '</g>',
        eyesText,
        '<g id="XMLID_7_">',
          '<path id="XMLID_17_" class="st6" d="M322.4 396.2h-25.5c-.4 0-.8.3-.8.8v10.5h27V397c0-.5-.3-.8-.7-.8z"/>',
        '</g>',
        '<g id="XMLID_6_">',
          '<path id="XMLID_35_" d="M319.9 405.4h-21a.4.4 0 0 1-.4-.4v-6.2c0-.2.2-.4.4-.4h21c.2 0 .4.2.4.4v6.2c0 .2-.2.4-.4.4z" style="fill:#525252"/>',
        '</g>',
        '<g id="XMLID_32_">',
          '<path id="XMLID_9_" class="st6" d="M327.9 396.8v10.7h-4.4v-10.7c0-.3.3-.6.6-.6h3.2c.3 0 .6.2.6.6z"/>',
        '</g>',
        '<g id="XMLID_30_">',
          '<path id="XMLID_10_" class="st6" d="M295.7 396.7v10.8h-4.4v-10.8c0-.3.3-.6.6-.6h3.2c.4 0 .6.3.6.6z"/>',
        '</g>',
        '<g id="XMLID_4_">',
          '<linearGradient id="XMLID_16_" gradientUnits="userSpaceOnUse" x1="299.6" y1="401.9" x2="319" y2="401.9">',
            '<stop offset="',batteryStatusText,'" style="stop-color:',batteryColor,'"/>',
            '<stop offset="0" style="stop-color:#00e70f;stop-opacity:.5331"/>',
            '<stop offset="0" style="stop-color:#00e011;stop-opacity:.365"/>',
            '<stop offset="0" style="stop-color:#00d513;stop-opacity:.2451"/>',
            '<stop offset=".9" style="stop-color:#00c416;stop-opacity:.1482"/>',
            '<stop offset=".9" style="stop-color:#00ae1a;stop-opacity:6.611276e-002"/>',
            '<stop offset="1" style="stop-color:#00961f;stop-opacity:0"/>',
          '</linearGradient>',
          '<path id="XMLID_14_" style="fill:url(#XMLID_16_)" d="M299.6 399.4H319v5h-19.4z"/>',
        '</g>',
      '</g>'
      ));

    return render;
  }
}