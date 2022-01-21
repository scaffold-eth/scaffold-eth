//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import './RobotoMetadata.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

abstract contract NFTContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external virtual;
}

abstract contract BatteryContract {
  function transferFrom(address from, address to, uint256 amount) external virtual returns (bool) ;
}

contract Roboto is ERC721Enumerable, IERC721Receiver {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  BatteryContract batteryContract;
  NFTContract antennasContract;
  NFTContract earsContract;
  NFTContract glassesContract;
  mapping(address => mapping(uint256 => uint256)) nftById;

  address payable public constant recipient =
    payable(0x8faC8383Bb69A8Ca43461AB99aE26834fd6D8DeC);

  uint256 public constant limit = 1000;
  uint256 public price = 10 ether;

  mapping (uint256 => uint256) public batteryRecharged;

  mapping (uint256 => bytes3) public eyeColor;
  mapping (uint256 => bytes3) public earColor;
  mapping (uint256 => bool) public gold;

  constructor(address _battery, address _antennas, address _ears, address _glasses) ERC721("Roboto", "ROBOTO") {
    // RELEASE THE ROBOTOS!
    batteryContract = BatteryContract(_battery);
    antennasContract = NFTContract(_antennas);
    earsContract = NFTContract(_ears);
    glassesContract = NFTContract(_glasses);
  }

  function contractURI() public pure returns (string memory) {
      return "https://www.roboto-svg.com/roboto-metadata.json";
  }

  function mintItem() public payable returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      eyeColor[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );
      earColor[id] = bytes2(genes[3]) | ( bytes2(genes[4]) >> 8 ) | ( bytes3(genes[5]) >> 16 );
      gold[id] = uint8(genes[6]) > 200;
      batteryRecharged[id] = block.number;

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function recharge(uint256 id) public {
    batteryContract.transferFrom(msg.sender, address(this), 1);
    batteryRecharged[id] = block.number;
  }

  function batteryStatus(uint256 id) public view returns (uint256) {
    require(_exists(id), "not exist");

    // about 2 seconds block time, the battery last about 2 1/2 days
    if (block.number > (batteryRecharged[id] + 100000)) {
      return 0;
    }

    return (batteryRecharged[id] + 100000 - block.number);
  }

  function nftId(address nft, uint256 id) external view returns (uint256) {
    require(_exists(id), "not exist");

    return nftById[nft][id];
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      return RobotoMetadata.tokenURI(id, eyeColor[id], earColor[id], gold[id], generateSVGofTokenById(id));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  function renderRobotoById(uint256 id) public view returns (string memory) {
    return RobotoMetadata.renderRobotoById(eyeColor[id], earColor[id], gold[id], batteryStatus(id));
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {

    string memory render = '';

    if (nftById[address(antennasContract)][id] > 0) {
      render = string(abi.encodePacked(render, antennasContract.renderTokenById(nftById[address(antennasContract)][id])));
    }

    string memory robotRender = renderRobotoById(id);

    render = string(abi.encodePacked(
      render,
      robotRender
    ));

    if (nftById[address(earsContract)][id] > 0) {
      render = string(abi.encodePacked(render, earsContract.renderTokenById(nftById[address(earsContract)][id])));
    }

    if (nftById[address(glassesContract)][id] > 0) {
      render = string(abi.encodePacked(render, glassesContract.renderTokenById(nftById[address(glassesContract)][id])));
    }

    return render;
  }

  // https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
  function _toUint256(bytes memory _bytes) internal pure returns (uint256) {
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
      bytes calldata robotoIdData) external override returns (bytes4) {

      uint256 robotoId = _toUint256(robotoIdData);

      require(ownerOf(robotoId) == from, "you can only add stuff to a fancy loogie you own.");
      require(msg.sender == address(antennasContract) || msg.sender == address(earsContract) || msg.sender == address(glassesContract), "invalid accessory NFT");
      require(nftById[msg.sender][robotoId] == 0, "the roboto already has this kind of accessory!");

      nftById[msg.sender][robotoId] = tokenId;

      return this.onERC721Received.selector;
    }
}
