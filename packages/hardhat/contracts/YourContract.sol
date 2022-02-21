pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  address owner = 0xE09750abE36beA8B2236E48C84BB9da7Ef5aA07c;

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

  function start() public {
    require(msg.sender==owner,"BACK OFF!");
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
