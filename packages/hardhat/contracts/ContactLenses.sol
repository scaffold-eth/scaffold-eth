//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract ContactLenses is ERC721Enumerable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // all funds go to buidlguidl.eth
  address payable public constant recipient =
    payable(0xa81a6a910FeD20374361B35C451a4a44F86CeD46);

  uint256 public constant limit = 1000;
  uint256 public constant curve = 1002; // price increase 0,2% with each purchase
  uint256 public price = 0.001 ether;

  mapping (uint256 => bytes3) public color;
  mapping (uint256 => bool) public crazy;

  constructor() ERC721("Loogie Contact Lenses", "LOOGLEN") {
    // RELEASE THE LOOGIE CONTACT LENSES!
  }

  function mintItem() public payable returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      price = (price * curve) / 1000;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );
      crazy[id] = uint8(genes[3]) > 200;

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie Contact Lenses #',id.toString()));
      string memory crazyText = '';
      string memory crazyValue = 'false';
      if (crazy[id]) {
        crazyText = ' and it is crazy';
        crazyValue = 'true';
      }
      string memory description = string(abi.encodePacked('This Loogie Contact Lenses is the color #',color[id].toColor(),crazyText,'!!!'));
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
                              color[id].toColor(),
                              '"},{"trait_type": "crazy", "value": ',
                              crazyValue,
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
      '<svg width="400" height="400" transform="translate(30,100) scale(4 4)" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory animate = '';
    if (crazy[id]) {
      animate =
          "<animate attributeName='rx' dur='6s' begin='0s' values='2.5; 3.5; 4.5; 6; 4.5; 3.5; 2.5' repeatCount='indefinite' />\
          <animate attributeName='ry' dur='6s' begin='0s' values='2.5; 3.5; 4.5; 6; 4.5; 3.5; 2.5' repeatCount='indefinite' />";
    }
    string memory render = string(abi.encodePacked(
      '<g id="eye1">',
        '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#',color[id].toColor(),'" fill="#',color[id].toColor(),'">',
          animate,
        '</ellipse>',
      '</g>',
      '<g id="eye2">',
        '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#',color[id].toColor(),'" stroke="#',color[id].toColor(),'">',
          animate,
        '</ellipse>',
      '</g>'
      ));

    return render;
  }
}
