//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

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
  mapping(uint256 => mapping(uint256 => uint8)) public played;
  // shipId -> day -> reward
  mapping(uint256 => mapping(uint256 => uint256)) public rewards;
  // shipId -> week -> reward
  mapping(uint256 => mapping(uint256 => uint256)) public rewardsByWeek;
  // week -> withdraw
  mapping(uint256 => bool) public withdraws;

  event Fishing(uint256 indexed id, uint256 indexed week, uint256 indexed day, uint256 reward, address owner, uint8 round);
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
    return loogieShip.crewById(0, id) > 0 || loogieShip.crewById(1, id) > 0 || loogieShip.crewById(2, id) > 0 || loogieShip.crewById(3, id) > 0;
  }

  function currentDay() public view returns (uint256) {
    return (block.timestamp - startTimestamp) / 86400;
  }

  function sendFishing(uint256 id) public returns (uint256) {
    address shipOwner = loogieShip.ownerOf(id);

    require(msg.sender == shipOwner, "only the ship owner can send the ship to fishing!");
    require(loogieCoin.balanceOf(shipOwner) >= 3000, "you need 3000 LoogieCoins to send a ship to fishing!");
    require(crewReady(id), "you need at least one crew member on your ship!");

    uint256 day = currentDay();

    require(played[id][day] < 3, "only 3 fishing per day!");

    played[id][day] += 1;

    loogieCoin.burn(shipOwner, 3000);

    uint256 reward = _calculateReward(id);
    rewards[id][day] += reward;

    uint256 currentWeek = (day / 7) + 1;
    rewardsByWeek[id][currentWeek] += reward;

    loogieCoin.mint(shipOwner, reward);

    emit Fishing(id, currentWeek, day, reward, shipOwner, played[id][day]);

    return reward;
  }

  function claimReward(uint256 week) public returns (uint256) {
    require(!withdraws[week], "already claimed!");

    uint256 day = currentDay();
    require(week * 7 <= day, "week is not finished yet!");

    uint256 shipId = winnerByWeek(week);
    require(shipId > 0, "nobody wins that week!");

    address winner = loogieShip.ownerOf(shipId);
    require(winner == msg.sender, "you don't win that week!");

    withdraws[week] = true;

    uint256 shipReward = rewardsByWeek[shipId][week];

    uint256 rewardNftId = sailorLoogiesGameAward.mintItem(winner, week, shipReward);

    emit Withdraw(winner, shipId, week, rewardNftId);

    return rewardNftId;
  }

  function winnerByWeek(uint256 week) public view returns (uint256) {
    uint256 day = currentDay();
    require(week * 7 <= day, "week is not finished yet!");

    uint256 maxReward;
    uint256 winnerId;

    for (uint256 i = 1; i <= loogieShip.totalSupply(); i++) {
      if (rewardsByWeek[i][week] > maxReward) {
        winnerId = i;
        maxReward = rewardsByWeek[i][week];
      }
    }

    return winnerId;
  }

  function _calculateReward(uint256 id) internal view returns (uint256) {
    uint256 colorUint;
    uint8 nfts;

    for (uint8 i = 0; i < 4; i++) {

      // get related nftId for the FancyLoogie
      uint256 nftId = fancyLoogies.nftId(fancyLoogiesNftAddresses[i], loogieShip.crewById(i, id));
      if (nftId > 0) {
        bytes3 nftColor = LoogieNftContract(fancyLoogiesNftAddresses[i]).color(nftId);
        colorUint = colorUint + _colorToUint256(nftColor);
        nfts += 1;
      }
    }

    uint256 mod;

    if (colorUint == 0) {
      mod = 0;
    } else {
      mod = block.number % colorUint;
    }
    // colorUint and mod go from 0 to 3060

    uint256 random;

    bytes32 predictableRandom = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

    for(uint i=0;i<32;i++){
      random = random + uint8(predictableRandom[i]);
    }
    // random go from 0 to 8160

    uint256 reward = random * nfts / 4 + 765 * nfts - mod;

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
