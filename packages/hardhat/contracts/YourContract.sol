pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Ownable {

  //idk it's a map of 0,0 to 65535,65535
  //it'll rollover if we use unchecked math 

  event StructureRender(address owner, uint16 x, uint16 y, string emoji);
  event AgentRender(address owner, uint16 x, uint16 y, int8 dx, int8 dy, string emoji, uint64 stopAfter, uint64 startTime);

  uint256 public someAgentId;

  constructor() payable {
    structure(2000, 20000, unicode"🏢");
    agent(3000, 20000, -127, 0, unicode"🚗", 10000);
    someAgentId = agent(4000, 40000, 77, 0, unicode"👉", 10000);
  }

  struct Structure {
    uint16 x;
    uint16 y;
    string emoji;
  }

  Structure[] public structures;

  function structure(uint16 x, uint16 y, string memory emoji) public onlyOwner returns (uint256) {
      structures.push(Structure({
        x: x, 
        y: y, 
        emoji: emoji
      }));
      emit StructureRender(msg.sender, x, y, emoji);
      return structures.length - 1;
  }

  struct Agent {
    uint16 x;
    uint16 y;
    int8 dx;
    int8 dy;
    string emoji;
    uint64 stopAfter;
    uint64 startTime;
  }

  Agent[] public agents;

  function agent(uint16 x, uint16 y, int8 dx, int8 dy, string memory emoji, uint64 stopAfter) public onlyOwner returns (uint256) {
      agents.push(Agent({
        x: x, 
        y: y, 
        dx: dx, 
        dy: dy, 
        emoji: emoji, 
        stopAfter: stopAfter, 
        startTime: uint64(block.timestamp)
      }));
      emit AgentRender(msg.sender, x, y, dx, dy, emoji, stopAfter, uint64(block.timestamp));
      return agents.length - 1;
  }

  function agentLocation(uint256 agentId) public view returns (uint16, uint16) {
    Agent memory theAgent = agents[agentId];

    uint64 timePassed = uint64(block.timestamp) - theAgent.startTime;

    if (theAgent.stopAfter > 0 && timePassed > theAgent.stopAfter) {
      timePassed = theAgent.stopAfter;
    }

    uint16 x = theAgent.x;
    if(theAgent.dx>0){
      uint16 unsigned = uint8(theAgent.dx);
      unchecked{
        x = uint16(x + unsigned * timePassed);
      }
    } else {
      uint16 unsigned = uint8(-theAgent.dx);
      unchecked{
        x = uint16(x - unsigned * timePassed);
      }
    }

    uint16 y = theAgent.y;
    if(theAgent.dy>0){
      uint16 unsigned = uint8(theAgent.dy);
      unchecked{
        y = uint16(y + unsigned * timePassed);
      }
    } else {
      uint16 unsigned = uint8(-theAgent.dy);
      unchecked{
        y = uint16(y - unsigned * timePassed);
      }
    }

    return (x, y);
  }

  function agentDistanceFromStructure(uint256 agentId, uint256 structureId) public view returns (uint256) {
    uint16 x;
    uint16 y;
    (x,y) = agentLocation(agentId);
    return distanceFromStructure(x, y, structureId);
  }

  function distanceFromStructure(uint16 x, uint16 y, uint256 structureId) public view returns (uint256) {
    Structure memory theStructure = structures[structureId];
    return distance(x, y, theStructure.x, theStructure.y);
  }

  function distance(uint16 x1, uint16 y1, uint16 x2, uint16 y2) public pure returns (uint256) {
    uint256 xdist;
    if(x1 > x2) {
      xdist = uint256(x1) - uint256(x2);
      if(xdist > 32768) xdist = 65536 - xdist;
    } else {
      xdist = uint256(x2) - uint256(x1);
      if(xdist > 32768) xdist = 65536 - xdist;
    }
    uint256 ydist;
    if(y1 > y2) {
      ydist = uint256(y1) - uint256(y2);
      if(ydist > 32768) ydist = 65536 - ydist;
    } else {
      ydist = uint256(y2) - uint256(y1);
      if(ydist > 32768) ydist = 65536 - ydist;
    }
    return sqrt(xdist * xdist + ydist * ydist);
  }

  function sqrt(uint y) internal pure returns (uint z) {
    if (y > 3) {
        z = y;
        uint x = y / 2 + 1;
        while (x < z) {
            z = x;
            x = (y / x + x) / 2;
        }
    } else if (y != 0) {
        z = 1;
    }
}

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
