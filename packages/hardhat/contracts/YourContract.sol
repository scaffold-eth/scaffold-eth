pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./StakerContract.sol";

contract YourContract {

  StakerContract public stakerContract;

  bool public isGameOn = false;
  string public purpose = "🛠 Programming Unstoppable Money";
  mapping(address => uint) public steakedValues;
  mapping(address => bool) public doesPlayerExist;
  uint256 public playerCount = 0;
  address[] public players;
  uint256 public currentIndex = 0;
  uint256 public currentReveal;

  uint256 public deadline = now + 30 seconds;
  uint256 public steakingDeadline = now + 30 minutes;
  uint256 public totalStakingPool = 0;

  constructor(address stakerContractAddress) public {
    stakerContract = StakerContract(stakerContractAddress);
  }
  event NewPlayerJoined(address steaker, uint256 value);
  event TurnCompleted(address nextPlayer);
  event WithdrawWinnings(address steaker, uint256 value);

  function steakAndParticipate() public payable {  

    require(isGameOn == false, "Game has already begun");
    require(doesPlayerExist[msg.sender] == false, "Player has already staked");
    require(now < steakingDeadline, "Deadline has passed, please reset the game to be able to steak again");

      totalStakingPool += msg.value;
      playerCount +=1;
      players.push(msg.sender);
      steakedValues[msg.sender] = msg.value;
      doesPlayerExist[msg.sender] = true;
      emit NewPlayerJoined(msg.sender, msg.value);
  }

  function withdrawWinnings() public payable {
    uint256 amount = steakedValues[msg.sender];
    steakedValues[msg.sender] = 0;
    msg.sender.transfer(amount);

    emit WithdrawWinnings(msg.sender, amount);

  }

  function generateRandomNumber() public {
    require(msg.sender == players[currentIndex], "Its not your turn!");
    
    currentIndex+=1;
    currentIndex%=playerCount;
    currentReveal = 200+currentIndex;

    emit TurnCompleted(players[currentIndex]);
    deadline = now + 30 seconds;
  }

  function turnTimeLeft() public view returns(uint256){
    if(deadline>now){
    return deadline - now;
    } else {
      return 0;
    }
  }

  function steakingTimeLeft() public view returns(uint256){
    if(steakingDeadline>now){
    return steakingDeadline - now;
    } else {
      return 0;
    }
  }

  function startGame() public {
    isGameOn = true;
    deadline = now + 30 seconds;
    stakerContract.complete{ value : address(this).balance}();
    steakingDeadline = 0;
  }

  function endGame() public {
    isGameOn = false;
  }

  function reset() public {
    isGameOn = false;
    steakingDeadline = now + 30 minutes; 
    stakerContract.reset{ value : 0}();

  }
}
