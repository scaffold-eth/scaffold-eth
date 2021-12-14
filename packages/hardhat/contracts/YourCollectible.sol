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

contract YourCollectible is ERC721, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("Loogies", "LOOG") {
    // RELEASE THE LOOGIES!
  }

  mapping (uint256 => bytes3) public color1;
  mapping (uint256 => bytes3) public color2;
  mapping (uint256 => uint256) public chubbiness;
  mapping (uint256 => uint256) public maxdepth;

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
      bytes32 predictableRandom2 = keccak256(abi.encodePacked(predictableRandom));
      color1[id] = bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes3(predictableRandom[2]) >> 16 );
      color2[id] = bytes2(predictableRandom2[0]) | ( bytes2(predictableRandom2[1]) >> 8 ) | ( bytes3(predictableRandom2[2]) >> 16 );
      chubbiness[id] = 80+((55*uint256(uint8(predictableRandom[3])))/255);
      maxdepth[id] = (chubbiness[id] % 4) + 4;
      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Fractal #',id.toString()));
      string memory description = string(abi.encodePacked('This fractal is the color #',color1[id].toColor(),' and #',color2[id].toColor(),' with a recursion depth of ',maxdepth[id].toString(),'!!!'));
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
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) { 
    uint baselength = chubbiness[id];
    string memory color1 = color1[id].toColor();
    string memory color2 = color2[id].toColor();
    uint maxdepth = maxdepth[id];
    string memory render = fractal("",250,500,baselength,0, maxdepth, color1, color2);
    return render;
  }

  function fork(uint256 Ax, uint256 Ay, uint256 baselength) public pure returns (string[6] memory) {
        uint256 Bx = Ax - baselength;
        uint256 By = Ay - baselength;
        uint256 Cx = Ax + baselength;
        //output array returns as such (Ax, Ay, Bx, By, Cx, Cy)
        return[Ax.toString(), Ay.toString(), Bx.toString(), By.toString(), Cx.toString(), By.toString()];
  }

  function fractal(string memory input, uint x, uint y, uint baselength, uint depth, uint maxdepth, string memory color1, string memory color2) public view returns (string memory) {
    if(depth == maxdepth){return input;}
    input = string(abi.encodePacked(drawFork(x,y,baselength, color1, color2)));
    uint x1 = x - baselength;
    uint x2 = x + baselength;
    y = y - baselength;
    baselength = baselength / 2;
    string memory branch1 = string(abi.encodePacked(fractal(input, x1, y, baselength, depth+1, maxdepth, color1, color2)));
    string memory branch2 = string(abi.encodePacked(fractal(input, x2, y, baselength, depth+1, maxdepth, color1, color2)));
    return string(abi.encodePacked(input,branch1,branch2));
  }

  function drawFork(uint _x1, uint _y1, uint baselength, string memory color1, string memory color2) public view returns (string memory) {
      string[6] memory coords = fork(_x1,_y1, baselength);
      return string(abi.encodePacked(
      '<g id="branch">',
          //A2B
          '<line x1="',coords[0],'" y1="',coords[1],'" x2="',coords[2],'" y2="',coords[3],'" stroke="#',color1,'" stroke-width="2" />',
          //A2C
          '<line x1="',coords[0],'" y1="',coords[1],'" x2="',coords[4],'" y2="',coords[5],'" stroke="#',color2,'" stroke-width="2" />',
        '</g>'
      ));
  }

}
