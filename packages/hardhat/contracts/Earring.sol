//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';

abstract contract LoogieCoinContract {
  function balanceOf(address account) public view virtual returns (uint256);
  function burn(address from, uint256 amount) virtual public;
}

contract Earring is ERC721Enumerable {

  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public price = 200000;
  uint256 public limit = 10;

  LoogieCoinContract public loogieCoin;

  address public fancyLoogiesAddress;

  mapping (uint256 => uint8) public color;

  string[8] colors = ["175ed1", "db240f", "16786C"];

  constructor(address _loogieCoin, address _fancyLoogiesAddress) ERC721("Loogie Earring", "LOOGEARRING") {
    loogieCoin = LoogieCoinContract(_loogieCoin);
    fancyLoogiesAddress = _fancyLoogiesAddress;
  }

  function mintItem() public returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(loogieCoin.balanceOf(msg.sender) >= price, "you need 200000 LoogieCoins!");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = uint8(genes[3]) % 3;

      loogieCoin.burn(msg.sender, price);

      return id;
  }

  function tokenURI(uint256 id) public override view returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie Earring #',id.toString()));
      string memory description = string(abi.encodePacked('Loogie Earring color #',colors[color[id]]));
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
                              '", "external_url":"https://earrings.fancyloogies.com/earrings/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "color", "value": "#',
                              colors[color[id]],
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
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    require(_exists(id), "not exist");

    // earrings svg from https://www.svgrepo.com/svg/250382/earrings-jewel with CCO Licence

    string memory render;

    if (msg.sender == fancyLoogiesAddress) {
      render = '<g class="earring" transform="translate(225,200) scale(0.1 0.1)">';
    } else {
      render  = '<g class="earring">';
    }

    render = string.concat(
      render,
        '<rect x="131.49" y="117.091" style="fill:#5A482E;" width="15.673" height="60.54"/>',
        '<path style="fill:#', colors[color[id]], ';" d="M139.329,512c38.111,0,71.236-27.209,80.555-66.171l-0.03-0.005c0.094-0.307,0.181-0.634,0.25-0.983  c1.469-6.508,2.231-20.1,2.273-22.076h0.004c0.741-52.511-29.738-106.898-79.544-141.938c-1.047-0.736-2.278-1.104-3.507-1.104  c-1.231,0-2.461,0.369-3.508,1.104c-49.805,35.04-80.285,89.428-79.545,141.939h0.002c0.043,1.953,0.808,15.532,2.264,22.037  c0,0,0.118,0.654,0.156,0.84c0.055,0.278,0.129,0.548,0.223,0.805C68.444,485.076,101.421,512,139.329,512z"/>',
        '<path style="fill:#EFBA50;" d="M161.793,230.129c0,12.242-10.058,22.166-22.464,22.166l0,0c-12.41,0-22.466-9.924-22.466-22.166l0,0  c0-12.243,10.056-22.168,22.466-22.168l0,0C151.735,207.962,161.793,217.886,161.793,230.129L161.793,230.129z"/>',
        '<path style="opacity:0.1;enable-background:new    ;" d="M139.22,230.129c0-8.222,4.548-15.383,11.286-19.209  c-3.294-1.871-7.104-2.958-11.177-2.958c-12.41,0-22.466,9.924-22.466,22.168c0,12.242,10.056,22.166,22.466,22.166  c4.073,0,7.884-1.087,11.177-2.958C143.769,245.511,139.22,238.352,139.22,230.129z"/>',
        '<path style="opacity:0.1;enable-background:new    ;" d="M80.92,444.803c-1.458-6.504-2.222-20.084-2.264-22.037h-0.003  c-0.7-49.751,26.635-101.172,71.863-136.242c-2.509-1.947-5.061-3.855-7.681-5.697c-1.047-0.736-2.278-1.104-3.507-1.104  c-1.231,0-2.461,0.369-3.508,1.104c-49.805,35.04-80.285,89.428-79.545,141.939h0.002c0.043,1.953,0.808,15.532,2.264,22.037  c0.1,0.553,0.184,1.114,0.378,1.644C68.444,485.076,101.421,512,139.329,512c3.786,0,7.52-0.28,11.19-0.804  c-33.067-4.702-60.646-29.976-69.219-64.751C81.204,446.19,80.92,444.803,80.92,444.803z"/>',
        '<path style="fill:#EFBA50;" d="M139.329,475.001c-20.476,0-38.56-15.339-43.976-37.299c-0.019-0.083-0.04-0.164-0.059-0.245  c-0.046-0.216-0.09-0.43-0.14-0.651c-0.556-2.68-1.252-11.355-1.389-14.859c-0.373-33.846,16.665-69.125,45.564-96.161  c28.892,27.026,45.932,62.308,45.558,96.16c-0.133,3.392-0.787,11.622-1.345,14.624c-0.167,0.639-0.315,1.284-0.447,1.926  C177.442,460.052,159.601,475.001,139.329,475.001z"/>',
        '<path style="opacity:0.1;enable-background:new    ;" d="M129.065,437.703c-0.02-0.083-0.04-0.164-0.06-0.245  c-0.046-0.216-0.091-0.43-0.141-0.651c-0.555-2.68-1.251-11.355-1.388-14.859c-0.295-26.607,10.178-54.098,28.71-77.776  c-5.043-6.443-10.676-12.605-16.855-18.386c-28.899,27.036-45.938,62.316-45.564,96.161c0.137,3.504,0.833,12.178,1.389,14.859  c0.05,0.22,0.094,0.435,0.14,0.651c0.019,0.08,0.04,0.162,0.059,0.245C100.77,459.662,118.854,475,139.33,475  c5.91,0,11.61-1.279,16.867-3.613C143.202,465.612,132.92,453.338,129.065,437.703z"/>',
        '<path style="fill:#', colors[color[id]], ';" d="M161.793,105.71c0,12.408-10.058,22.465-22.464,22.465l0,0c-12.41,0-22.466-10.057-22.466-22.465l0,0  c0-12.407,10.056-22.465,22.466-22.465l0,0C151.735,83.245,161.793,93.303,161.793,105.71L161.793,105.71z"/>',
        '<path style="opacity:0.1;enable-background:new    ;" d="M139.22,105.71c0-8.334,4.548-15.589,11.286-19.467  c-3.294-1.896-7.104-2.998-11.177-2.998c-12.41,0-22.466,10.058-22.466,22.465c0,12.408,10.056,22.465,22.466,22.465  c4.073,0,7.884-1.101,11.177-2.998C143.769,121.3,139.22,114.044,139.22,105.71z"/>',
        '<circle style="fill:#EFBA50;" cx="139.327" cy="45.15" r="45.15"/>',
        '<path style="fill:#FFFFFF;" d="M139.329,61.319c-8.914,0-16.167-7.253-16.167-16.167s7.252-16.167,16.167-16.167  c8.913,0,16.167,7.252,16.167,16.167C155.495,54.065,148.242,61.319,139.329,61.319z"/>',
        '<path style="fill:#37C4B3;" d="M171.212,286.956c0,2.96-2.421,5.382-5.382,5.382h-53.006c-2.961,0-5.383-2.422-5.383-5.382v-32.138  c0-2.96,2.422-5.383,5.383-5.383h53.006c2.961,0,5.382,2.423,5.382,5.383V286.956z"/>',
        '<path style="opacity:0.1;enable-background:new    ;" d="M140.836,286.956v-32.138c0-2.96,2.422-5.383,5.382-5.383h-33.394  c-2.961,0-5.383,2.423-5.383,5.383v32.138c0,2.96,2.422,5.382,5.383,5.382h33.394C143.258,292.338,140.836,289.916,140.836,286.956z  "/>',
        '<path style="fill:#36E3CC;" d="M161.793,188.657c0,12.242-10.058,22.166-22.464,22.166l0,0c-12.41,0-22.466-9.924-22.466-22.166l0,0  c0-12.244,10.056-22.168,22.466-22.168l0,0C151.735,166.49,161.793,176.413,161.793,188.657L161.793,188.657z"/>',
        '<path style="opacity:0.1;enable-background:new    ;" d="M139.22,188.657c0-8.222,4.548-15.383,11.286-19.21  c-3.294-1.87-7.104-2.957-11.177-2.957c-12.41,0-22.466,9.923-22.466,22.168c0,12.242,10.056,22.166,22.466,22.166  c4.073,0,7.884-1.088,11.177-2.958C143.769,204.038,139.22,196.879,139.22,188.657z"/>',
      '</g>'
    );

    return render;
  }
}
