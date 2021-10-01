pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';

abstract contract LoogiesContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function tokenOfOwnerByIndex(
    address _owner,
    uint256 _index
  )
    external
    virtual
    view
    returns (uint256);
  function balanceOf(address _addr) external virtual view returns (uint256);
}

contract LoogieTank is ERC721, IERC721Receiver {

  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;
  
  LoogiesContract loogies;
  mapping(uint256 => uint256[]) loogiesById;

  constructor(address _loogies) ERC721("Loogie Tank", "LOOGTANK") {
    loogies = LoogiesContract(_loogies);
  }

  function mintItem() public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie Tank #',id.toString()));
      string memory description = string(abi.encodePacked('Loogie Tank'));
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
       '<rect x="0" y="0" width="400" height="400" stroke="black" fill="#8FB9EB" stroke-width="5"/>',
       renderLoogies(id)
    ));

    return render;
  }

  function renderLoogies(uint256 _id) internal view returns (string memory) {
    string memory loogieSVG = "";
    
    for (uint256 i = 0; i < loogiesById[_id].length; i++) {
      loogieSVG = string(abi.encodePacked(
        loogieSVG, 
        '<g transform="translate(', (i+20).toString(), ' ', (i+20).toString(), ')">',
        loogies.renderTokenById(loogiesById[_id][i]),
        '</g>'));
    }

    return loogieSVG;
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
      uint256 loogieTokenId,
      bytes calldata data) external override returns (bytes4) {

      uint256 tokenId = toUint256(data);
      require(ownerOf(tokenId) == from, "you can only add loogies to a tank you own.");

      loogiesById[tokenId].push(loogieTokenId);
    
      return this.onERC721Received.selector;
    }
}