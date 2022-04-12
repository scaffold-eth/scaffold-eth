//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

abstract contract LoogieShipContract {
  function ownerOf(uint256 id) external virtual view returns (address);
  mapping(uint8 => mapping(uint256 => uint256)) public crewById;
  uint256 public totalSupply;
}

abstract contract LoogieCoinContract {
  function balanceOf(address account) public view virtual returns (uint256);
  function mint(address to, uint256 amount) virtual public;
  function burn(address from, uint256 amount) virtual public;
}

abstract contract LoogieNftContract {
  function color(uint256 id) external virtual view returns (bytes3);
}

abstract contract FancyLoogieContract {
  function nftId(address nft, uint256 id) external virtual view returns (uint256);
}

abstract contract SailorLoogiesGameAwardContract {
  function mintItem(address owner, uint256 weekAward, uint256 rewardAward) virtual public returns (uint256);
}

contract SailorLoogiesGame {

  LoogieShipContract public loogieShip;
  LoogieCoinContract public loogieCoin;
  FancyLoogieContract public fancyLoogies;
  SailorLoogiesGameAwardContract public sailorLoogiesGameAward;
  mapping (uint8 => address) public fancyLoogiesNftAddresses;
  uint256 public startTimestamp;
  // shipId -> day -> played
  mapping(uint256 => mapping(uint256 => bool)) public played;
  // shipId -> day -> reward
  mapping(uint256 => mapping(uint256 => uint256)) public rewards;
  // week -> withdraw
  mapping(uint256 => bool) public withdraws;

  event Fishing(uint256 indexed id, uint256 indexed week, uint256 indexed day, uint256 reward, address owner);
  event Withdraw(address indexed winner, uint256 indexed shipId, uint256 indexed week, uint256 rewardNftId);

  constructor(uint256 _startTimestamp, address _loogieShip, address _loogieCoin, address _fancyLoogies, address _bow, address _mustache, address _contactLenses, address _eyelashes, address _sailorLoogiesGameAward) {
    loogieShip = LoogieShipContract(_loogieShip);
    loogieCoin = LoogieCoinContract(_loogieCoin);
    fancyLoogies = FancyLoogieContract(_fancyLoogies);
    sailorLoogiesGameAward = SailorLoogiesGameAwardContract(_sailorLoogiesGameAward);
    fancyLoogiesNftAddresses[0] = _bow;
    fancyLoogiesNftAddresses[1] = _mustache;
    fancyLoogiesNftAddresses[2] = _contactLenses;
    fancyLoogiesNftAddresses[3] = _eyelashes;
    startTimestamp = _startTimestamp;
  }

  function crewReady(uint256 id) public view returns (bool) {
    return loogieShip.crewById(0, id) > 0 && loogieShip.crewById(1, id) > 0 && loogieShip.crewById(2, id) > 0 && loogieShip.crewById(3, id) > 0;
  }

  function sendFishing(uint256 id) public returns (uint256) {
    address shipOwner = loogieShip.ownerOf(id);

    require(msg.sender == shipOwner, "only the ship owner can send the ship to fishing!");
    require(loogieCoin.balanceOf(shipOwner) >= 3000, "you need 3000 LoogieCoins to send a ship to fishing!");

    // change to days
    uint256 diffHours = (block.timestamp - startTimestamp) / 60;

    require(!played[id][diffHours], "already played today!");

    played[id][diffHours] = true;

    loogieCoin.burn(shipOwner, 3000);

    uint256 reward = _calculateReward(id);

    rewards[id][diffHours] = reward;

    loogieCoin.mint(shipOwner, reward);

    emit Fishing(id, diffHours / 7 + 1, diffHours, reward, shipOwner);

    return reward;
  }

  function withdrawReward(uint256 week) public returns (uint256) {
    require(!withdraws[week], "already withdrawn!");

    // change to days
    uint256 diffHours = (block.timestamp - startTimestamp) / 60;

    require(week * 7 <= diffHours, "week is not finished yet!");

    uint256 shipId = winnerByWeek(week);

    require(shipId > 0, "nobody wins that week!");

    address winner = loogieShip.ownerOf(shipId);

    require(winner == msg.sender, "you don't win that week!");

    withdraws[week] = true;

    uint256 shipReward = rewardByShipAndWeek(shipId, week);

    uint256 rewardNftId = sailorLoogiesGameAward.mintItem(winner, week, shipReward);

    emit Withdraw(winner, shipId, week, rewardNftId);

    return rewardNftId;
  }

  function rewardByShipAndWeek(uint256 shipId, uint256 week) public view returns (uint256) {
    // week 1, is from day 0 to 6, week 2, 7 to 13, and so on
    // week n, is from day (n-1)*7

    uint256 shipRewards;
    for (uint256 j = (week - 1) * 7; j < week * 7; j++) {
      shipRewards = shipRewards + rewards[shipId][j];
    }

    return shipRewards;
  }

  function winnerByWeek(uint256 week) public view returns (uint256) {
    require(week * 7 <= diffHours, "week is not finished yet!");

    // week 1, is from day 0 to 6, week 2, 7 to 13, and so on
    // week n, is from day (n-1)*7

    uint256 maxReward;
    uint256 winnerId;

    for (uint256 i = 1; i <= loogieShip.totalSupply(); i++) {
      uint256 rewardsForI;
      for (uint256 j = (week - 1) * 7; j < week * 7; j++) {
        rewardsForI = rewardsForI + rewards[i][j];
      }
      if (rewardsForI > maxReward) {
        winnerId = i;
        maxReward = rewardsForI;
      }
    }

    return winnerId;
  }

  function _calculateReward(uint256 id) internal view returns (uint256) {
    uint256 colorUint;

    for (uint8 i = 0; i < 4; i++) {

      // get related nftId for the FancyLoogie
      uint256 nftId = fancyLoogies.nftId(fancyLoogiesNftAddresses[i], loogieShip.crewById(i, id));
      bytes3 nftColor = LoogieNftContract(fancyLoogiesNftAddresses[i]).color(nftId);

      colorUint = colorUint + _colorToUint256(nftColor);
    }

    console.log("colorUint: ", colorUint);

    uint256 mod;

    if (colorUint == 0) {
      mod = 0;
    } else {
      mod = block.number % colorUint;
    }
    // colorUint and mod go from 0 to 3060

    console.log("blockNumber: ", block.number);
    console.log("mod: ", mod);

    uint256 random;

    bytes32 predictableRandom = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

    for(uint i=0;i<21;i++){
      random = random + uint8(predictableRandom[i]);
    }
    // random go from 0 to 5100

    console.log("random: ", random);

    uint256 reward = 8160 - (mod + random);

    console.log("reward: ", reward);

    console.log("block.timestamp: ", block.timestamp);

    uint256 diffSeconds = block.timestamp - startTimestamp;

    console.log("diffSeconds: ", diffSeconds);

    uint256 diffHours = diffSeconds / 60;

    console.log("diffHours: ", diffHours);

    return reward;
  }

  function _colorToUint256(bytes3 colorByte) internal pure returns (uint256) {
    uint256 tempUint;

    for(uint i=0;i<3;i++){
      tempUint = tempUint + uint8(colorByte[i]);
    }

    return tempUint;
  }
}
