pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
// import "hardhat/console.sol";


interface SvgNftApi {
  function renderTokenById(uint256 id) external view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external;
}

contract LoogieTank is ERC721Enumerable, Ownable, ReentrancyGuard {

  using Strings for uint256;
  using Strings for uint8;
  using HexStrings for uint160;

  uint256 public _tokenIds;

  uint256 constant public price = 5000000000000000; // 0.005 eth
  // uint256 constant public price = 1; // 0.005 eth

  struct Component {
    uint256 blockAdded;
    uint256 id;   // token id of the ERC721 contract at `addr`
    address addr; // address of the ERC721 contract
    uint8 x;
    uint8 y;
    uint8 scale;
    int8 dx;
    int8 dy;
  }

  mapping(uint256 => Component[]) public componentByTankId;

  constructor() ERC721("Tank", "TANK") {
  }

  function mintItem() public payable nonReentrant returns (uint256) {
      require(msg.value >= price, "Sent eth not enough");

      _tokenIds++;
      _mint(_msgSender(), _tokenIds);

      return _tokenIds;
  }

  function returnAll(uint256 _id) external nonReentrant {
    require(_isApprovedOrOwner(_msgSender(), _id), "only tank owner or approved can return the NFTs");
    for (uint256 i = 0; i < componentByTankId[_id].length; i++) {
      // if transferFrom fails, it will ignore and continue
      try SvgNftApi(componentByTankId[_id][i].addr).transferFrom(address(this), ownerOf(_id), componentByTankId[_id][i].id) {}
      catch {}
    }

    delete componentByTankId[_id];
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "token doesn not exist");
      string memory _name = string(abi.encodePacked('Loogie Tank #',id.toString()));
      string memory description = string(abi.encodePacked('Loogie Tank'));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

      return string(abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name":"',
                    _name,
                    '", "description":"',
                    description, '",',
                    '"owner":"',
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
      '<svg width="310" height="310" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
       '<rect x="0" y="0" width="310" height="310" stroke="black" fill="#8FB9EB" stroke-width="5"/>',
        renderComponent(id)
    ));
    return render;
  }

  function renderComponent(uint256 _id) internal view returns (string memory) {
    string memory svg = "";

    for (uint8 i = 0; i < componentByTankId[_id].length; i++) {
      Component memory c = componentByTankId[_id][i];
      uint8 blocksTravelled = uint8((block.number - c.blockAdded)%256);
      uint8 newX;
      uint8 newY;

      newX = newPos(c.dx, blocksTravelled, c.x);
      newY = newPos(c.dy, blocksTravelled, c.y);

      svg = string(abi.encodePacked(
        svg,
        '<g>',
        '<animateTransform attributeName="transform" dur="1500s" fill="freeze" type="translate" additive="sum" ',
        'values="', newX.toString(), ' ', newY.toString(), ';'));

      for (uint8 j = 0; j < 100; j++) {
        newX = newPos(c.dx, 1, newX);
        newY = newPos(c.dy, 1, newY);

        svg = string(abi.encodePacked(
          svg,
          newX.toString(), ' ', newY.toString(), ';'));
      }

      uint8 scale = c.scale;
      string memory scaleString="";
      if (scale != 0) {
        scaleString = string(abi.encodePacked('values="0.',scale.toString(),' 0.', scale.toString(), '"'));
      }

      string memory _svg;
      try SvgNftApi(c.addr).renderTokenById(c.id) returns (string memory __svg) {
        _svg = __svg;
      } catch { return ""; }
      svg = string(abi.encodePacked(
        svg,
        '"/>',
        '<animateTransform attributeName="transform" type="scale" additive="sum" ', scaleString, '/>',
        _svg,
        '</g>'));
    }

    return svg;
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

  function senEthToOwner() external {
    (bool success, ) = owner().call{value: address(this).balance}("");
    require(success, "could not send ether");
  }

  function transferNFT(address nftAddr, uint256 tokenId, uint256 tankId, uint8 scale) external nonReentrant {
    ERC721 nft = ERC721(nftAddr);
    require(_isApprovedOrOwner(_msgSender(), tankId), "you need to own the tank");
    require(nftAddr != address(this), "nice try!");
    require(componentByTankId[tankId].length < 255, "tank has reached the max limit of 255 components");

    nft.transferFrom(_msgSender(), address(this), tokenId);
    require(nft.ownerOf(tokenId) == address(this), "NFT not transferred");

    bytes32 randish = keccak256(abi.encodePacked( blockhash(block.number-1), _msgSender(), address(this), tokenId, tankId  ));
    componentByTankId[tankId].push(Component(
      block.number,
      tokenId,
      nftAddr,
      uint8(randish[0]),
      uint8(randish[1]),
      scale,
      int8(uint8(randish[2])),
      int8(uint8(randish[3]))));
  }
}
