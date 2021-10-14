pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
import "hardhat/console.sol";


abstract contract LoogiesContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external virtual;
}

abstract contract TopKnotContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
}

contract FancyLoogie is ERC721Enumerable, IERC721Receiver {

  using Strings for uint256;
  using Strings for uint8;
  using HexStrings for uint160;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  LoogiesContract loogies;
  mapping(uint256 => uint256) loogieById;

  TopKnotContract topKnot;
  mapping(uint256 => uint256) topKnotById;

  constructor(address _loogies, address _topKnot) ERC721("FancyLoogie", "FLOOG") {
    loogies = LoogiesContract(_loogies);
    topKnot = TopKnotContract(_topKnot);
  }

  function mintItem(uint256 loogieId) public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      loogies.transferFrom(msg.sender, address(this), loogieId);

      loogieById[id] = loogieId;

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('FancyLoogie #',id.toString()));
      string memory description = string(abi.encodePacked('FancyLoogie'));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

      return string(abi.encodePacked(
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
                    '", "owner":"',
                    (uint160(ownerOf(id))).toHexString(20),
                    '", "image": "',
                    'data:image/svg+xml;base64,',
                    image,
                    '"}'
                )
            )
        )
      ));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
       '<rect x="0" y="0" width="400" height="400" stroke="black" fill="#8FB9EB" stroke-width="5"/>'
    ));

    if (loogieById[id] > 0) {
      render = string(abi.encodePacked(render, loogies.renderTokenById(loogieById[id])));
    }

    if (topKnotById[id] > 0) {
      render = string(abi.encodePacked(render, topKnot.renderTokenById(topKnotById[id])));
    }

    return render;
  }

  // https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
  function toUint256(bytes memory _bytes) internal pure returns (uint256) {
        require(_bytes.length >= 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
  }

  // to receive ERC721 tokens
  function onERC721Received(
      address operator,
      address from,
      uint256 tokenId,
      bytes calldata fancyIdData) external override returns (bytes4) {

      console.log("Received sender: ",msg.sender);

      uint256 fancyId = toUint256(fancyIdData);
      require(ownerOf(fancyId) == from, "you can only add loogies to a tank you own.");
      require(msg.sender == address(topKnot), "the loogies can wear only top knot for now");

      if (msg.sender == address(topKnot)) {
        topKnotById[fancyId] = tokenId;
      }

      return this.onERC721Received.selector;
    }
}
