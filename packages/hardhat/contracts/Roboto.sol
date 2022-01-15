//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import './ToColor.sol';
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

  using ToColor for bytes3;
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
  uint256 public price = 0.01 ether;

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

  function mintItem() public payable returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      eyeColor[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );
      earColor[id] = bytes2(genes[3]) | ( bytes2(genes[4]) >> 8 ) | ( bytes3(genes[5]) >> 16 );
      gold[id] = uint8(genes[6]) > 100;
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

    if (block.number > (batteryRecharged[id] + 10)) {
      return 0;
    }

    return (batteryRecharged[id] + 10 - block.number);
  }

  function nftId(address nft, uint256 id) external view returns (uint256) {
    require(_exists(id), "not exist");
    //require(nftContractsAvailables[nft], "the loogies can't wear this NFT");

    return nftById[nft][id];
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      return RobotoMetadata.tokenURI(id, ownerOf(id), eyeColor[id], earColor[id], generateSVGofTokenById(id));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
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
//      '<g transform="translate(-720, -950) scale(3 3)"><g id="XMLID_2_"><linearGradient id="XMLID_8_" gradientUnits="userSpaceOnUse" x1="309.206" y1="369.756" x2="309.206" y2="398.476"><stop offset="0" style="stop-color:#eee"/><stop offset=".489" style="stop-color:#ececec"/><stop offset=".665" style="stop-color:#e5e5e5"/><stop offset=".79" style="stop-color:#dadada"/><stop offset=".892" style="stop-color:#c9c9c9"/><stop offset=".978" style="stop-color:#b3b3b3"/><stop offset="1" style="stop-color:#acacac"/></linearGradient><path id="XMLID_36_" d="M324.7 373.3v17.6c0 1.8-1.5 3.3-3.3 3.3h-7.5c-.1 2.4-2.1 4.3-4.5 4.3s-4.4-1.9-4.5-4.3h-7.7c-1.8 0-3.3-1.5-3.3-3.3v-17.6c0-2 1.6-3.5 3.5-3.5h23.9c1.9 0 3.4 1.6 3.4 3.5z" style="fill:url(#XMLID_8_)"/></g><g id="XMLID_1_"><path id="XMLID_29_" class="st1" d="M293 376.4c1 0 1.8.8 1.8 1.8v5.6c0 1-.8 1.8-1.8 1.8" fill="red" /><linearGradient id="XMLID_16_" gradientUnits="userSpaceOnUse" x1="293.014" y1="412.943" x2="295.364" y2="412.943" gradientTransform="matrix(1 0 0 -1 0 794)"><stop offset=".263" style="stop-color:#fff"/><stop offset="1" style="stop-color:#acacac"/></linearGradient><path id="XMLID_22_" d="M293 375.9c1.3 0 2.4 1 2.4 2.4v5.6c0 1.3-1 2.4-2.4 2.4m0-1.2c.7 0 1.2-.5 1.2-1.2v-5.6c0-.7-.5-1.2-1.2-1.2" style="fill:url(#XMLID_16_)"/></g><g id="XMLID_5_"><path id="XMLID_21_" class="st1" d="M325.3 385.7c-1 0-1.8-.8-1.8-1.8v-5.6c0-1 .8-1.8 1.8-1.8"  fill="red" /><linearGradient id="XMLID_20_" gradientUnits="userSpaceOnUse" x1="33.662" y1="649.552" x2="36.012" y2="649.552" gradientTransform="matrix(-1 0 0 1 359 -268.495)"><stop offset=".269" style="stop-color:#fff"/><stop offset="1" style="stop-color:#acacac"/></linearGradient><path id="XMLID_18_" d="M325.3 386.2c-1.3 0-2.4-1-2.4-2.4v-5.6c0-1.3 1-2.4 2.4-2.4m0 1.2c-.7 0-1.2.5-1.2 1.2v5.6c0 .7.5 1.2 1.2 1.2" style="fill:url(#XMLID_20_)"/></g><g id="XMLID_24_"><path id="XMLID_15_" style="fill:#848383" d="M303.4 387.8H315v1h-11.6z"/></g><circle id="XMLID_13_" class="st5" cx="314.9" cy="379.9" r="2.6" fill="blue" /><circle id="XMLID_27_" class="st5" cx="303.3" cy="379.9" r="2.6"  fill="blue"/><g id="XMLID_7_"><path id="XMLID_17_" d="M322.4 396.2h-25.5c-.4 0-.8.3-.8.8v10.5h27V397c0-.5-.3-.8-.7-.8z" style="fill:orange"/></g><g id="XMLID_6_"><path id="XMLID_35_" d="M319.9 405.4h-21c-.2 0-.4-.2-.4-.4v-6.2c0-.2.2-.4.4-.4h21c.2 0 .4.2.4.4v6.2c0 .2-.2.4-.4.4z" style="fill:#525252"/></g><g id="XMLID_32_" fill="green"><path id="XMLID_9_" class="st8" d="M327.9 396.8v10.7h-4.4v-10.7c0-.3.3-.6.6-.6h3.2c.3 0 .6.2.6.6z"/></g><g id="XMLID_30_" fill="green"><path id="XMLID_10_" class="st8" d="M295.7 396.7v10.8h-4.4v-10.8c0-.3.3-.6.6-.6h3.2c.4 0 .6.3.6.6z"/></g><g id="XMLID_4_"><path id="XMLID_14_" fill="red" class="st5" d="M299.6 399.4h17.3v5h-17.3z"/></g></g>'
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
      bytes calldata fancyIdData) external override returns (bytes4) {

      uint256 fancyId = _toUint256(fancyIdData);

      require(ownerOf(fancyId) == from, "you can only add stuff to a fancy loogie you own.");
      //require(nftContractsAvailables[msg.sender], "the loogies can't wear this NFT");
      //require(nftById[msg.sender][fancyId] == 0, "the loogie already has this NFT!");

      nftById[msg.sender][fancyId] = tokenId;

      return this.onERC721Received.selector;
    }
}
