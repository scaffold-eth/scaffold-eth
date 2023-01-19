pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Town is Ownable {

  //idk it's a map of 0,0 to 65535,65535
  //it'll rollover if we use unchecked math 

  event StructureRender(uint256 id, address owner, uint16 x, uint16 y, string emoji, uint64 startTime);
  event AgentRender(uint256 id, address owner, uint16 x, uint16 y, int8 dx, int8 dy, string emoji, uint64 stopAfter, uint64 startTime);


  constructor() payable {

  }

  struct Structure {
    address owner;
    uint16 x;
    uint16 y;
    bool isMarket; // lololol make this more generic like a type variable or something
  }
/*
  function stringToBytes(string memory s) public pure returns (bytes4){
    bytes memory temp = bytes(s);
    return bytes4(temp[0]) | bytes4(temp[1]) << 8 | bytes4(temp[2]) << 16 | bytes4(temp[3]) << 24;
  }

  function bytesToString(bytes4 b) public pure returns (string memory){
    bytes memory temp = new bytes(4);
    temp[0] = b[0];
    temp[1] = b[1];
    temp[2] = b[2];
    temp[3] = b[3];
    return string(temp);
  }
*/
  Structure[] public structures;

  function structure(address owner, uint16 x, uint16 y, string memory emoji) internal returns (uint256) {
      
      emit StructureRender(structures.length,owner, x, y, emoji, uint64(block.timestamp));

      structures.push(Structure({
        owner: owner,
        x: x, 
        y: y,
        isMarket: keccak256(abi.encodePacked(emoji)) == keccak256(abi.encodePacked(unicode"🏪"))
      }));
      
      return structures.length - 1;
  }

  function structureUpdate(uint256 structureId, uint16 x, uint16 y, string memory emoji) internal {
    Structure storage theStructure = structures[structureId];
    //require(theAgent.owner == msg.sender, "You do not own this agent");
    theStructure.x = x;
    theStructure.y = y;
    
    emit StructureRender(structureId, theStructure.owner, theStructure.x, theStructure.y, emoji, uint64(block.timestamp));
  }

  struct Agent {
    address owner;
    uint16 x;
    uint16 y;
    int8 dx;
    int8 dy;
    string emoji;
    uint64 stopAfter;
    uint64 startTime;
  }

  Agent[] public agents;

  function agent(address owner, uint16 x, uint16 y, int8 dx, int8 dy, string memory emoji, uint64 stopAfter) internal returns (uint256) {

      emit AgentRender(agents.length, owner, x, y, dx, dy, emoji, stopAfter, uint64(block.timestamp));

      agents.push(Agent({
        owner:owner,
        x: x, 
        y: y, 
        dx: dx, 
        dy: dy, 
        emoji: emoji, 
        stopAfter: stopAfter, 
        startTime: uint64(block.timestamp)
      }));
      
      return agents.length - 1;
  }

  function agentUpdate(uint256 agentId, uint16 x, uint16 y, int8 dx, int8 dy, string memory emoji, uint64 stopAfter) internal {
    Agent storage theAgent = agents[agentId];
    //require(theAgent.owner == msg.sender, "You do not own this agent");
    theAgent.x = x;
    theAgent.y = y;
    theAgent.dx = dx;
    theAgent.dy = dy;
    theAgent.emoji = emoji;
    theAgent.stopAfter = stopAfter;
    theAgent.startTime = uint64(block.timestamp);

    emit AgentRender(agentId, theAgent.owner, x, y, dx, dy, emoji, stopAfter, uint64(block.timestamp));
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
    //require(agentId < agents.length, "Agent does not exist");
    uint16 x;
    uint16 y;
    (x,y) = agentLocation(agentId);
    return distanceFromStructure(x, y, structureId);
  }

  function distanceFromStructure(uint16 x, uint16 y, uint256 structureId) public view returns (uint256) {
    //require(structureId < structures.length, "Structure does not exist");
    Structure memory theStructure = structures[structureId];
    return distance(x, y, theStructure.x, theStructure.y);
  }

  function calculateRoute(uint16 fromX, uint16 fromY, uint16 toX, uint16 toY) public view returns (int8, int8, uint64){

    //lololololololololololololol

    bool flipX;
    bool flipY;

    uint256 xdist;
    if(fromX > toX) {
        flipX=true;
        xdist = uint256(fromX) - uint256(toX);
        if(xdist > 32768){
            xdist = 65536 - xdist;
        }
    } else {
        xdist = uint256(toX) - uint256(fromX);
        if(xdist > 32768){
            xdist = 65536 - xdist;
        }
    }
    uint256 ydist;
    if(fromY > toY) {
        flipY=true;
        ydist = uint256(fromY) - uint256(toY);
        if(ydist > 32768){
            ydist = 65536 - ydist;
        }
    } else {
        ydist = uint256(toY) - uint256(fromY);
        if(ydist > 32768){
            ydist = 65536 - ydist;
        }
    }

    uint256 dist = sqrt(xdist * xdist + ydist * ydist);

    uint256 speed = 100;

    uint256 time = dist / speed;

    uint256 dx = xdist / time;
    uint256 dy = ydist / time;

    console.log(dx);
    console.log(dy);

    int8 fdx = int8(uint8(dx));
    int8 fdy = int8(uint8(dy));


    console.log(uint8(fdx));
    console.log(uint8(fdy));

    if(flipX){
        fdx = -fdx;
    }
    if(flipY){
        fdy = -fdy;
    }

    console.log(fdx<0);
    console.log(fdy<0);

    return (fdx, fdy, uint64(time));
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

  function getNextRandom(uint256 index, bytes32 currentSeed) internal pure returns (uint256,bytes32,uint16) {
    bytes2 firstBytes = bytes2(currentSeed[index++]) >> 8;
    if(index>=32) {
        currentSeed = keccak256(abi.encodePacked(currentSeed));
        index=0;
    }
    bytes2 r =  firstBytes | ( bytes2(currentSeed[index++]) );
    if(index>=32) {
        currentSeed = keccak256(abi.encodePacked(currentSeed));
        index=0;
    }
    return (index,currentSeed,uint16(r));
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
