pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./Town.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Level1 is Town {

    mapping(uint256 => uint256) public treeBalanceOfWood;
    mapping(uint256 => uint256) public truckBalanceOfWood;
    mapping(uint256 => uint256) public houseBalanceOfWood;
    mapping(uint256 => uint256) public houseBalanceOfTrucks;
    

    bytes32 someSavedSeedIdk;
    uint256 marketId; 

    constructor() payable {
        someSavedSeedIdk = keccak256(abi.encodePacked(blockhash(block.number-1)));

        marketId = structure(msg.sender, 30000, 30000,unicode"🏪");
    }

    uint256[] public cars;
    function generate() public {
        someSavedSeedIdk = addRandomForest(someSavedSeedIdk, 250);
        uint256 index=0;
        for(uint16 i=0;i<33;i++){
            uint16 rand;
            (index,someSavedSeedIdk,rand) = getNextRandom(index,someSavedSeedIdk);

            string memory emoji = unicode"🚚";
            if(rand%100<=10){
                emoji = unicode"🚗";
            }else if(rand%100<=20){
                emoji = unicode"🚙";
            }else if(rand%100<=25){
                emoji = unicode"🚕";
            }else if(rand%100<=40){
                emoji = unicode"🚚";
            }else if(rand%100<=60){
                emoji = unicode"🚛";
            }else if(rand%100<=70){
                emoji = unicode"🚌";
            }else if(rand%100<=80){
                emoji = unicode"🚐";
            }else if(rand%100<=85){
                emoji = unicode"🚑";
            }else if(rand%100<=90){
                emoji = unicode"🚓";
            }else if(rand%100<=95){
                emoji = unicode"🚒";
            }else{
                emoji = unicode"🛻";
            }


            cars.push(agent(msg.sender, uint16(i*2000), 31000, -50, 0, emoji, 0));
        }
        
    }

    function addRandomForest(bytes32 seed, uint256 amount) internal returns (bytes32) {
        uint256 index;
        bytes32 currentSeed=seed;

        //uint256 treeId = structure(msg.sender, 31000, 31000, unicode"🌲");
        //uint16 treeSize;
        //(index,currentSeed,treeSize) = getNextRandom(index,currentSeed);
        //treeBalanceOfWood[treeId] = 1;//2+treeSize%4;

        
        for(uint256 i=0;i<=amount;i++){
            uint16 x;
            (index,currentSeed,x) = getNextRandom(index,currentSeed);
            uint16 y;
            (index,currentSeed,y) = getNextRandom(index,currentSeed);
            uint256 treeId = structure(msg.sender, x, y, unicode"🌲");
            uint16 treeSize;
            (index,currentSeed,treeSize) = getNextRandom(index,currentSeed);
            treeBalanceOfWood[treeId] = 1;//2+treeSize%4;
        }
       
        return keccak256(abi.encodePacked(currentSeed));
    }

    function stake(uint16 x, uint16 y) public payable returns (uint256) {

        uint256 houseId = structure(msg.sender, x, y, unicode"⛺️");

        houseBalanceOfTrucks[houseId] = 3;
        //require(msg.value >= 0.01 ether, "You must stake at least 1 ether");
        return houseId;
    }

    function truck(uint256 structureId, int8 dx, int8 dy, uint64 stopAfter) public payable returns (uint256) {
        //agent(address owner, uint16 x, uint16 y, int8 dx, int8 dy, string memory emoji, uint64 stopAfter)

        require( houseBalanceOfTrucks[structureId] > 0, "You don't have any trucks left");

        houseBalanceOfTrucks[structureId] = houseBalanceOfTrucks[structureId] - 1; 

        Structure memory structure = structures[structureId];

        require(structure.owner == msg.sender, "You must own the structure");

        return agent(msg.sender, structure.x, structure.y, dx, dy, unicode"🛻", stopAfter);
    }

    function car() public payable returns (uint256) {
        return agent(msg.sender, 65535, 30000, -127, 0, unicode"🚗", 0);
    }

    function updateTruck(uint256 agentId, int8 dx, int8 dy, uint64 stopAfter) public payable {

        Agent memory agent = agents[agentId];

        require(agent.owner == msg.sender, "You must own the agent");

        uint16 x;
        uint16 y;
        (x,y) = agentLocation(agentId);
        
        agentUpdate(agentId, x, y, dx, dy, agent.emoji, stopAfter);
    }

    function harvest(uint256 agentId,uint256 structureId) public {
        
        require(agentDistanceFromStructure(agentId,structureId)<300, "too far away");

        Agent memory agent = agents[agentId];

        require(agent.owner == msg.sender, "You must own the agent");

        require(treeBalanceOfWood[structureId]>0, "tree has no wood left");

        treeBalanceOfWood[structureId]--;

        Structure memory structure = structures[structureId];//this is the tree

        //eventually we should check that the structure is harvestable
        // -- but right now you can call harvest on any structure and get wood out of it lol
        
        //require(structure.owner == msg.sender, "You must own the structure");
        require(truckBalanceOfWood[agentId] == 0, "truck already has cargo");

        truckBalanceOfWood[agentId] = 1;

        agentUpdate(agentId, structure.x, structure.y, 0, 0, agent.emoji, 0);

        if(treeBalanceOfWood[structureId]<=0){
            structureUpdate(structureId, 65535, 65535, unicode"🪚");
        }

        console.log("harvested wood from tree %s", structureId);

    }


    function collect(uint256 agentId,uint256 structureId) public {

        require(agentDistanceFromStructure(agentId,structureId)<500, "too far away");

        Agent memory agent = agents[agentId];

        require(agent.owner == msg.sender, "You must own the agent");

        if(truckBalanceOfWood[agentId]==1){
            truckBalanceOfWood[agentId] = 0;
            houseBalanceOfWood[structureId]++;
        }

        houseBalanceOfTrucks[structureId]++;

        Structure memory structure = structures[structureId];//this is the tree
        
        agentUpdate(agentId, 65535, 65535, 0, 0, "", 0);

    }

}









     //require(distanceFromStructure(agent.x, agent.y, structureId)<1000, "tree too far away");

