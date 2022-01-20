pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
// import "hardhat/console.sol";


abstract contract LoogiesContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external virtual;
}

// in variable names, prefix "f" means they are related to fancy loogies.
contract LoogieTank is ERC721Enumerable, IERC721Receiver {

  using Strings for uint256;
  using Strings for uint8;
  using HexStrings for uint160;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  // all funds go to buidlguidl.eth
  // address payable public immutable recipient = payable(0xa81a6a910FeD20374361B35C451a4a44F86CeD46);
  address payable public immutable recipient;
  uint256 constant public price = 500000000000000; // 0.0005 eth
  LoogiesContract immutable loogies;
  LoogiesContract immutable floogies;
  mapping(uint256 => uint256[]) loogiesByTankId;
  mapping(uint256 => uint256[]) floogiesByTankId;

  constructor(address _loogies, address _floogies) ERC721("Loogie Tank", "LOOGTANK") {
    loogies = LoogiesContract(_loogies);
    floogies = LoogiesContract(_floogies);
    recipient = payable(msg.sender); // remove this for mainnet launch.
  }

  function mintItem() public payable returns (uint256) {
      require(msg.value >= price, "Sent eth not enough");

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      return id;
  }

  function returnAllLoogies(uint256 _id) external {
    require(msg.sender == ownerOf(_id), "only tank owner can return the loogies");
    for (uint256 i = 0; i < loogiesByTankId[_id].length; i++) {
      loogies.transferFrom(address(this), ownerOf(_id), loogiesByTankId[_id][i]);
    }
    for (uint256 i = 0; i < floogiesByTankId[_id].length; i++) {
      floogies.transferFrom(address(this), ownerOf(_id), floogiesByTankId[_id][i]);
    }

    delete loogiesByTankId[_id];
    delete floogiesByTankId[_id];
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "token doesn not exist");
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
      '<svg width="270" height="270" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
       '<rect x="0" y="0" width="270" height="270" stroke="black" fill="#8FB9EB" stroke-width="5"/>',
       // - (0.3, the scaling factor) * loogie head's (cx, cy).
       // Without this, the loogies move in rectangle translated towards bottom-right.
       '<g transform="translate(-60 -62)">',
       renderLoogies(id),
       renderfLoogies(id),
       '</g>'
    ));

    return render;
  }

  function renderLoogies(uint256 _id) internal view returns (string memory) {
    string memory loogieSVG = "";

    for (uint8 i = 0; i < loogiesByTankId[_id].length; i++) {
      uint8 blocksTraveled = uint8((block.number-blockAdded[loogiesByTankId[_id][i]])%256);
      uint8 newX;
      uint8 newY;

      newX = newPos(
        dx[loogiesByTankId[_id][i]],
        blocksTraveled,
        x[loogiesByTankId[_id][i]]);

      newY = newPos(
        dy[loogiesByTankId[_id][i]],
        blocksTraveled,
        y[loogiesByTankId[_id][i]]);

      loogieSVG = string(abi.encodePacked(
        loogieSVG,
        '<g>',
        '<animateTransform attributeName="transform" dur="1500s" fill="freeze" type="translate" additive="sum" ',
        'values="', newX.toString(), ' ', newY.toString(), ';'));

      for (uint8 j = 0; j < 100; j++) {
        newX = newPos(dx[loogiesByTankId[_id][i]], 1, newX);
        newY = newPos(dy[loogiesByTankId[_id][i]], 1, newY);

        loogieSVG = string(abi.encodePacked(
          loogieSVG,
          newX.toString(), ' ', newY.toString(), ';'));
      }

      loogieSVG = string(abi.encodePacked(
        loogieSVG,
        '"/>',
        '<animateTransform attributeName="transform" type="scale" additive="sum" values="0.3 0.3"/>',
        loogies.renderTokenById(loogiesByTankId[_id][i]),
        '</g>'));
    }

    return loogieSVG;
  }

  function renderfLoogies(uint256 _id) internal view returns (string memory) {
    string memory loogieSVG = "";

    for (uint8 i = 0; i < floogiesByTankId[_id].length; i++) {
      uint8 blocksTraveled = uint8((block.number-fblockAdded[floogiesByTankId[_id][i]])%256);
      uint8 newX;
      uint8 newY;

      newX = newPos(
        fdx[floogiesByTankId[_id][i]],
        blocksTraveled,
        fx[floogiesByTankId[_id][i]]);

      newY = newPos(
        fdy[floogiesByTankId[_id][i]],
        blocksTraveled,
        fy[floogiesByTankId[_id][i]]);

      loogieSVG = string(abi.encodePacked(
        loogieSVG,
        '<g>',
        '<animateTransform attributeName="transform" dur="1500s" fill="freeze" type="translate" additive="sum" ',
        'values="', newX.toString(), ' ', newY.toString(), ';'));

      for (uint8 j = 0; j < 100; j++) {
        newX = newPos(fdx[floogiesByTankId[_id][i]], 1, newX);
        newY = newPos(fdy[floogiesByTankId[_id][i]], 1, newY);

        loogieSVG = string(abi.encodePacked(
          loogieSVG,
          newX.toString(), ' ', newY.toString(), ';'));
      }

      loogieSVG = string(abi.encodePacked(
        loogieSVG,
        '"/>',
        '<animateTransform attributeName="transform" type="scale" additive="sum" values="0.3 0.3"/>',
        floogies.renderTokenById(floogiesByTankId[_id][i]),
        '</g>'));
    }

    return loogieSVG;
  }

  function newPos(int8 speed, uint8 blocksTraveled, uint8 initPos) internal pure returns (uint8) {
      uint8 traveled;
      uint8 start;

      if (speed >= 0) {
        unchecked {
          traveled = blocksTraveled * uint8(speed);
          start = initPos + traveled;
        }
        return start;
      } else {
        unchecked {
          traveled = blocksTraveled * uint8(-speed);
          start = initPos - traveled;
        }
        return start;
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

  function sendEthToRecipient() external {
    (bool success, ) = recipient.call{value: address(this).balance}("");
    require(success, "could not send ether");
  }

  mapping(uint256 => uint8) x;
  mapping(uint256 => uint8) y;
  mapping(uint256 => uint8) fx;
  mapping(uint256 => uint8) fy;

  mapping(uint256 => int8) dx;
  mapping(uint256 => int8) dy;
  mapping(uint256 => int8) fdx;
  mapping(uint256 => int8) fdy;

  mapping(uint256 => uint256) blockAdded;
  mapping(uint256 => uint256) fblockAdded;

  // to receive ERC721 tokens
  function onERC721Received(
      address operator,
      address from,
      uint256 loogieTokenId,
      bytes calldata tankIdData) external override returns (bytes4) {

      uint256 tankId = toUint256(tankIdData);
      require(ownerOf(tankId) == from, "you can only add loogies to a tank you own");

      if (msg.sender == address(loogies)) {
        require(loogiesByTankId[tankId].length < 256, "tank has reached the max limit of 255 loogies");
        bytes32 randish = keccak256(abi.encodePacked( blockhash(block.number-1), from, address(this), loogieTokenId, tankIdData  ));
        loogiesByTankId[tankId].push(loogieTokenId);

        x[loogieTokenId] = uint8(randish[0]);
        y[loogieTokenId] = uint8(randish[1]);
        dx[loogieTokenId] = int8(uint8(randish[2]));
        dy[loogieTokenId] = int8(uint8(randish[3]));
        blockAdded[loogieTokenId] = block.number;

      } else if (msg.sender == address(floogies)) {
        require(floogiesByTankId[tankId].length < 256, "tank has reached the max limit of 255 fancy loogies");
        bytes32 randish = keccak256(abi.encodePacked( blockhash(block.number-1), from, address(this), loogieTokenId, tankIdData  ));
        floogiesByTankId[tankId].push(loogieTokenId);

        fx[loogieTokenId] = uint8(randish[0]);
        fy[loogieTokenId] = uint8(randish[1]);
        fdx[loogieTokenId] = int8(uint8(randish[2]));
        fdy[loogieTokenId] = int8(uint8(randish[3]));
        fblockAdded[loogieTokenId] = block.number;
      } else {
        revert("only loogies can be added to the tank");
      }

      return this.onERC721Received.selector;
    }
}
