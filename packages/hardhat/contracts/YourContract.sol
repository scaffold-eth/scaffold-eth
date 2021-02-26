pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract YourContract {
  struct Winner {
    uint8 value;
    address winnerAddress;
  }

  bool public isGameOn = false;
  string public purpose = "🛠 Programming Unstoppable Money";
  
  mapping(address => uint256) public balances;
  
  address[] public players;

  uint256 public playerCount = 0;
  uint256 public currentIndex = 0;
  uint256 public currentReveal;
  uint256 public deadline = now + 30 seconds;
  uint256 public steakingDeadline = now + 30 minutes;
  uint256 public totalStakingPool = 0;
  Winner public currentWinner;


  constructor() public {
    currentWinner.value = 0;
  }
  event NewPlayerJoined(address steaker, uint256 value);
  event TurnCompleted(address nextPlayer, uint8 random);
  event WithdrawWinnings(address steaker, uint256 value);

  function steakAndParticipate() public payable {  

    require(isGameOn == false, "Game has already begun");
    require(balances[msg.sender] <= 0, "Player has already staked");    
    require(now < steakingDeadline, "Deadline has passed, please reset the game to be able to steak again");

      totalStakingPool += msg.value;
      playerCount +=1;

      players.push(msg.sender);
      balances[msg.sender] = msg.value;

      emit NewPlayerJoined(msg.sender, msg.value);
  }

  // isGameOn,
  // currentReveal,
  // turnTimeLeft,
  // stakingTimeLeft,
  // playerCount,
  // totalStakingPool,
  // currentWinner,
  // currentIndex,

  function frontendDataProvider() public view returns(bool, uint256, uint256, uint256, uint256, uint256, uint256, Winner memory){
    return(isGameOn, currentReveal, turnTimeLeft(), steakingTimeLeft(), playerCount, totalStakingPool, currentIndex, currentWinner);
  }
  function playerCounter() public view returns(uint256, string memory){
    return (playerCount, "This is a string");
  }
  function withdrawWinnings() public payable {
    require(balances[msg.sender]>0,"No eth left to withdraw");
    balances[msg.sender] -= (balances[msg.sender]*50)/100;
    if( msg.sender == currentWinner.winnerAddress){
      balances[msg.sender] += (playerCount*50)/uint(100);
    }
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;
    msg.sender.transfer(amount);
    emit WithdrawWinnings(msg.sender, amount);

  }

  function generateRandomNumber() public {
    require(msg.sender == players[currentIndex], "Its not your turn!");
    require(currentIndex<playerCount, "The round is over press reset to start over");


    bytes32 blockHash = blockhash(uint64(block.number));

    uint8 random = uint8(uint(keccak256(abi.encodePacked(blockHash,bytes32(now)))))%100;
    currentReveal = random;
    if(currentWinner.value < currentReveal ){
      currentWinner.value = uint8(currentReveal);
      currentWinner.winnerAddress = msg.sender;
    }

    currentIndex+=1;
    if(currentIndex<=playerCount){
    emit TurnCompleted(players[currentIndex-1], random);
    } else {
      isGameOn = false;
    }
    deadline = now + 30 seconds;
  }
  function skipTurn()public {
    uint256 currentTurnTimeLeft = turnTimeLeft();
    require(currentTurnTimeLeft<=0, "Players deadline isnt over yet");
    require(currentIndex<playerCount, "The round is over press reset to start over");
    penaliseAndRedistribute();
    currentReveal = 0;
    currentIndex+=1;
    if(currentIndex<=playerCount){
    emit TurnCompleted(players[currentIndex-1], 0);
    }
    deadline = now + 30 seconds;
  }
  function turnTimeLeft() public view returns(uint256){
    if(deadline>now){
    return deadline - now;
    } else {
      return 0;
    }
  }
  function penaliseAndRedistribute() public payable {
    uint256 penalty = balances[players[currentIndex]];
    uint256 winnings_per_person = penalty/(playerCount-1);
    balances[players[currentIndex]] = 0;
    for (uint i = 0; i < players.length; i++) {
        if(players[i] != players[currentIndex]){
          balances[players[i]] += winnings_per_person;
        }
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
    steakingDeadline = 0;
  }

  function endGame() public {
    isGameOn = false;
  }

  function reset() public {
    isGameOn = false;
    steakingDeadline = now + 30 minutes; 
    totalStakingPool = 0;
    currentWinner.value = 0;
    currentWinner.winnerAddress = 0x0000000000000000000000000000000000000000;

    for (uint i = 0; i < players.length; i++) {
      delete balances[players[i]];
  }
  }
}
