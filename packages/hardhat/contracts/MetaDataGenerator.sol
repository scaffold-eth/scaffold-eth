// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './HexStrings.sol';
/// @title NFTSVG
/// @notice Provides a function for generating an SVG associated with a Uniswap NFT
library MetaDataGenerator {

  using Strings for uint256;
  using HexStrings for uint160;

  function generateConfigString(uint256 _tokenBaseFee, uint _fireHeight, string memory _readableBaseFee, string memory _owner, uint256 _tokenId) internal pure returns (string memory) {

    if(_tokenBaseFee < 10000000) {
      _readableBaseFee = '&lt;0.01 Gwei';
    }

    return string(abi.encodePacked(Strings.toString((_tokenBaseFee + _tokenId) % 360),
    'deg)}#Fire_to_move{transform:translate(0px,',
    _fireHeight.toString(),
    'px)}</style></defs><text dy="0"><textPath xlink:href="#textcircle">EIP-1159 / #',
    _tokenId.toString(),
    ' / Basefee: ',
    _readableBaseFee,
    ' / ',
    _owner,
    unicode'🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥',
    '</textPath></text></svg>'));
  }

  function generateSVGofTokenById(uint256 _tokenId, uint256 _tokenBaseFee, string memory _readableBaseFee, address _owner, uint256 _minBaseFee, uint256 _maxBaseFee) internal pure returns (string memory) {

      uint height = 250;
      uint fireHeight;

      if(_minBaseFee == _maxBaseFee) {
        fireHeight = 0;
      } else {
        fireHeight = height*(uint(100)-(uint(100)*(_tokenBaseFee-_minBaseFee)/(_maxBaseFee-_minBaseFee))) / uint(100);
      }

      string memory ownerOrBurniest = '';

      if(_maxBaseFee == _tokenBaseFee) {
        ownerOrBurniest = unicode'🔥🔥🔥🔥🔥🔥🔥🔥🔥 Burniest Boy 🔥';
      } else {
        ownerOrBurniest = (uint160(_owner)).toHexString(20);
      }

      string memory svg = string(abi.encodePacked(
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300"><style>@keyframes fire-001_c_o{0%,51%,to{opacity:0}2.5%,50%{opacity:1}}@keyframes fire-003_c_o{0%,51%,to{opacity:1}2.5%,50%{opacity:0}}#fire-001{animation:fire-001_c_o 300ms linear infinite normal forwards}#fire-002{animation:fire-003_c_o 300ms linear infinite normal forwards}</style><defs><linearGradient id="linear-gradient" x1="150" x2="150" y2="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00bdd0"/><stop offset="1" stop-color="#008ad0"/></linearGradient><linearGradient id="linear-gradient-2" x1="30.7" y1="-8.2" x2="30.7" y2="141.5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f16d76"/><stop offset="1" stop-color="#ffa358"/></linearGradient><linearGradient id="linear-gradient-3" x1="34.5" y1="29.9" x2="34.5" y2="144.9" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffbd58"/><stop offset="1" stop-color="#f6ec47"/></linearGradient><linearGradient id="linear-gradient-4" x1="31.9" y1="2.5" x2="31.9" y2="146.3" xlink:href="#linear-gradient-2"/><linearGradient id="linear-gradient-5" x1="67.8" y1="27.9" x2="67.8" y2="74.5" xlink:href="#linear-gradient-2"/><linearGradient id="linear-gradient-6" x1="36.5" y1="-15.1" x2="36.5" y2="52.8" xlink:href="#linear-gradient-2"/><linearGradient id="linear-gradient-7" x1="33.6" y1="22.5" x2="33.6" y2="148.5" xlink:href="#linear-gradient-3"/><linearGradient id="linear-gradient-8" x1="23.1" y1="-8.3" x2="23.1" y2="155.9" xlink:href="#linear-gradient-2"/><linearGradient id="linear-gradient-9" x1="64.9" y1="6.7" x2="64.9" y2="100" xlink:href="#linear-gradient-2"/><linearGradient id="linear-gradient-10" x1="48.4" y1="-45.8" x2="48.4" y2="80.7" xlink:href="#linear-gradient-2"/><linearGradient id="linear-gradient-11" x1="25.6" y1="8.2" x2="25.6" y2="149.8" xlink:href="#linear-gradient-3"/><linearGradient id="linear-gradient-12" x1="150" y1="300" x2="150" y2="139.8" xlink:href="#linear-gradient-3"/><linearGradient id="linear-gradient-13" x1="96" y1="202.4" x2="150" y2="202.4" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#574581"/><stop offset="1" stop-color="#4c235b"/></linearGradient><linearGradient id="linear-gradient-14" x1="150" y1="202.4" x2="204" y2="202.4" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ea496a"/><stop offset="1" stop-color="#ea6b60"/></linearGradient><linearGradient id="linear-gradient-15" x1="150" y1="153.7" x2="204" y2="153.7" xlink:href="#linear-gradient-14"/><linearGradient id="linear-gradient-16" x1="204" y1="105" x2="150" y2="105" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-17" x1="96" y1="105" x2="150" y2="105" xlink:href="#linear-gradient-14"/><linearGradient id="linear-gradient-18" x1="96" y1="153.7" x2="150" y2="153.7" xlink:href="#linear-gradient-13"/><linearGradient id="linear-gradient-19" x1="149.1" y1="24" x2="149.1" y2="276" xlink:href="#linear-gradient-13"/><clipPath id="clip-path"><path class="cls-1" d="M0-42.3h300v188.6H0z"/></clipPath><clipPath id="clip-path-2"><path class="cls-1" d="M.4 0h300v300H.4z"/></clipPath><style>.cls-1{fill:none}.cls-2{fill:url(#linear-gradient)}.cls-4{fill:url(#linear-gradient-2)}.cls-5{fill:url(#linear-gradient-3)}.cls-6{fill:url(#linear-gradient-4)}.cls-7{fill:url(#linear-gradient-5)}.cls-8{fill:url(#linear-gradient-6)}.cls-9{fill:url(#linear-gradient-7)}.cls-14{fill:url(#linear-gradient-12)}.cls-15{opacity:.2}.cls-16{clip-path:url(#clip-path-2)}.cls-17{fill:#e75a00}.cls-18{fill:url(#linear-gradient-13)}.cls-19{fill:#fff}.cls-20{fill:url(#linear-gradient-14)}.cls-21{fill:url(#linear-gradient-15)}.cls-22{fill:url(#linear-gradient-16)}.cls-23{fill:url(#linear-gradient-17)}.cls-24{fill:url(#linear-gradient-18)}.cls-25{stroke:#fff;stroke-miterlimit:10;fill:url(#linear-gradient-19)}</style></defs><path class="cls-2" d="M0 0h300v300H0z" id="background"/><g id="fire-layer"><g id="Fire_to_move" data-name="Fire to move"><g id="Fire1"><g id="fire-001"><path class="cls-4" d="M-4.4 139.2c-.4-12.2-17.5-31.5-9.6-49s21-13 24-30c0 0 10.3 9.6 1.1 21.6 0 0 13.3-3.8 12.8-14.6s1.5-15.7-7.4-18-22.2-18.4-9.3-35.5c0 0 2.4 14.4 13.8 8.1s20.7-26 1-26.5c0 0 12.3-8.1 19.7.4s-9.4 27-3.5 31.5S52 33.1 51.5 43 35.8 61.8 41.2 66.3s19.3 1.5 19.7-3.3c.3-4.8-7.9-10.6-1-20a18.7 18.7 0 0 0 9 11.8c9.9 5.5 12.2 17.8 2.3 26.8-6.7 6.2-15-3.4-15.9 5.9-.6 5.4 21 13 19 29.1-3.7 29.7 9.3 24.5-33.1 24.5-47.6 0-45.6-1.9-45.6-1.9z"/><path class="cls-5" d="M35 145c-62.2 0-33.8-7.3-27-16.2C19.8 113.2-2.7 113.6-2.2 100s8.9-20.3 8.9-20.3-5.2 16 2.2 16.5S24 91 27.9 76c6.6-26.2.5-40.3-8.4-46.2A37.5 37.5 0 0 1 38 39.6c6 6-4.6 17.3-4.3 26.7.7 24.6 34.8 5 31.7-5.8 0 0 9.5 14.8-2.9 17-22.4 4.2-21.4 20.6-13 26s6 16.3 13.6 24.6c10 11 26 16.8-28.3 16.8z"/></g><g id="fire-002"><path class="cls-6" d="M37.8 152.7c-23.3 0-42.6.9-40-12.9s14.7-39.4 8.9-46.3S-3 95-12.7 92.3-31.9 72-28 64s26.8 0 33-3.7 5-9.5 4.3-14 12.3-15.1 13.6-20.4-10.4-10.6-4-23.3c0 0 7.9 11.7 24 20.6s-8.4 19.7-6 31.7S40.4 83 51.4 85.3s8.4-4.3 7.1-7.7-11-3.5-6.5-17.4c0 0 4.6 7.3 13 8.6s21.4.6 22 8.8-6.5 11.7-5.8 15.9 18.6.5 8.2 17.4-33 7.5-26.9 11.5c15.8 10.3 20.9 30.3-24.7 30.3z"/><path class="cls-7" d="M75 28S60.6 34.3 60.6 39s-.9 11.8 7.1 9S68 34.2 75 28z"/><path class="cls-8" d="M31.9-14.3c-.2-3.5-5.8 5-4 12.2s6 5.9 16 12.4c0 0 3.8-11 0-12.3S32.4.5 31.8-14.3z"/><path class="cls-9" d="M36.5 148.2c-19.9 0-47 2.6-38.8-8.4S29.2 89.3 14 85.4c-13.4-3.5-27.6 7-32-10.2s25.1.6 30.3-6 3.5-18.3 10.4-28 12.8-8.9 9.2-18.7c0 0 16 10.4 4.6 17.2s-18.5 13-9 24.5S38.6 96 51.2 96 72.6 84.7 65 75.2c0 0 10.9.2 11.3 7.9s-6.5 14.4-1.4 18.2 14.7 0 8.7 6.8-28.5 2-30.7 8.3 25 14.2 20.4 24c-4.3 8.7-25.6 7.8-36.8 7.8z"/></g></g><use href="#Fire1" x="77"/><use href="#Fire1" x="154"/><use href="#Fire1" x="231"/><path class="cls-14" d="M0 139.8h300V300H0z"/></g></g><g class="cls-15" id="ray"><g class="cls-16"><path id="ray1" class="cls-17" d="M153.4 383q8.5-.1 16.9-.8L153.4 211z"/></g><use href="#ray1" transform="rotate(5.6 150 150)"/><use href="#ray1" transform="rotate(11.3 150 150)"/><use href="#ray1" transform="rotate(16.9 150 150)"/><use href="#ray1" transform="rotate(22.5 150 150)"/><use href="#ray1" transform="rotate(28.1 150 150)"/><use href="#ray1" transform="rotate(33.8 150 150)"/><use href="#ray1" transform="rotate(39.4 150 150)"/><use href="#ray1" transform="rotate(45 150 150)"/><use href="#ray1" transform="rotate(50.6 150 150)"/><use href="#ray1" transform="rotate(56.3 150 150)"/><use href="#ray1" transform="rotate(61.9 150 150)"/><use href="#ray1" transform="rotate(67.5 150 150)"/><use href="#ray1" transform="rotate(73.1 150 150)"/><use href="#ray1" transform="rotate(78.8 150 150)"/><use href="#ray1" transform="rotate(84.4 150 150)"/><use href="#ray1" transform="rotate(90 150 150)"/><use href="#ray1" transform="rotate(95.6 150 150)"/><use href="#ray1" transform="rotate(101.3 150 150)"/><use href="#ray1" transform="rotate(106.9 150 150)"/><use href="#ray1" transform="rotate(112.5 150 150)"/><use href="#ray1" transform="rotate(118.1 150 150)"/><use href="#ray1" transform="rotate(123.8 150 150)"/><use href="#ray1" transform="rotate(129.4 150 150)"/><use href="#ray1" transform="rotate(135 150 150)"/><use href="#ray1" transform="rotate(140.6 150 150)"/><use href="#ray1" transform="rotate(146.3 150 150)"/><use href="#ray1" transform="rotate(151.9 150 150)"/><use href="#ray1" transform="rotate(157.5 150 150)"/><use href="#ray1" transform="rotate(163.1 150 150)"/><use href="#ray1" transform="rotate(168.8 150 150)"/><use href="#ray1" transform="rotate(174.4 150 150)"/><use href="#ray1" transform="rotate(180 150 150)"/><use href="#ray1" transform="rotate(185.6 150 150)"/><use href="#ray1" transform="rotate(191.3 150 150)"/><use href="#ray1" transform="rotate(196.9 150 150)"/><use href="#ray1" transform="rotate(202.5 150 150)"/><use href="#ray1" transform="rotate(208.1 150 150)"/><use href="#ray1" transform="rotate(213.8 150 150)"/><use href="#ray1" transform="rotate(219.4 150 150)"/><use href="#ray1" transform="rotate(225 150 150)"/><use href="#ray1" transform="rotate(230.6 150 150)"/><use href="#ray1" transform="rotate(236.3 150 150)"/><use href="#ray1" transform="rotate(241.9 150 150)"/><use href="#ray1" transform="rotate(247.5 150 150)"/><use href="#ray1" transform="rotate(253.1 150 150)"/><use href="#ray1" transform="rotate(258.8 150 150)"/><use href="#ray1" transform="rotate(264.4 150 150)"/><use href="#ray1" transform="rotate(270 150 150)"/><use href="#ray1" transform="rotate(275.6 150 150)"/><use href="#ray1" transform="rotate(281.3 150 150)"/><use href="#ray1" transform="rotate(286.9 150 150)"/><use href="#ray1" transform="rotate(292.5 150 150)"/><use href="#ray1" transform="rotate(298.1 150 150)"/><use href="#ray1" transform="rotate(303.8 150 150)"/><use href="#ray1" transform="rotate(309.4 150 150)"/><use href="#ray1" transform="rotate(315 150 150)"/><use href="#ray1" transform="rotate(320.6 150 150)"/><use href="#ray1" transform="rotate(326.3 150 150)"/><use href="#ray1" transform="rotate(331.9 150 150)"/><use href="#ray1" transform="rotate(337.5 150 150)"/><use href="#ray1" transform="rotate(343.1 150 150)"/><use href="#ray1" transform="rotate(348.8 150 150)"/><use href="#ray1" transform="rotate(354.4 150 150)"/></g><g id="Ether"><path class="cls-18" d="M150 197.4v44.5l-54-79 54 34.5z"/><path class="cls-19" d="M150 242.3a.4.4 0 0 1-.3-.2l-54-78.9a.4.4 0 0 1 .5-.5l54 34.3a.4.4 0 0 1 .2.4v44.5a.4.4 0 0 1-.3.4.4.4 0 0 1-.1 0zm-52.6-78l52.2 76.3v-43z"/><path class="cls-20" d="M204 163l-54 78.9v-44.5l54-34.4z"/><path class="cls-19" d="M150 242.3a.4.4 0 0 1-.1 0 .4.4 0 0 1-.3-.4v-44.5a.4.4 0 0 1 .2-.4l54-34.3a.4.4 0 0 1 .5.5l-54 78.9a.4.4 0 0 1-.3.2zm.4-44.7v43l52.2-76.2z"/><path class="cls-21" d="M204 151.9l-54-30.7v65l54-34.3z"/><path class="cls-19" d="M150 186.7a.4.4 0 0 1-.4-.4v-65.1a.4.4 0 0 1 .6-.4l54 30.7a.4.4 0 0 1 0 .7l-54 34.4a.4.4 0 0 1-.2 0zm.4-64.8v63.6l52.8-33.6z"/><g><path class="cls-22" d="M204 151.9L150 58v63l54 30.8z"/><path class="cls-19" d="M204 152.3a.4.4 0 0 1-.2 0l-54-30.8a.4.4 0 0 1-.2-.3v-63a.4.4 0 0 1 .7-.3l54 93.8a.4.4 0 0 1-.3.6zM150.4 121l52.5 29.8-52.5-91.2z"/></g><g><path class="cls-23" d="M150 58.1v63L96 152 150 58z"/><path class="cls-19" d="M96 152.3a.4.4 0 0 1-.3-.6l54-93.8a.4.4 0 0 1 .7.2v63a.4.4 0 0 1-.2.4l-54 30.7a.4.4 0 0 1-.2 0zm53.6-92.7l-52.5 91.2 52.5-29.8z"/></g><g><path class="cls-24" d="M150 121.2v65L96 152l54-30.7z"/><path class="cls-19" d="M150 186.7a.4.4 0 0 1-.2 0l-54-34.5a.4.4 0 0 1 0-.7l54-30.7a.4.4 0 0 1 .6.4v65a.4.4 0 0 1-.4.5zm-53.2-34.8l52.8 33.6V122z"/></g><g><path class="cls-19" d="M203.8 162.7L150 196.9l-53.8-34.2a.4.4 0 0 0-.5.5l54 78.9a.4.4 0 0 0 .2.1.4.4 0 0 0 .2 0 .4.4 0 0 0 .2 0v-.1l54-78.9a.4.4 0 0 0-.5-.5zm-54.2 34.9v43l-52.2-76.2zm.8 43v-43l52.2-33.2z"/><path class="cls-19" d="M95.6 151.9a.4.4 0 0 0 .1.2v.1l54 34.4h.1a.4.4 0 0 0 .4 0l54-34.4h.1a.4.4 0 0 0 0-.2.4.4 0 0 0 0-.1h.1a.4.4 0 0 0 0-.2l-54-93.8a.4.4 0 0 0-.1 0 .3.3 0 0 0-.1-.1.2.2 0 0 0-.1 0 .4.4 0 0 0-.1 0h-.1a.3.3 0 0 0-.1 0 .3.3 0 0 0-.1.1l-54 93.8a.4.4 0 0 0 0 .2c-.1 0 0 0 0 0zm54-30v63.6L96.8 152zm.8 63.6V122l52.8 30zm0-64.5V59.6l52.5 91.2zm-.8-61.4V121l-52.5 29.8z"/></g></g><g id="Ring"><g id="rotatethis"><path class="cls-25" d="M149 24a126 126 0 1 0 126 126A126 126 0 0 0 149 24zm0 225.3a99.3 99.3 0 1 1 99.4-99.3 99.3 99.3 0 0 1-99.3 99.3z"/><path id="textcircle" class="cls-1" d="M32 150a118 118 0 1 0 236 0 118 118 0 1 0-236 0"><animateTransform attributeName="transform" begin="0" dur="50s" type="rotate" from="0 150 150" to="360 150 150" repeatCount="indefinite"/></path></g></g><defs><style>text{font-size:16px;font-family:Helvetica,sans-serif;font-weight:900;fill:#fff;letter-spacing:1px}#Ether,#Ring,#background{filter:hue-rotate(',
        generateConfigString(_tokenBaseFee, fireHeight, _readableBaseFee, ownerOrBurniest,_tokenId)
        ));

      return svg;
  }

  function tokenURI(uint256 _tokenId, uint256 _tokenBaseFee, address _owner, uint256 _minBaseFee, uint256 _maxBaseFee) internal pure returns (string memory) {

      string memory name = string(abi.encodePacked('Burny Boy #',_tokenId.toString()));
      string memory readableBaseFee = '';

      if(_tokenBaseFee < uint(10_000_000)) {
        readableBaseFee = string(abi.encodePacked(_tokenBaseFee.toString(), ' wei'));
        } else if(_tokenBaseFee < uint(100_000_000)) {
          readableBaseFee = string(abi.encodePacked('0.0',Strings.toString(_tokenBaseFee/uint(10_000_000)), ' Gwei'));
        } else if(_tokenBaseFee < uint(10_000_000_000)) {
          readableBaseFee = string(abi.encodePacked(Strings.toString(_tokenBaseFee/uint(1_000_000_000)),'.',Strings.toString((_tokenBaseFee/uint(10_000_000)) % uint(100)), ' Gwei'));
        } else {
          readableBaseFee = string(abi.encodePacked(Strings.toString(_tokenBaseFee/uint(1_000_000_000)), ' Gwei'));
        }

      string memory description = string(abi.encodePacked('When this burny boy was minted, the basefee was ',readableBaseFee));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(_tokenId,  _tokenBaseFee, readableBaseFee, _owner, _minBaseFee, _maxBaseFee)));

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
                              '", "attributes": [{"trait_type": "Base fee per gas (Gwei)", "value": ',
                              Strings.toString(_tokenBaseFee/uint(1_000_000_000)),
                              '}], "owner":"',
                              (uint160(_owner)).toHexString(20),
                              '", "image_data": "',
                              'data:image/svg+xml;base64,',
                              image,
                              '"}'
                          )
                        )
                    )
              )
          );
  }

}
