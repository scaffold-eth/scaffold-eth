pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {


  bool public isGameOn = false;
  string public purpose = "🛠 Programming Unstoppable Money";
  mapping(address => uint) public steakedValues;
  mapping(address => bool) public doesPlayerExist;
  uint8 public playerCount = 0;
  address[] public players;
  uint8 public currentIndex = 0;
  uint8 public currentReveal;

  uint256 public deadline = now + 30 seconds;
  uint256 public steakingDeadline = now + 30 minutes;
    constructor() public {

  }
  event NewPlayerJoined(address steaker, uint8 value);
  event TurnCompleted(address nextPlayer);

  function steakAndParticipate(uint8 value) public {  

    require(isGameOn == false, "Game has already begun");
    require(doesPlayerExist[msg.sender] == false, "Player has already staked");
    // require(playerCount>0, "Player Limit is reached, Join us in the next round!");

      playerCount +=1;
      players.push(msg.sender);
      steakedValues[msg.sender] = value;
      doesPlayerExist[msg.sender] = true;
      emit NewPlayerJoined(msg.sender, value);
      
      // if(playerCount == 0){
      //   isGameOn = true;
      // }
  }

  function generateRandomNumber() public payable {
    require(msg.sender == players[currentIndex], "Its not your turn!");
    
    currentIndex+=1;
    currentIndex%=playerCount;
    currentReveal = 200+currentIndex;

    emit TurnCompleted(players[currentIndex]);
    deadline = now + 30 seconds;
  }

  function timeLeft() public view returns(uint256){
    if(deadline>now){
    return deadline - now;
    } else {
      return 0;
    }
  }

  function startGame() public {
    isGameOn = true;
    deadline = now + 30 seconds;
  }

  function endGame() public {
    isGameOn = false;
  }

  function reset() public {
    isGameOn = false;
    steakingDeadline = now + 30 minutes; 
  }
}
