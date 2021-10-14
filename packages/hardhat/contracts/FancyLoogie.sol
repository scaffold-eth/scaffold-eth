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

abstract contract BowContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
}

abstract contract MustacheContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
}

abstract contract ContactLensesContract {
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

  BowContract bow;
  mapping(uint256 => uint256) bowById;

  MustacheContract mustache;
  mapping(uint256 => uint256) mustacheById;

  ContactLensesContract lenses;
  mapping(uint256 => uint256) lensesById;

  constructor(address _loogies, address _bow, address _mustache, address _lenses) ERC721("FancyLoogie", "FLOOG") {
    loogies = LoogiesContract(_loogies);
    bow = BowContract(_bow);
    mustache = MustacheContract(_mustache);
    lenses = ContactLensesContract(_lenses);
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
    string memory render;

    if (loogieById[id] > 0) {
      render = string(abi.encodePacked(render, loogies.renderTokenById(loogieById[id])));
    }

    if (bowById[id] > 0) {
      render = string(abi.encodePacked(render, bow.renderTokenById(bowById[id])));
    }

    if (mustacheById[id] > 0) {
      render = string(abi.encodePacked(render, mustache.renderTokenById(mustacheById[id])));
    }

    if (lensesById[id] > 0) {
      render = string(abi.encodePacked(render, lenses.renderTokenById(lensesById[id])));
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
      require(ownerOf(fancyId) == from, "you can only add stuff to a fancy loogie you own.");
      require(msg.sender == address(bow) || msg.sender == address(mustache) || msg.sender == address(lenses), "the loogies can wear only bow, mustache and contact lenses for now");

      if (msg.sender == address(bow)) {
        require(bowById[fancyId] == 0, "the loogie has a bow!");
        bowById[fancyId] = tokenId;
      }

      if (msg.sender == address(mustache)) {
        require(mustacheById[fancyId] == 0, "the loogie has a mustache!");
        mustacheById[fancyId] = tokenId;
      }

      if (msg.sender == address(lenses)) {
        require(lensesById[fancyId] == 0, "the loogie has contact lenses!");
        lensesById[fancyId] = tokenId;
      }

      return this.onERC721Received.selector;
    }
}
