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

contract Glasses is ERC721Enumerable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address payable public constant recipient =
    payable(0x8faC8383Bb69A8Ca43461AB99aE26834fd6D8DeC);

  uint256 public constant limit = 1000;
  uint256 public price = 0.005 ether;

  mapping (uint256 => bytes3) public color;

  constructor() ERC721("Roboto Glasses", "ROBOTOGLAS") {
    // RELEASE THE ROBOTO GLASSES!
  }

  function mintItem() public payable returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Roboto Glasses #',id.toString()));
      string memory description = string(abi.encodePacked('These Roboto Glasses are color #',color[id].toColor(),'!!!'));
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
                              '", "external_url":"https://www.roboto-nft.com/glasses/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "color", "value": "#',
                              color[id].toColor(),
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
      '<svg width="400" height="400" transform="translate(0,0) scale(1 1)" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<g transform="translate(-888, -734) scale(3 3)">',
        '<style type="text/css">',
          '.st10{fill:url(#XMLID_222_);stroke:#',color[id].toColor(),';stroke-miterlimit:10;}',
        '</style>',
        '<linearGradient id="XMLID_222_" gradientUnits="userSpaceOnUse" x1="377.8606" y1="307.8719" x2="352.5506" y2="307.8719">',
          '<stop  offset="0" style="stop-color:#FFFFFF;stop-opacity:0.3"/>',
          '<stop  offset="1" style="stop-color:#8DD4E0"/>',
        '</linearGradient>',
        '<path id="XMLID_39_" class="st10" d="M377.9,305.3v6.9h-9l-3.7-3.5l-3.7,3.5h-9v-6.9c0-1,0.8-1.8,1.8-1.8h21.7C377.1,303.5,377.9,304.3,377.9,305.3z"/>',
      '</g>'
    ));

    return render;
  }
}
