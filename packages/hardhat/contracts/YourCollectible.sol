pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("BuidlGuidlBalloons", "BGB") {
    // RELEASE THE LOOGIES!
  }

  mapping (uint256 => bytes3) public color1;
  mapping (uint256 => bytes3) public color2;
  mapping (uint256 => bytes3) public color3;
  mapping (uint256 => bytes3) public color4;
  mapping (uint256 => bytes3) public color5;
  mapping (uint256 => bytes3) public color6;

  uint256 mintDeadline = block.timestamp + 24 hours;

  function mintItem()
      public
      returns (uint256)
  {
      require( block.timestamp < mintDeadline, "DONE MINTING");
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this), id ));
      color1[id] = bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes3(predictableRandom[2]) >> 16 );
      color2[id] = bytes2(predictableRandom[3]) | ( bytes2(predictableRandom[4]) >> 8 ) | ( bytes3(predictableRandom[5]) >> 16 );
      color3[id] = bytes2(predictableRandom[6]) | ( bytes2(predictableRandom[7]) >> 8 ) | ( bytes3(predictableRandom[8]) >> 16 );
      color4[id] = bytes2(predictableRandom[9]) | ( bytes2(predictableRandom[10]) >> 8 ) | ( bytes3(predictableRandom[11]) >> 16 );
      color5[id] = bytes2(predictableRandom[12]) | ( bytes2(predictableRandom[13]) >> 8 ) | ( bytes3(predictableRandom[14]) >> 16 );
      color6[id] = bytes2(predictableRandom[15]) | ( bytes2(predictableRandom[16]) >> 8 ) | ( bytes3(predictableRandom[17]) >> 16 );

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('BuidlGuidl Balloon #',id.toString()));
      string memory description = string(abi.encodePacked('This balloon is the color #',color1[id].toColor()));
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
                              color1[id].toColor(),
                              '"},{"trait_type": "chubbiness", "value": ',
                              "69",
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

  function generateSVGofTokenById(uint256 id) public view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg viewBox="0 0 573.1 688.68" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }


  //bytes3 color1 = color1[id];
  //bytes3 color2 = 0xc5f9d0;
  //bytes3 color3 = 0xffb93b;
  //bytes3 color4 = 0xEB144C;
  //bytes3 color5 = 0x057C22;
  //bytes3 color6 = 0xffe5ab;

  bytes3 bottomColor1 = 0x056b68;
  bytes3 bottomColor2 = 0x083330;

  bytes3 basket1 = 0x8c6239;
  bytes3 basket2 = 0x603813;
  bytes3 basketGlow = 0x4b2330;
  bytes3 basketCage = 0x39b54a;

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
        '<defs><style>.cls-1{isolation:isolate;}.cls-2{fill:#',
        color2[id].toColor(),
        ';}.cls-3{fill:url(#linear-gradient);}.cls-4{fill:url(#linear-gradient-2);}.cls-5{fill:#',
        basketCage.toColor(),
        ';}.cls-6{fill:#',
        color3[id].toColor(),
        ';}.cls-7{fill:#',
        color4[id].toColor(),
        ';}.cls-8{fill:#',
        color5[id].toColor(),
        ';}.cls-9{fill:#',
        color1[id].toColor(),
        ';}.cls-10{fill:#',
        color6[id].toColor(),
        ';}.cls-11,.cls-12,.cls-13,.cls-14,.cls-15,.cls-16,.cls-17{mix-blend-mode:overlay;opacity:0.22;}.cls-11{fill:url(#linear-gradient-3);}.cls-12{fill:url(#linear-gradient-4);}.cls-13{fill:url(#linear-gradient-5);}.cls-14{fill:url(#linear-gradient-6);}.cls-15{fill:url(#linear-gradient-7);}.cls-16{fill:url(#linear-gradient-8);}.cls-17{fill:url(#linear-gradient-9);}.cls-18{fill:url(#linear-gradient-10);}</style><linearGradient id="linear-gradient" x1="255.35" y1="633.88" x2="315.1" y2="633.88" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#',
        basket1.toColor(),
        '"/><stop offset="1" stop-color="#',
        basket2.toColor(),
        '"/></linearGradient><linearGradient id="linear-gradient-2" x1="284.98" y1="622.26" x2="285.25" y2="611.9" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#',
        basketGlow.toColor(),
        '"/><stop offset="1" stop-color="#',
        basket2.toColor(),
        '"/></linearGradient><linearGradient id="linear-gradient-3" x1="138.78" y1="285.07" x2="231.88" y2="264.83" gradientUnits="userSpaceOnUse"><stop offset="0"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="linear-gradient-4" x1="158.1" y1="283.66" x2="108.96" y2="297.48" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1"/></linearGradient><linearGradient id="linear-gradient-5" x1="109.58" y1="304.2" x2="90.08" y2="309.61" href="#linear-gradient-4"/><linearGradient id="linear-gradient-6" x1="209.4" y1="259.94" x2="354.06" y2="259.94" gradientUnits="userSpaceOnUse"><stop offset="0"/><stop offset="0.5" stop-color="#fff"/><stop offset="1"/></linearGradient><linearGradient id="linear-gradient-7" x1="338.26" y1="265.53" x2="393.9" y2="273.87" href="#linear-gradient-4"/><linearGradient id="linear-gradient-8" x1="424.24" y1="294.08" x2="446.63" y2="301.54" href="#linear-gradient-4"/><linearGradient id="linear-gradient-9" x1="447.56" y1="302.56" x2="472.64" y2="309.1" href="#linear-gradient-4"/><linearGradient id="linear-gradient-10" x1="209.31" y1="500.91" x2="352.39" y2="500.91" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#',
        bottomColor1.toColor(),
        '"/><stop offset="1" stop-color="#',
        bottomColor2.toColor(),
        '"/></linearGradient></defs><g class="cls-1"><g id="Layer_1" data-name="Layer 1"><polygon class="cls-2" points="230.4 526 270.8 588.6 271.69 588.03 231.29 525.43 230.4 526"/><rect class="cls-2" x="277.26" y="556.07" width="71.78" height="1.06" transform="translate(-325.49 555.43) rotate(-60.53)"/><polygon class="cls-2" points="230.34 525.87 256.41 612.81 257.43 612.5 231.35 525.56 230.34 525.87"/><polygon class="cls-2" points="311.63 610.2 312.66 610.43 331.35 525.48 330.32 525.25 311.63 610.2"/><path class="cls-3" d="M255.35,613l6.16,34.32c0,3.59,10.62,7.49,23.71,7.49s23.72-3.9,23.72-7.49L315.1,613"/><ellipse class="cls-4" cx="285.22" cy="612.98" rx="29.88" ry="8.18"/><path class="cls-5" d="M306.16,607.18,301,590.63c-.76-2.49-3.55-4.22-6.78-4.22H273.38c-3.29,0-6.09,1.77-6.81,4.3l-4.85,17.17L259.14,617a23.66,23.66,0,0,0,2.48,1l3.12-11,4.39-15.55c.38-1.35,2.21-2.37,4.25-2.37h20.87c2,0,3.83,1,4.23,2.33l4.67,15.07,3.75,12.09c.91-.26,1.75-.55,2.52-.84Z"/><path class="cls-6" d="M477,264c-5.68,8.08-23.82,8.5-28.7,8.32-1.06,4.16-1.44,5.27,0,0h0c-2.33-19.44-19.23-55-25.94-63.22-10.7-3.35-38.08,9.19-45,16.05h0v0c-7.14-12-31.46-45.36-44.69-50.51-47.3,20.73-53.15,28.55-53.15,28.55S274.27,192,228.26,175c-13.23,5.15-36.75,38.05-43.88,50.08v0h0c-6.93-6.86-34.31-19.4-45-16.05-6.71,8.2-23.61,43.78-25.94,63.22h0c1.44,5.25,1.06,4.15,0,0-4.88.18-23-.24-28.69-8.32-9,41.86,4.34,59.88,23.28,91.46-1.84-9.89-1.49-24,.6-28.06,6.12,6.85,22.25,8.47,28.25,7.35,2.11-12.69,8.37-44.63,14.59-53.85,11.06,6.82,33.74,13.51,43.59,15.75,7.32-11.91,27.71-41.44,37.17-48.07,13.3,9.09,39.13,21.49,48.49,31.72,9.1-10.2,40.39-25.63,48.48-31.72l.13.1.15-.1c10.21,8.16,28.19,34.65,37.13,48,9.89-2.1,35.38-10.25,43.35-15.7l.08.13.2-.13c6.23,11.08,11.41,38.8,14.59,53.85,6.41,1.15,21.93-.68,28-7.35a1.75,1.75,0,0,1,.11.24l.17-.24c1.81,5.42,1.78,18.25.6,28.06C472.63,323.79,485.92,305.89,477,264Z"/><path class="cls-2" d="M497.89,226.16l0-.35C496,210,494.9,198.46,482.14,175l0,0c-2.25,11.47-20,19.16-23.78,20.49-5.8-28.69-16.94-54.06-41.83-68.4h0c2.46,8.59,2.48,9.35,0,0h0c-8.3.55-32.21,12.29-38.06,22.54h0l-.09-.17c-10.57-21.07-26-37.94-47.94-49.09-12.27,1.45-40.23,21.53-49.05,32.41-.14.18-.3.36-.43.54-8.31-10.74-37-31.48-49.49-32.95h0l-.05,0c-22,11.17-37.39,28.07-48,49.18l0,0h0c-5.85-10.25-29.76-22-38.06-22.54h0c-2.48,9.35-2.46,8.6,0,0h0c-24.89,14.34-36,39.71-41.83,68.4-3.75-1.33-21.53-9-23.77-20.49l0,0c-12.76,23.46-13.83,35-15.71,50.82,0,.11,0,.23,0,.34,1,25.69,7.77,53.45,21.09,84.27-1-15.91-4.62-21.43-.15-46.46h0c5.64,8.13,23.81,8.47,28.66,8.32h0c2.33-19.44,19.23-55,25.94-63.22h0c10.7-3.35,38.08,9.19,45,16.05v0h0c7.13-12,30.65-44.93,43.88-50.08h0l.16.09s0,0,0-.05v.07c11.23,2.24,43.41,21.31,52.39,32.09h0c9-10.78,41.16-29.85,52.39-32.09V175s0,.05,0,.05l.16-.09h0c13.23,5.15,36.75,38.05,43.89,50.08h0v0c6.92-6.86,34.3-19.4,45-16.05h0c6.71,8.2,23.61,43.78,25.94,63.22h0c4.85.15,23-.19,28.66-8.32h0c4.46,25,2.3,29.16,1.27,45.07C491.55,278.22,496.9,251.85,497.89,226.16Z"/><path class="cls-7" d="M452.9,327.61a1.75,1.75,0,0,0-.11-.24c-6.2,6.79-21.64,8.45-28.25,7.35-2.68-15.1-7.91-43-14.59-53.85-8.09,5.51-33.58,13.65-43.59,15.75h0c-8.58-13.64-26.69-40.18-37.17-48.07-8.09,6.1-39.38,21.52-48.48,31.72-9.24-10.19-35.41-22.7-48.49-31.72-9.46,6.63-29.85,36.16-37.17,48.07h0c-9.86-2.26-32.53-8.91-43.59-15.75-6.22,9.22-12.48,41.16-14.59,53.85-6,1.12-22.13-.5-28.25-7.35-2.09,4.07-2.44,18.17-.6,28.06a483.29,483.29,0,0,0,32.92,46c-1.56-11.43-2.43-21.94-2.43-21.94,5.2,4.44,23.37,9.46,28.51,9.48,4.52-13.28,4.46-20.78,7.21-43.85,6.49,4.29,27.3,19.64,38.32,19.85v0c5.44-6.8,23.34-30.49,27.28-43.4,6.43,8.95,26.44,28.7,40.74,32.39v0c14-3.39,34.42-23.46,40.83-32.41l.06.19.12-.19c3.85,13.33,21.11,36,27.28,43.4v0c11.07-.37,31.69-15.57,38.14-19.84a1.69,1.69,0,0,1-.08.27,1.67,1.67,0,0,0,.08-.2l0,.1a1.37,1.37,0,0,1,.17-.17c1.77,19.52,2.13,31.49,6.65,44.52,5.49-.39,22.21-4.87,28.88-10.15h0a.41.41,0,0,0,0,.11l.15-.11h0c-.59,5.79-.95,16.67-2.47,21.94C434,383.74,447.19,368.22,454.14,354,455.58,344.4,454.93,332.5,452.9,327.61Z"/><path class="cls-8" d="M422.53,379.75h0l.19-.28c-.89.72-24.82,9.25-28.33,9.46l-.18,0c-1.25-2.91-5.57-28.46-7.09-42.67,0-.34-.07-.67-.1-1l0-.1a1.67,1.67,0,0,1-.08.2,1.69,1.69,0,0,0,.08-.27c-6.45,4.27-27.07,19.47-38.14,19.84h-.18l0,.06a.84.84,0,0,0,0-.1l-.31-.39c-5.68-7.16-22.6-29.68-26.79-42.46l-.12-.36-.06-.19,0,0c-5.35,8.11-37.41,32.29-40.43,32.32l-.08,0-.19,0h0s-35.5-24.43-40.75-32.38l0,0c-3.94,12.91-21.84,36.6-27.28,43.4a.84.84,0,0,0,0,.1l0-.06c-11-.21-31.83-15.56-38.32-19.85a1.69,1.69,0,0,0,.08.27,1.67,1.67,0,0,1-.08-.2C172.3,363.33,167.9,386.89,167,389c-7.84.12-28.37-9.37-28.51-9.48h0c.29,3.27.08,16.06,2.46,21.94C151,413.92,161.61,426,172.17,437.2c-1.69-3.54-2.87-11.67-1.71-13.44,8.25,9.68,29,16,32.39,16.57,2.56-13,.15-28.6.07-34.78,6.65,7.12,25.32,22.82,33.11,26.76-.27-.64-.34-.82,0,0,7.95-8,12.35-30.69,14-39l30.32,32.53.24.25.23-.25,30.32-32.53c1.68,8.27,6.08,30.94,14,39,.34-.82.27-.64,0,0,7.79-3.94,26.46-19.64,33.11-26.76-.08,6.18-2.49,21.79.07,34.78,3.41-.58,24.14-6.89,32.39-16.57,1.16,1.77,0,9.9-1.71,13.44,10.56-11.23,21.15-23.28,31.23-35.79.1-.23.18-.49.27-.75,1.67-4.92,2.14-20.45,2.19-21.08a.41.41,0,0,1,0-.11h0Z"/><path class="cls-9" d="M449.29,102.2c-21.53-21.55-50.69-38.11-81.71-43.26l.37.21c-22.37-8.6-68.58-25.5-87.1-8.06-18.14-18-73.13.52-93.53,11.8h0c.4-.3,6.35-3.67,6.81-4C116,74.11,56,144,63.8,225.94c2-15.76,2.92-27.66,15.79-50.91,2.24,11.47,20,19.16,23.77,20.49,6-43.35,40.86-92.63,78.52-43.83,27.17-50.51,59-63.95,100.26-16.35,39.9-47.51,70.66-33.89,96.44,15.8,37.62-49,73.78,1.22,79.75,44.39,3.75-1.34,21.53-9,23.78-20.5,12.87,23.26,13.8,35.15,15.78,50.91C499.51,178.15,487.86,130.9,449.29,102.2Z"/><path class="cls-10" d="M358.38,440.33c-2.56-13-.15-28.6-.07-34.78-6.65,7.12-25.32,22.82-33.11,26.76-7.95-8-12.35-30.69-14-39l-30.32,32.53-.23.25-.24-.25-30.32-32.53c-1.68,8.27-6.08,30.94-14,39-7.79-3.94-26.46-19.64-33.11-26.76.08,6.18,2.49,21.79-.07,34.78-3.41-.58-24.14-6.89-32.39-16.57-1.16,1.77,0,9.9,1.71,13.44,14.7,15.8,30.07,30.45,37.14,37.47H351.92c7.07-7,22.44-21.67,37.14-37.47,1.69-3.54,2.87-11.67,1.71-13.44C382.52,433.44,361.79,439.75,358.38,440.33Z"/><path class="cls-11" d="M265.3,475.48c-4.7-18.7-12-62.14-14.93-81.31-10.73-93.64-45.24-308.32,2.91-347.33-12.92-6-29.4,4.29-29.15,4C214.3,48.43,192,60.15,192,60.15,105.85,128.38,138.35,250.61,174.54,346v-.08c16.26,39.95,47,95.18,67.73,129.57Z"/><path class="cls-12" d="M242.27,475.48c-5.94-10.25-7.76-12.92-19.26-33C164.81,337.33,85.44,159.59,187.64,63.71h0c2.29-1.45,6.06-4.82,8.43-6-41.7,10.06-52.76,22.07-44.35,16.17C-7,164,119.33,382.28,215.55,475.48Z"/><path class="cls-13" d="M170.77,424.58C97.65,329.24,34,204.93,113.56,102.37,74.31,131,62.49,178.61,64.11,226.75l0-.13c3.16,90.95,79.85,198.7,151.4,248.86A591,591,0,0,1,170.77,424.58Z"/><path class="cls-14" d="M330.29,101.76C328.53,75,312.1,24.29,281.16,52.15v-.23s-8.55-9.74-20.83-7.8c-46.89,15.58-28.86,164.06-27.8,205.25h0c6.89,77.89,17.07,151.69,32.77,226.11l31.37.55c15.71-74.49,25.86-148.17,32.76-226.12l-.1.08.1-.08C332.8,204.18,336,148.75,330.29,101.76Zm-1.15,148.37.12-.09A.47.47,0,0,1,329.14,250.13Zm-.18.14Zm.05,0,.05,0Z"/><path class="cls-15" d="M416.42,128.48c-12.09-44-36.18-71.1-78.59-77.06l.72.77c-8.6-5.06-19.16-7.89-29.87-4.8A24.41,24.41,0,0,0,311.07,49l-.26-.07c52,70.9,2.71,316.58-14.14,427.12,8.35,1.22,23,0,23,0,6.87-11.84,56.07-101.14,67.74-129.57v.07C419.92,264.51,432.34,210.4,416.42,128.48Z"/><path class="cls-16" d="M482.85,181.92c-5.93-46.67-29.78-88.12-72.44-105.44A90.49,90.49,0,0,0,367.54,60.3a77.83,77.83,0,0,1,6.8,4h0c14.22,9.06,25.74,23.64,32.91,38.89h0C468.84,266.57,335,438.89,319.69,476c0,0,2.77,2.86,12.43,0,21.94,2.49,41.84-34.86,59.08-50.9C444.36,356.89,493.91,271.15,482.85,181.92Z"/><path class="cls-17" d="M448.41,102.92c39,41.42,42.44,110.6,28.51,162.41h0c-17,53.69-15.18,51.06-53.7,115.5h0A618.62,618.62,0,0,1,346.41,476h4.94c65.4-61.56,145.09-155.34,146.46-248.87l0,.14C499.48,179.16,487.66,131.55,448.41,102.92Z"/><path class="cls-18" d="M209.31,475.21c7.31,15.23,14.59,26.13,20.11,50.68,10.94,12.66,94.49,12.66,102.85,0,6.87-30.34,12-37.32,20.12-50.68C328.12,462.45,232,464.63,209.31,475.21Z"/></g></g>'
      ));

    return render;
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
