pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  event SetPurpose(address sender, string purpose);
  bool gameIsStarted = false;
  string public purpose = "🛠 Programming Unstoppable Money";
  mapping(address => uint256) steakedValues;
  mapping(address => bool) doesPlayerExist;
  uint256 playerCount = 0;
  // address[] public players;
  uint256 currentIndex = 0;

  constructor(uint256 numberOfPlayers) public {
    playerCount = numberOfPlayers;
  }
  event NewPlayerJoined(address steaker, uint256 value);
  function steakAndParticipate(address steaker, uint256 value) public {  
    require(gameIsStarted == false, "Game has already begun");
    require(doesPlayerExist[steaker] == false, "Player has already staked");
    require(playerCount>0, "Player Limit is reached, Join us in the next round!");

      playerCount -=1;
      // players.push(steaker);
      doesPlayerExist[steaker] == true;
      emit NewPlayerJoined(steaker, value);
  }

  function generateRandomNumber(address player) public returns (uint256) {
    // require(player == players[currentIndex], "Its not your turn!");
    
    currentIndex+=1;
    currentIndex%=playerCount;

  }
}
