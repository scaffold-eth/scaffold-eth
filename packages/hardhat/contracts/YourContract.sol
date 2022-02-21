pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  address owner = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

  event Register(address origin, address yourContract);
  event Move(address origin, string move, uint256 healthLeft);

  mapping(address => address) public yourContract;
  mapping(address => uint256) public health;

  bool public gameOn;

  function register() public {
    require(!gameOn, "TOO LATE");
    require(yourContract[tx.origin]==address(0), "NO MORE PLZ");
    require(tx.origin!=msg.sender, "NOT A CONTRACT");
    yourContract[tx.origin] = msg.sender;
    emit Register(tx.origin,msg.sender);
    health[tx.origin] = 5000;
  }

  uint256 startTime;

  function start() public {
    require(msg.sender==owner,"BACK OFF!");
    gameOn=true;
    startTime = block.timestamp;
  }

  mapping(address => string) public moves;
  mapping(address => uint256) public last;

  function move(string calldata yourMove) public {
    require(gameOn, "NOT YET");
    require(  health[tx.origin] >0, "YOU DED");
    require(tx.origin!=msg.sender, "NOT A CONTRACT");
    require(msg.sender==yourContract[tx.origin], "STOP LARPING");
    require((block.timestamp<startTime+120 && last[tx.origin]==0) || block.timestamp > last[tx.origin]+10,"YOU CANT THO");
    require((block.timestamp<startTime+120 && last[tx.origin]==0) || block.timestamp < last[tx.origin]+60,"YOU OUT THO");

    bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this), last[tx.origin] ));
    health[tx.origin] -= uint8(predictableRandom[0]);

    moves[tx.origin]=yourMove;
    last[tx.origin]=block.timestamp;
    emit Move(tx.origin, yourMove, health[tx.origin] );
  }

}
