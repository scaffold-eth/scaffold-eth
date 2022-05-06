pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import './LoogieShipMetadata.sol';
import './LoogieShipRender.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

abstract contract FancyLoogiesContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function hasNft(address nft, uint256 id) external virtual view returns (bool);
  function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external virtual;
}

abstract contract LoogieCoinContract {
  function mint(address to, uint256 amount) virtual public;
}

contract LoogieShip is ERC721Enumerable, IERC721Receiver {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  FancyLoogiesContract fancyLoogies;
  LoogieCoinContract loogieCoin;

  address bow;
  address mustache;
  address contactLenses;
  address eyelashes;

  address payable public constant recipient =
    payable(0x51f63a79D75206Fc3e1f29Caa58eb9B732F06f52);

  uint256 public constant limit = 1000;
  uint256 public price = 0.02 ether;

  mapping (uint256 => bytes3) public wheelColor;
  mapping (uint256 => bytes3) public mastheadColor;
  mapping (uint256 => bytes3) public flagColor;
  mapping (uint256 => bytes3) public flagAlternativeColor;
  mapping (uint256 => bool) public loogieMasthead;
  mapping (uint256 => bool) public loogieFlag;

  mapping(uint8 => mapping(uint256 => uint256)) public crewById;

  constructor(address _fancyLoogies, address _bow, address _mustache, address _contactLenses, address _eyelashes, address _loogieCoin) ERC721("LoogieShips", "LOOGIESHIP") {
    // RELEASE THE LOOGIE SHIPS!
    fancyLoogies = FancyLoogiesContract(_fancyLoogies);
    bow = _bow;
    mustache = _mustache;
    contactLenses = _contactLenses;
    eyelashes = _eyelashes;
    loogieCoin = LoogieCoinContract(_loogieCoin);
  }

  function mintItem()
      public
      payable
      returns (uint256)
  {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      loogieCoin.mint(msg.sender, 20000);

      bytes32 predictableRandom = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      wheelColor[id] = bytes2(predictableRandom[3]) | ( bytes2(predictableRandom[4]) >> 8 ) | ( bytes3(predictableRandom[5]) >> 16 );
      mastheadColor[id] = bytes2(predictableRandom[6]) | ( bytes2(predictableRandom[7]) >> 8 ) | ( bytes3(predictableRandom[8]) >> 16 );
      flagColor[id] = bytes2(predictableRandom[9]) | ( bytes2(predictableRandom[10]) >> 8 ) | ( bytes3(predictableRandom[11]) >> 16 );
      flagAlternativeColor[id] = bytes2(predictableRandom[12]) | ( bytes2(predictableRandom[13]) >> 8 ) | ( bytes3(predictableRandom[14]) >> 16 );

      loogieMasthead[id] = uint8(predictableRandom[15]) > 200;
      loogieFlag[id] = uint8(predictableRandom[16]) > 200;

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      return LoogieShipMetadata.tokenURI(id, wheelColor[id], mastheadColor[id], flagColor[id], flagAlternativeColor[id], loogieMasthead[id], loogieFlag[id], generateSVGofTokenById(id));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="450" height="350" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    require(_exists(id), "not exist");

    string memory render;

    render = string(abi.encodePacked(render, LoogieShipRender.renderDefs(wheelColor[id], mastheadColor[id], flagColor[id], flagAlternativeColor[id], loogieMasthead[id], loogieFlag[id])));

    render = string(abi.encodePacked(render, '<g id="loogie-ship">'));

    if (crewById[0][id] != 0) {
      render = string(abi.encodePacked(render, '<g id="captain" class="captain" transform="scale(0.3 0.3) translate(710 420)">', fancyLoogies.renderTokenById(crewById[0][id]), '</g>'));
    }

    if (crewById[2][id] != 0) {
      render = string(abi.encodePacked(render, '<g id="officer" class="officer" transform="scale(0.3 0.3) translate(405 520)">', fancyLoogies.renderTokenById(crewById[2][id]), '</g>'));
    }

    if (crewById[3][id] != 0) {
      render = string(abi.encodePacked(render, '<g id="seaman" class="seaman" transform="scale(0.3 0.3) translate(260 -20)">', fancyLoogies.renderTokenById(crewById[3][id]), '</g>'));
    }

    render = string(abi.encodePacked(render, LoogieShipRender.renderShip(wheelColor[id], mastheadColor[id], flagColor[id], flagAlternativeColor[id], loogieMasthead[id], loogieFlag[id])));

    if (crewById[1][id] != 0) {
      render = string(abi.encodePacked(render, '<g id="engineer" class="engineer" transform="scale(-0.3 0.3) translate(-990 770)">', fancyLoogies.renderTokenById(crewById[1][id]), '</g>'));
    }

    render = string(abi.encodePacked(render, '</g>'));

    return render;
  }

  function removeCrew(uint8 crew, uint256 id) external {
    require(msg.sender == ownerOf(id), "only the owner can remove a crew member!");

    require(crewById[crew][id] != 0, "the ship doesn't have this crew member!");
    fancyLoogies.transferFrom(address(this), ownerOf(id), crewById[crew][id]);
    crewById[crew][id] = 0;
  }

  // to receive ERC721 tokens
  function onERC721Received(
      address operator,
      address from,
      uint256 tokenId,
      bytes calldata data) external override returns (bytes4) {

      (uint256 shipId, uint8 crew) = abi.decode(data, (uint256,uint8));

      require(ownerOf(shipId) == from, "you can only add crew to a LoogieShip you own!");
      require(msg.sender == address(fancyLoogies), "only FancyLoogies can be part of the crew!");
      require(crew < 4, "only 4 crew members per ship!");
      require(crewById[crew][shipId] == 0, "the ship already have this crew member!");

      //Captain
      if (crew == 0) {
        require(fancyLoogies.hasNft(bow, tokenId), "the Captain must wear a Bow!");
      }

      //Engineer
      if (crew == 1) {
        require(fancyLoogies.hasNft(mustache, tokenId), "the Chief Engineer must wear a Mustache!");
      }

      //Officer
      if (crew == 2) {
        require(fancyLoogies.hasNft(contactLenses, tokenId), "the Deck Officer must wear a pair of Contact Lenses");
      }

      //Seaman
      if (crew == 3) {
        require(fancyLoogies.hasNft(eyelashes, tokenId), "the Seaman must wear Eyelashes");
      }

      crewById[crew][shipId] = tokenId;

      return this.onERC721Received.selector;
    }
}
