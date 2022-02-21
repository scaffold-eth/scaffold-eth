pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  address owner = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

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
  mapping(address => uint256) public last;

  function move(string calldata yourMove) public {
    require(gameOn, "NOT YET");
    require(tx.origin!=msg.sender, "NOT A CONTRACT");
    require(msg.sender==yourContract[tx.origin], "STOP LARPING");
    require(last[tx.origin]<block.timestamp+60,"YOU CANT THO");
    require(last[tx.origin]>block.timestamp-120,"YOU OUT THO");
    moves[tx.origin]=yourMove;
    last[tx.origin]=block.timestamp;
    emit Move(tx.origin, yourMove);
  }

}
