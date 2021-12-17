pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

import './HexStrings.sol';
import './Buzz.sol';

contract OldEnglish is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public immutable limit;
  uint256 public immutable curve;
  uint256 public price;

  uint256 public sipsPerForty = 13;
  mapping (uint256 => uint256) public sips;
  mapping (uint256 => bool) public wrapped;

  event Drink(uint256 indexed id, address indexed sender, address indexed drinker);
  event Wrap(uint256 indexed id, address indexed sender, bool wrapped);
  event Recycle(uint256 indexed id, address indexed sender, uint256 indexed amount);
  event Receive(address indexed sender, uint256 indexed amount, uint256 indexed tokenId);

  address buzz;

  constructor(uint256 _limit, uint256 _curve, uint256 _price) ERC721("OldEnglish", "OE") {
    limit = _limit;
    curve = _curve;
    price = _price;
  }

  function setBuzz(address _buzz) public onlyOwner {
    buzz = _buzz;
  }

  function mintItem()
      public
      payable
      returns (uint256)
  {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      price = (price * curve) / 1000;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      emit Receive(msg.sender, msg.value, id);

      return id;
  }

  function sip(uint256 id) public {
    require(ownerOf(id) == msg.sender, "only owner can sip!");
    require(sips[id] < sipsPerForty, "this drink is done!");
    sips[id] += 1;
    Buzz(buzz).mint(msg.sender);
    emit Drink(id, msg.sender, msg.sender);
  }

  function pour(uint256 id, address drinker) public {
    require(ownerOf(id) == msg.sender, "only owner can pour!");
    require(sips[id] < sipsPerForty, "this drink is done!");
    sips[id] += 1;
    Buzz(buzz).mint(drinker);
    emit Drink(id, msg.sender, drinker);
  }

  function wrap(uint256 id) public {
    require(ownerOf(id) == msg.sender, "only owner can wrap!");
    wrapped[id] = !wrapped[id];
    emit Wrap(id, msg.sender, wrapped[id]);
  }

  function recycled() public view returns(uint256) {
    return balanceOf(address(this)) + balanceOf(0x000000000000000000000000000000000000dEaD);
  }

  function recycle(uint256 id) public {
    require(ownerOf(id) == msg.sender, "only owner can recycle!");
    require(sips[id] == sipsPerForty, "still drink left!");

    uint supply = _tokenIds.current();

    uint amount = address(this).balance / (supply - recycled());

    _transfer(msg.sender, address(this), id);

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "could not send");

    emit Recycle(id, msg.sender, amount);
  }

  receive() external payable {
    require(_tokenIds.current() > recycled() || _tokenIds.current() < limit, "no bottles left!");
    emit Receive(msg.sender, msg.value, 0);
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('OE #',id.toString()));
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
                              ownerOf(id) == address(this) ? "A recycled bottle of OE" : "Sipping on cool, crisp OE 40s!",
                              '", "external_url":"https://oe40.me", "attributes": ',
                              getAttributesForToken(id),
                              '"owner":"',
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

  function getAttributesForToken(uint256 id) internal view returns (string memory) {
    return string(abi.encodePacked(
      '[{"trait_type": "sips", "value": ',
      uint2str(sips[id]),
      '}, {"trait_type": "wrapped", "value": "',
      wrapped[id] ? "wrapped" : "unwrapped",
      '"}, {"trait_type": "state", "value": "',
      ownerOf(id) == address(this) ? "recycled" : "still OE",
      '"}],'
      ));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" width="216.18" height="653.57">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {

    if(wrapped[id]) {
      return '<defs><style>.cls-1,.cls-5{fill:#fff}.cls-1,.cls-10,.cls-11,.cls-12,.cls-13,.cls-2,.cls-3,.cls-4,.cls-8,.cls-9{stroke:#000;stroke-miterlimit:10}.cls-2,.cls-6{fill:#8a1300}.cls-3{fill:#ffdd74}.cls-4{fill:#bfa100}.cls-5,.cls-7{font-size:31.38px;letter-spacing:.02em;font-family:Arial-Black,Arial Black;font-weight:800}.cls-7{font-size:78px;fill:#ffede9;letter-spacing:.01em}.cls-8{fill:#c97700}.cls-10,.cls-9{fill:#ffc44a}.cls-9{opacity:.17}.cls-11{fill:#c7b299}.cls-12,.cls-13{fill:#998675}.cls-13{opacity:.39}</style></defs><path class="cls-1" d="M7 522S5 631 29 636c0 0 0 13 80 13h56s24-9 31-22c0 0 9-15 12-42v-63l4-176V242S166 93 136 49a58 58 0 0 0-6-7c-25-26-39-9-43-3a22 22 0 0 0-2 3S9 200 11 242c0 0-4 37-4 58Z"/><path class="cls-4" d="M78 5c-2 4-6 18 0 33 0 0 21 11 60 0 0 0 8-27-4-33 0 0-19 11-56 0Z"/><path class="cls-4" d="M107 1S76 2 80 5c0 0 32 9 56 0 0 0 5-3-29-4ZM75 14s14 9 48 4M75 29s8 6 48 0"/><path class="cls-9" d="M29 636s122-19 148-5"/><path class="cls-11" d="M50 82s-10 1-9 6l1 5s5 3 9 3-3 3-3 3 0 4 4 5c0 0-9-3-11 0s-4 10 0 11-15-4-13 3c0 0-6 3 3 6 0 0 0 13-5 21 0 0-14 43-16 57 0 0-8 88-9 120s0 251 6 267c0 0-5 48 27 57 0 0 128 12 143 5 0 0 39 2 35-38 0 0 6-36 3-43l1-328s-40-128-45-130c0 0 10-6 5-9 0 0-3-8-7-5 0 0 16-7 8-10 0 0-5-7-8-2 0 0-5-11-10-7 0 0-9 2-8 5s-23 5-23 5a84 84 0 0 1-37-1s-33 3-41-3v-3Z"/><path class="cls-12" d="M68 79H57s-8-1-7 6 6 7 6 7l2 1 60 2 36-6 5-10s10-9 0-8h-10l3 8s-11 26-87 7Z"/><path class="cls-13" d="m157 124 40 120s9 346 4 361c0 0-8 28-38 23"/>';
    }

    string memory fluid = string(abi.encodePacked('<path class="cls-2" d="M639.54 142.77s20.72 14.18 90.38 0c0 0 53.66 141.6 56.66 156.71l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28s3.28-52.72 5.05-64.11c0 0 26.73-97 52.77-142.23Z" transform="translate(-581.04 -57.08)"/>',
    '<path class="cls-6" d="M639.54 142.77s36.72-14.82 90.38 0c0 0-62.42 15.23-90.38 0Z" transform="translate(-581.04 -57.08)"/>'
    ));

    if(sips[id] == 1) {
      fluid = '<path class="cls-2" d="M622.5 180.5s53.34 14.18 123 0c0 0 38.08 103.87 41.08 119l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28s3.28-52.74 5.05-64.13c0 0 9.69-59.32 35.73-104.5Z" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M622.54 180.77s65.3-14.09 119 .73c-12.35 2-94.73 12.5-119-.73Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 2) {
      fluid = '<path class="cls-2" d="M610.5 209.5s76.34 14.18 146 0c0 0 27.08 74.87 30.08 90l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28s3.28-52.74 5.05-64.13c0 0 2.73-30.5 23.73-75.5Z" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M611.5 209.5s89.34-13.82 143 1c-6.16 1-116.88 13.18-143-1Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 3) {
      fluid = '<path class="cls-2" d="M601.5 233.5s92.34 14.18 162 0c0 0 20.08 50.87 23.08 66l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28s3.28-52.74 5.05-64.13c0 0 .73-5.5 14.73-51.5Z" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M601.5 234.5s108.34-14.82 162 0c-6.16 1-135.88 14.18-162 0Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 4) {
      fluid = '<path class="cls-2" d="M591.5 268.5s113 8 185-1c0 0 7.08 16.87 10.08 32l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28s3.28-52.74 5.05-64.13c2.8-8.59-4.36 14.5 4.73-16.5Z" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M591.5 268.5s129.34-15.82 183-1c-6.16 1-156.88 15.18-183 1Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 5) {
      fluid = '<path class="cls-2" d="M584.5 310.5s130 9 202 0c0 0-2.92-26.13.08-11l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M587.5 311.5s143.34-15.82 197-1c-6.16 1-170.88 15.18-197 1Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 6) {
      fluid = '<path class="cls-2" d="M581.5 353.5s133 13 205 4c0 0-2.92-73.13.08-58l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M584.5 354.5s143.34-15.82 197-1c-6.16 1-170.88 15.18-197 1Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 7) {
      fluid = '<path class="cls-2" d="M581.5 410.5s132 9 204 0c0 0-1.92-126.13 1.08-111l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M584.5 411.5s143.34-15.82 197-1c-6.16 1-170.88 15.18-197 1Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 8) {
      fluid = '<path class="cls-2" d="M582.5 463.5s129 8 201-1c0 0 .08-178.13 3.08-163l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28" transform="translate(-580.86 -57.08)"/><path class="cls-6" d="M582.5 463.5s143.34-15.82 197-1c-6.16 1-170.88 15.18-197 1Z" transform="translate(-580.86 -57.08)"/>';
    }
    if(sips[id] == 9) {
      fluid = '<path class="cls-2" d="M581.5 524.5s130 4 202-5c0 0 .08-235.13 3.08-220l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28" transform="translate(-580.86 -57.08)"/><path class="cls-6" d="M582.5 523.5s143.34-15.82 197-1c-6.16 1-170.88 15.18-197 1Z" transform="translate(-580.86 -57.08)"/>';
    }
    if(sips[id] == 10) {
      fluid = '<path class="cls-2" d="M582.5 576.5s127 5 199-4c0 0 2.08-288.13 5.08-273l-3.86 342.64s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-18.08 2.61-22-87.19l.14-256.28" transform="translate(-580.86 -57.08)"/><path class="cls-6" d="M582.5 576.5s143.34-15.82 197-1c-6.16 1-170.88 15.18-197 1Z" transform="translate(-580.86 -57.08)"/>';
    }
    if(sips[id] == 11) {
      fluid = '<path class="cls-2" d="M584.5 631.5s195-14.11 198 1l.22 9.62s2.54 47.62-43.3 63.54c0 0-111.84 5.92-135.84-13.08 0 0-19.08-2.08-19.08-61.08" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M584.5 631.5s99-21 197-1c-6.11-1.25-117 25-197 1Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 12) {
      fluid = '<path class="cls-2" d="M589.5,669.45S771,658.49,774,673.4h0s-3,19.74-35.79,31.74c0,0-110.94,5.84-134.75-12.91,0,0-10-3-14-22.78" transform="translate(-581.04 -57.08)"/><path class="cls-3" d="M591.5,670.5s87-19,185,1C770.39,670.25,671.5,694.5,591.5,670.5Z" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M591.5,670.5s87-19,185,1C770.39,670.25,671.5,694.5,591.5,670.5Z" transform="translate(-581.04 -57.08)"/>';
    }
    if(sips[id] == 13) {
      fluid = '<path class="cls-2" d="M786.58 299.48S677.66 312.32 604.12 301c0 0-6.32 50.34-5.93 60 0 0 52.39 15.55 188.39-3.9Z" transform="translate(-581.04 -57.08)"/><path class="cls-6" d="M598.19 360.94v196.45s44.6 25.81 185 0L786.58 357s-96.78 16.29-188.39 3.94Z" transform="translate(-581.04 -57.08)"/>';
    }

    string memory render = string(abi.encodePacked(
        '<defs>',
        '<style>.cls-1,.cls-7{fill:#fff}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6{stroke:#000;stroke-miterlimit:10}.cls-2{fill:#c97700}.cls-3,.cls-8{fill:#8a1300}.cls-4{fill:#ffdd74}.cls-5{fill:#bfa100}.cls-6{fill:#bf7600}.cls-7,.cls-9{font-size:31.38px;letter-spacing:.02em;font-family:Arial-Black,Arial Black;font-weight:800}.cls-9{font-size:78px;fill:#ffede9;letter-spacing:.01em}</style>',
        '</defs>',
        '<path class="cls-1" d="M581.58 578.58s-2 109 22 114c0 0 0 13.16 80 13.08h55.84s24.16-9.08 31.16-22.08c0 0 9.28-14.92 12.14-41.46v-63.54l3.86-176v-103.1s-45.8-149.64-76.24-193.67a57.55 57.55 0 0 0-5.76-7.23c-24.75-25.57-39-8.94-43.2-2.34a22.37 22.37 0 0 0-1.38 2.34s-76.46 158-74.46 200c0 0-4.08 37.91-4 58.45Z" transform="translate(-581.04 -57.08)"/>',
        fluid,
        '<path class="cls-4" d="M598.19 360.94v196.45s44.6 25.81 185 0L786.58 357s-96.78 16.29-188.39 3.94Z" transform="translate(-581.04 -57.08)"/>',
        '<path class="cls-3" d="M598.05 554.39s-1.39 36.45 0 50.32c0 0 52.67 33.13 184.53 0l.46-50.32s-92.38 28.81-184.99 0Z" transform="translate(-581.04 -57.08)"/>',
        '<path class="cls-5" d="M652.58 61.58s-.13.3-.33.85c-1.3 3.57-5.73 17.85.33 32.38 0 0 20.87 11.22 59.93 0 0 0 8.2-27.23-3.87-33.23 0 0-19.06 11-56.06 0Z" transform="translate(-581.04 -57.08)"/>',
        '<path class="cls-5" d="M681.58 57.58s-31 1.74-26.48 4.34c0 0 31.61 9.55 55.54 0 0 0 4.94-2.6-29.06-4.34ZM650 71.5s13.57 8.08 47.57 3.08M650 85.7s7.57 6.12 47.57 0" transform="translate(-581.04 -57.08)"/>',
        '<path class="cls-3" d="M786.58 299.48S677.66 312.32 604.12 301c0 0-6.32 50.34-5.93 60 0 0 52.39 15.55 188.39-3.9Z" transform="translate(-581.04 -57.08)"/>',
        '<text class="cls-7" transform="matrix(1.1 -.08 .07 1 98.02 281.53)">40</text>',
        '<path class="cls-8" d="M704.53 397s-55.53-3-65 0c0 0-12.5 1-13.5 16 0 0-7 57.87 0 79.43 0 0-1 10.57 20 11.57 0 0 46 15 114-3 0 0 12-2 12-11v-86.86s1.45-7.81-13.27-7.47" transform="translate(-581.04 -57.08)"/>',
        unicode'<text class="cls-9" transform="rotate(-.94 25835.18 -3086.38)">OΞ</text>'
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
