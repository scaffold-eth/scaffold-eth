pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import 'base64-sol/base64.sol';

import './SailorLoogiesGameAward1Render.sol';
import './SailorLoogiesGameAward2Render.sol';
import './SailorLoogiesGameAward3Render.sol';

contract SailorLoogiesGameAward is ERC721Enumerable, AccessControl {

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping (uint256 => uint8) public color;
  mapping (uint256 => uint8) public secondaryColor;
  mapping (uint256 => uint8) public rewardType;
  mapping (uint256 => uint256) public week;
  mapping (uint256 => uint256) public reward;

  string[8] colors = ["9d005d", "dd0aac", "39b54a", "059ca0", "f27e8b", "ffb93b", "ff4803", "c8a5db"];

  constructor() ERC721("SailorLoogiesGameAward", "SLG-AWARD") {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function mintItem(address owner, uint256 weekAward, uint256 rewardAward) public onlyRole(MINTER_ROLE) returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(owner, id);

      bytes32 predictableRandom = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = uint8(predictableRandom[0]) & uint8(7);
      secondaryColor[id] = uint8(predictableRandom[1]) & uint8(7);
      rewardType[id] = uint8(predictableRandom[2]);
      week[id] = weekAward;
      reward[id] = rewardAward;

      return id;
  }

  function tokenURI(uint id) public view override returns (string memory) {
    require(_exists(id), "not exist");

    return
      string(
          abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(
                bytes(
                      abi.encodePacked(
                          '{"name":"SailorLoogies Game Award #',id.toString(),
                          '", "description":"SailorLoogies Game Award - Week #',week[id].toString(),
                          '", "external_url":"https://sailor.fancyloogies.com/award/',
                          id.toString(),
                          '", "attributes": [{"trait_type": "Color", "value": "#',
                          colors[color[id]],
                          '"},{"trait_type": "Secondary Color", "value": "#',
                          colors[secondaryColor[id]],
                          '"},{"trait_type": "Reward Type", "value": "',
                          rewardTypeName(id),
                          '"},{"trait_type": "Week", "value": ',
                          week[id].toString(),
                          '},{"trait_type": "Reward", "value": ',
                          reward[id].toString(),
                          '}], "image": "',
                          'data:image/svg+xml;base64,',
                          Base64.encode(bytes(generateSVGofTokenById(id))),
                          '"}'
                      )
                    )
                )
          )
      );
  }

  function rewardTypeName(uint256 id) public view returns (string memory) {
    if (rewardType[id] < 128) {
      return 'Fish';
    }

    if (rewardType[id] > 224) {
      return 'Lobster';
    }

    return 'Swordfish';
  }

  function width(uint256 id) public view returns (string memory) {
    if (rewardType[id] < 128) {
      return '937';
    }

    if (rewardType[id] > 224) {
      return '983';
    }

    return '1245';
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="',width(id),'" height="715" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    require(_exists(id), "not exist");

    if (rewardType[id] < 128) {
      return SailorLoogiesGameAward1Render.renderAward(colors[color[id]], colors[secondaryColor[id]], week[id].toString(), reward[id].toString());
    }

    if (rewardType[id] > 224) {
      return SailorLoogiesGameAward3Render.renderAward(colors[color[id]], colors[secondaryColor[id]], week[id].toString(), reward[id].toString());
    }

    return SailorLoogiesGameAward2Render.renderAward(colors[color[id]], colors[secondaryColor[id]], week[id].toString(), reward[id].toString());
  }
}