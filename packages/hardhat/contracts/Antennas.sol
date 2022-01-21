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

contract Antennas is ERC721Enumerable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address payable public constant recipient =
    payable(0x8faC8383Bb69A8Ca43461AB99aE26834fd6D8DeC);

  uint256 public constant limit = 1000;
  uint256 public price = 5 ether;

  mapping (uint256 => bytes3) public color;

  constructor() ERC721("Roboto Antennas", "ROBOTOANT") {
    // RELEASE THE ROBOTO ANTENNAS!
  }

  function contractURI() public pure returns (string memory) {
      return "https://www.roboto-svg.com/antennas-metadata.json";
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
      string memory name = string(abi.encodePacked('Roboto Antennas #',id.toString()));
      string memory description = string(abi.encodePacked('Roboto Antennas with color #',color[id].toColor(),'.'));
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
                              '", "external_url":"https://www.roboto-svg.com/antennas/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "Color", "value": "#',
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
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<g transform="translate(-658, -1000) scale(3 3)">',
        '<style>.st00{fill:#',color[id].toColor(),'}</style>',
        '<path id="XMLID_42_" class="st00" d="m251.5 348.7-.9.5-2.8-4.6h-3.4l2.2-2.4h-2.1l-1.2-1.9c-.1.1-.3.1-.5.1-1 0-1.8-.8-1.8-1.8s.8-1.9 1.8-1.9 1.8.8 1.8 1.9c0 .5-.2.9-.5 1.3l.9 1.4h3.8l-2.2 2.4h1.6l3.3 5z"/><path id="XMLID_20_" class="st00" d="m254.9 348.7.9.5 2.8-4.6h3.4l-2.2-2.4h2.1l1.2-1.9c.1.1.3.1.5.1 1 0 1.8-.8 1.8-1.8s-.8-1.9-1.8-1.9-1.8.8-1.8 1.9c0 .5.2.9.5 1.3l-.9 1.4h-3.8l2.2 2.4H258l-3.1 5z"/>',
      '</g>'
    ));

    return render;
  }
}
