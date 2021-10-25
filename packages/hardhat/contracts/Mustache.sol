//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import "hardhat/console.sol";
import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Mustache is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Loogie Mustaches", "LOOGMUS") {
    // RELEASE THE LOOGIE MUSTACHES!
  }

  mapping (uint256 => bytes3) public color;

  function mintItem() public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie Mustache #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie Mustache is the color #',color[id].toColor(),'!!!'));
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
      '<svg width="400" height="400" transform="translate(150,-100) scale(4 4)" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    // mustache svg from https://www.svgrepo.com/svg/85048/mustache-shape with CCO Licence
    string memory render = string(abi.encodePacked(
      '<g class="mustache" transform="translate(140,195) scale(1.50 1.50)">',
          '<path fill="#',color[id].toColor(),'" d="M21.455,13.025c-0.604-3.065-5.861-4.881-7.083-2.583c-1.22-2.299-6.477-0.483-7.081,2.583C6.501,16.229,2.321,17.11,0,15.439c0,3.622,3.901,3.669,6.315,3.9c5.718-0.25,7.525-2.889,8.057-4.093c0.532,1.205,2.34,3.843,8.058,4.093c2.416-0.231,6.315-0.278,6.315-3.9C26.423,17.11,22.244,16.229,21.455,13.025z"/>',
        '</g>'
      ));

    return render;
  }
}