/*
        let xdir = nearest.args.x-myHouse[0]
        let ydir = nearest.args.y-myHouse[1]

        let distance = Math.sqrt(xdir*xdir+ydir*ydir)
        let speed = 127

        let time = Math.floor(distance/speed)

        let dx = Math.floor((xdir*speed)/distance)
        let dy = Math.floor((ydir*speed)/distance)
*/

/*
        uint16 xdir;
        bool xdirPositive = true;
        if(structure.x>agent.x){
            xdir = structure.x - agent.x;
            xdirPositive = true;
        }else{
            xdir = agent.x - structure.x;
            xdirPositive = false;
        }

        uint16 ydir;
        bool ydirPositive = true;
        if(structure.y>agent.y){
            ydir = structure.y - agent.y;
            ydirPositive = true;
        }else{
            ydir = agent.y - structure.y;
            ydirPositive = false;
        }

        uint16 distance = uint16(sqrt(xdir*xdir+ydir*ydir));

        uint16 speed = 127;

        uint16 time = distance/speed;   
        
        int8 dx = int8(uint8((xdir*speed)/distance));
        if(!xdirPositive){
            dx = dx * -1;
        }

        int8 dy = int8(uint8((ydir*speed)/distance));
        if(!ydirPositive){
            dy = dy * -1;
        }
*/
/*

        Structure memory nextStructure = structures[nextStructureId];//this is home


        uint16 xdir;
        bool xdirPositive = true;
        if(structure.x>agent.x){
            xdir = nextStructure.x - agent.x;
            xdirPositive = true;
        }else{
            xdir = agent.x - nextStructure.x;
            xdirPositive = false;
        }

        uint16 ydir;
        bool ydirPositive = true;
        if(structure.y>agent.y){
            ydir = nextStructure.y - agent.y;
            ydirPositive = true;
        }else{
            ydir = agent.y - nextStructure.y;
            ydirPositive = false;
        }

        uint16 distance = uint16(sqrt(xdir*xdir+ydir*ydir));

        uint16 speed = 127;

        uint16 time = distance/speed;   
        
        int8 dx = int8(uint8((xdir*speed)/distance));
        if(!xdirPositive){
            dx = dx * -1;
        }

        int8 dy = int8(uint8((ydir*speed)/distance));
        if(!ydirPositive){
            dy = dy * -1;
        }


        // AgentRender(agents.length, owner, x, y, dx, dy, emoji, stopAfter, uint64(block.timestamp));
        emit AgentRender(agentId, msg.sender, structure.x, structure.y, dx,dy, unicode"🛻", time, uint64(block.timestamp));*/