pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Ownable{

  event Register(address origin, address yourContract);
  event Move(address origin, string move);

  mapping(address => address) public yourContract;

  bool public gameOn;

  function register() public {
    require(!gameOn, "TOO LATE");
    require(tx.origin!=msg.sender, "NOT A CONTRACT");
    yourContract[tx.origin] = msg.sender;
    emit Register(tx.origin,msg.sender);
  }

  function start() public onlyOwner {
    gameOn=true;
  }

  mapping(address => string) public moves;


  function move(string calldata yourMove) public {
    require(gameOn, "NOT YET");
    require(tx.origin!=msg.sender, "NOT A CONTRACT");
    require(msg.sender==yourContract[tx.origin], "STOP LARPING");
    moves[tx.origin]=yourMove;
    emit Move(tx.origin, yourMove);
  }

}
