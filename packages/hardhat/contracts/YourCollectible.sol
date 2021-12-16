pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;
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

/*
_____________________    _____  _________________________  .____       _________
\_   _____/\______   \  /  _  \ \_   ___ \__    ___/  _  \ |    |     /   _____/
 |    __)   |       _/ /  /_\  \/    \  \/ |    | /  /_\  \|    |     \_____  \ 
 |     \    |    |   \/    |    \     \____|    |/    |    \    |___  /        \
 \___  /    |____|_  /\____|__  /\______  /|____|\____|__  /_______ \/_______  /
     \/            \/         \/        \/               \/        \/        \/ 

AN SVG NFT PROJECT BY @blind_nabler built with scaffold-eth!
*/


contract YourCollectible is ERC721, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address public constant blindnabler = 0x807a1752402D21400D555e1CD7f175566088b955;

  constructor() public ERC721("On Chain Fractals", "FRAC") {
    // RELEASE THE LOOGIES!
  }

  mapping (uint256 => bytes3) public color1;
  mapping (uint256 => bytes3) public color2;
  mapping (uint256 => bytes3) public color3;
  mapping (uint256 => bytes3) public color4;
  mapping (uint256 => uint256) public chubbiness;
  mapping (uint256 => uint256) public maxdepth;

  uint256 maxSupply = 1000;
  uint256 price = 0.0420 ether;

  function mintItem()
      public
      payable
      returns (uint256)
  {
      require( msg.value >= price, 'Price not correct');
      require( _tokenIds.current() <= maxSupply, 'Max supply reached');
      (bool success,) = blindnabler.call{value:msg.value}("");
      require( success, "could not send");
      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this), id ));
      bytes32 predictableRandom2 = keccak256(abi.encodePacked(predictableRandom));
      bytes32 predictableRandom3 = keccak256(abi.encodePacked(predictableRandom2));
      bytes32 predictableRandom4 = keccak256(abi.encodePacked(predictableRandom3));
      color1[id] = bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes3(predictableRandom[2]) >> 16 );
      color2[id] = bytes2(predictableRandom2[0]) | ( bytes2(predictableRandom2[1]) >> 8 ) | ( bytes3(predictableRandom2[2]) >> 16 );
      color3[id] = bytes2(predictableRandom3[0]) | ( bytes2(predictableRandom3[1]) >> 8 ) | ( bytes3(predictableRandom3[2]) >> 16 );
      color4[id] = bytes2(predictableRandom4[0]) | ( bytes2(predictableRandom4[1]) >> 8 ) | ( bytes3(predictableRandom4[2]) >> 16 );
      chubbiness[id] = 80+((55*uint256(uint8(predictableRandom[3])))/255);
      maxdepth[id] = (chubbiness[id] % 4) + 4;
      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Fractal #',id.toString()));
      string memory description = string(abi.encodePacked('This fractal is the color #',color1[id].toColor(),', #',color2[id].toColor(),', and recursion depth of ',maxdepth[id].toString(),'!!!'));
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
                              '", "attributes": [{"trait_type": "color1", "value": "#',
                              color1[id].toColor(),
                              '"},{"trait_type": "color2", "value": "#',
                              color2[id].toColor(),
                              '"},{"trait_type": "baselength", "value": ',
                              chubbiness[id].toString(),
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

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {
    string memory svg = string(abi.encodePacked(
      '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
                '<defs><linearGradient id="a" x1="0" x2="0" y1="0" y2="1"><stop offset="0"  stop-color="#',color3[id].toColor(),'"/><stop offset="1"  stop-color="#',color4[id].toColor(),'"/></linearGradient></defs><pattern id="b"  width="24" height="24" patternUnits="userSpaceOnUse"><circle  fill="#ffffff" cx="12" cy="12" r="12"/></pattern><rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#b)" fill-opacity="0.1"/>',
                renderTokenById(id),
      '</svg>'
    ));
    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) { 
    uint baselength = chubbiness[id];
    string memory _color1 = color1[id].toColor();
    string memory _color2 = color2[id].toColor();
    uint _maxdepth = maxdepth[id];
    string memory render = fractal("",250,500,baselength,0, _maxdepth, _color1, _color2);
    return render;
  }

  function fork(uint256 Ax, uint256 Ay, uint256 baselength) public pure returns (string[6] memory) {
        uint256 Bx = Ax - baselength;
        uint256 By = Ay - (baselength * 2);
        uint256 Cx = Ax + baselength;
        //output array returns as such (Ax, Ay, Bx, By, Cx, Cy)
        return[Ax.toString(), Ay.toString(), Bx.toString(), By.toString(), Cx.toString(), By.toString()];
  }

  function fractal(string memory input, uint x, uint y, uint baselength, uint depth, uint _maxdepth, string memory _color1, string memory _color2) public view returns (string memory) {
    if(depth == _maxdepth){return input;}
    input = string(abi.encodePacked(drawFork(x,y,baselength, _color1, _color2)));
    uint x1 = x - baselength;
    uint x2 = x + baselength;
    y = y - (baselength * 2);
    baselength = baselength / 2;
    string memory branch1 = string(abi.encodePacked(fractal(input, x1, y, baselength, depth+1, _maxdepth, _color1, _color2)));
    string memory branch2 = string(abi.encodePacked(fractal(input, x2, y, baselength, depth+1, _maxdepth, _color1, _color2)));
    return string(abi.encodePacked(input,branch1,branch2));
  }

  function drawFork(uint _x1, uint _y1, uint baselength, string memory _color1, string memory _color2) public pure returns (string memory) {
      string[6] memory coords = fork(_x1,_y1, baselength);
      return string(abi.encodePacked(
      '<g id="branch">',
          //A2B
          '<line x1="',coords[0],'" y1="',coords[1],'" x2="',coords[2],'" y2="',coords[3],'" stroke="#',_color1,'" stroke-width="2" />',
          //A2C
          '<line x1="',coords[0],'" y1="',coords[1],'" x2="',coords[4],'" y2="',coords[5],'" stroke="#',_color2,'" stroke-width="2" />',
        '</g>'
      ));
  }

}
