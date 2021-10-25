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

contract Bow is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Loogie Bow", "LOOGTK") {
    // RELEASE THE LOOGIE BOW!
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
      string memory name = string(abi.encodePacked('Loogie Bow #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie Bow is the color #',color[id].toColor(),'!!!'));
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
      '<svg width="400" height="400" transform="translate(-30,-250) scale(4 4)" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    // bow svg from https://www.svgrepo.com/svg/203940/bow with CCO Licence
    string memory render = string(abi.encodePacked(
      '<g class="bow" transform="translate(180,235) scale(0.10 0.10)">',
          '<path fill="#',color[id].toColor(),'" d="M476.532,135.396c-12.584-7.796-29-7.356-46.248,1.228l-117.868,59.88c-10.048-9.7-23.728-14.452-38.816-14.452h-50.156c-15.204,0-28.992,4.828-39.064,14.652L66.1,137.256c-17.232-8.58-33.836-9.336-46.412-1.544C7.1,143.508,0,158.1,0,177.368v141.104c0,19.268,7.1,34.18,19.68,41.96c5.972,3.708,12.904,5.556,20.28,5.556c8.164,0,17.04-2.256,26.092-6.764l118.312-58.14c10.072,9.824,23.88,16.588,39.08,16.588H273.6c15.084,0,28.78-6.692,38.82-16.396l117.884,58.276c9.068,4.512,17.9,6.596,26.064,6.596c7.388,0,14.192-1.928,20.164-5.636C489.108,352.72,496,337.744,496,318.476V177.368C496,158.1,489.108,143.192,476.532,135.396z"/>',
        '</g>'
      ));

    return render;
  }
}
