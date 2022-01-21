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

contract Ears is ERC721Enumerable {

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

  constructor() ERC721("Roboto Ears", "ROBOTOEARS") {
    // RELEASE THE ROBOTO EARS!
  }

  function contractURI() public pure returns (string memory) {
      return "https://www.roboto-svg.com/ears-metadata.json";
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
      string memory name = string(abi.encodePacked('Roboto Ears #',id.toString()));
      string memory description = string(abi.encodePacked('Roboto Ears with color #',color[id].toColor(),'.'));
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
                              '", "external_url":"https://www.roboto-svg.com/ears/',
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
      '<g transform="translate(-601, -1265) scale(3 3)">',
        '<linearGradient id="a" gradientUnits="userSpaceOnUse" x1="220.464" y1="444.928" x2="211.179" y2="444.928"><stop offset="0" style="stop-color:#97999c"/><stop offset="1" style="stop-color:#',color[id].toColor(),'"/></linearGradient><path d="M220.5 453.2c0 .6-.6 1.1-1.1.9-1.4-.5-1.3-2-1.3-4V447h-2.2c-.5 0-1-.4-1.2-.9l-3.5-9.4c-.1-.4.2-.8.4-.9.2-.1.8.1.9.4l3.1 8.3h2.7c.2-.9.3-1.7.5-2.4.3-1 1.8-.8 1.8.2l-.1 10.9z" style="fill:url(#a)"/><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="357.885" y1="444.928" x2="348.599" y2="444.928" gradientTransform="matrix(-1 0 0 1 605.832 0)"><stop offset="0" style="stop-color:#97999c"/><stop offset="1" style="stop-color:#',color[id].toColor(),'"/></linearGradient><path d="M247.9 453.2c0 .6.6 1.1 1.1.9 1.4-.5 1.3-2 1.3-4V447h2.2c.5 0 1-.4 1.2-.9l3.4-9.4c.1-.4-.2-.8-.4-.9-.2-.1-.8.1-.9.4l-3.1 8.3H250c-.2-.9-.3-1.7-.5-2.4-.3-1-1.8-.8-1.8.2l.2 10.9z" style="fill:url(#b)"/>',
      '</g>'
    ));

    return render;
  }
}
