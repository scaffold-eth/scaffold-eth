pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
import "hardhat/console.sol";
import './ToColor.sol';

abstract contract LoogiesContract {
  mapping(uint256 => bytes32) public genes;
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external virtual;
}

contract LoogieTank is ERC721Enumerable, IERC721Receiver {

  using Strings for uint256;
  using Strings for uint8;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  using ToColor for bytes3;

  Counters.Counter private _tokenIds;

  LoogiesContract loogies;
  mapping(uint256 => uint256[]) loogiesById;
  mapping (uint256 => bytes3) public color;

  constructor(address _loogies) ERC721("Loogie Tank", "LOOGTANK") {
    loogies = LoogiesContract(_loogies);
  }

  function mintItem() public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );

      return id;
  }

  function returnAllLoogies(uint256 _id) external {
    require(msg.sender == ownerOf(_id), "only tank owner can return the loogies");
    for (uint256 i = 0; i < loogiesById[_id].length; i++) {
      loogies.transferFrom(address(this), ownerOf(_id), loogiesById[_id][i]);
    }

    delete loogiesById[_id];
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
      ));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="270" height="270" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
       '<rect x="0" y="0" width="400" height="400" stroke="black" fill="#', color[id].toColor(), '" stroke-width="5"/>',
       renderLoogies(id)
    ));

    return render;
  }

  function renderLoogies(uint256 _id) internal view returns (string memory) {
    string memory loogieSVG = "";

    for (uint8 i = 0; i < loogiesById[_id].length; i++) {
      uint16 blocksTraveled = uint16((block.number-blockAdded[loogiesById[_id][i]])%256);
      uint8 newX;
      uint8 endX;
      uint8 newY;
      uint8 endY;

      (newX, endX) = newPos(
        // speed in x direction
        int8(uint8(loogies.genes(loogiesById[_id][i])[0])),
        blocksTraveled,
        x[loogiesById[_id][i]]);

      (newY, endY) = newPos(
        // speed in y direction
        int8(uint8(loogies.genes(loogiesById[_id][i])[1])),
        blocksTraveled,
        y[loogiesById[_id][i]]);

      loogieSVG = string(abi.encodePacked(
        loogieSVG,
        '<g>',
        '<animateTransform attributeName="transform" dur="15s" fill="freeze" type="translate" additive="sum" ',
        'values="', newX.toString(), ' ', newY.toString(), ';', endX.toString(), ' ', endY.toString(),'"/>',
        '<animateTransform attributeName="transform" type="scale" additive="sum" values="0.3 0.3"/>',
        loogies.renderTokenById(loogiesById[_id][i]),
        '</g>'));
    }

    return loogieSVG;
  }

  function newPos(int8 speed, uint16 blocksTraveled, uint8 initPos) internal pure returns (uint8, uint8) {
      uint16 traveled;
      uint16 start;
      uint16 end;

      if (speed >= 0) {
        // console.log("speed", uint8(speed).toString());
        traveled = uint16((blocksTraveled * uint8(speed)) % 256);
        start = (initPos + traveled) % 256;
        end = (start + uint8(speed)) % 256;
        // console.log("start", start.toString());
        // console.log("end", end.toString());
        return (uint8(start), uint8(end));
      } else {
        // console.log("speed", uint8(-speed).toString());
        traveled = uint16((blocksTraveled * uint8(-speed)) % 256);
        start = (255 - traveled + initPos)%256;

        if (start >= uint8(-speed)) {
          end = start - uint8(-speed);
        } else {
          end = start + 255  - uint8(-speed);
        }
        // console.log("start", start.toString());
        // console.log("end", end.toString());
        return (uint8(start), uint8(end));
      }
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

  mapping(uint256 => uint8) x;
  mapping(uint256 => uint8) y;

  mapping(uint256 => uint256) blockAdded;

  // to receive ERC721 tokens
  function onERC721Received(
      address operator,
      address from,
      uint256 loogieTokenId,
      bytes calldata tankIdData) external override returns (bytes4) {

      uint256 tankId = toUint256(tankIdData);
      require(ownerOf(tankId) == from, "you can only add loogies to a tank you own.");

      loogiesById[tankId].push(loogieTokenId);

      bytes32 randish = keccak256(abi.encodePacked( blockhash(block.number-1), from, address(this), loogieTokenId, tankIdData  ));
      x[loogieTokenId] = uint8(randish[0]);
      y[loogieTokenId] = uint8(randish[1]);
      blockAdded[loogieTokenId] = block.number;

      return this.onERC721Received.selector;
    }
}
