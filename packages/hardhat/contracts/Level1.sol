pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./Town.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 


contract Level1 is Town, ERC20("Gold", "GOLD"){

    mapping(uint256 => uint256) public treeBalanceOfWood;
    mapping(uint256 => uint256) public truckBalanceOfWood;
    mapping(uint256 => uint256) public cargoTruckBalanceOfWood;
    mapping(uint256 => uint256) public houseBalanceOfWood;
    mapping(uint256 => uint256) public houseBalanceOfTrucks;
    mapping(uint256 => uint256) public houseBalanceOfCargoTrucks;
    

    bytes32 someSavedSeedIdk;
    uint256 marketId; 

    constructor() payable {
        someSavedSeedIdk = keccak256(abi.encodePacked(blockhash(block.number-1)));

        marketId = structure(msg.sender, 30000, 30000,unicode"🏪");
    }

    uint256[] public cars;
    function generate() public {

        someSavedSeedIdk = addRandomForest(someSavedSeedIdk, 30);

        
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
            treeBalanceOfWood[treeId] = 1+treeSize%3;
        }
       
        return keccak256(abi.encodePacked(currentSeed));
    }

    function stake(uint16 x, uint16 y) public payable returns (uint256) {

        uint256 houseId = structure(msg.sender, x, y, unicode"⛺️");

        houseBalanceOfTrucks[houseId] = 3;
        houseBalanceOfCargoTrucks[houseId] = 2;

        //houseBalanceOfWood[houseId] = 10;
        //require(msg.value >= 0.01 ether, "You must stake at least 1 ether");
        return houseId;
    }


    function returnCargoTruckTo(uint256 cargoTruckId, uint16 toX, uint16 toY) public payable {

        Agent memory cargoTruck = agents[cargoTruckId];

        require(cargoTruck.owner == msg.sender, "You must own the agent");

        uint16 x;
        uint16 y;
        (x,y) = agentLocation(cargoTruckId);

        (int8 dx, int8 dy, uint64 stopAfter) = calculateRoute(x, y, toX, toY);
        
        agentUpdate(cargoTruckId, x, y, dx, dy, cargoTruck.emoji, stopAfter);

    }

    function sellCargo(uint256 agentId, uint256 structureId) public returns (uint256){

        require( agentDistanceFromStructure(agentId,structureId)<500, "too far away");

        Structure memory structure = structures[structureId];

        require( structure.isMarket , "not a market");

        require( cargoTruckBalanceOfWood[agentId] > 0, "no wood to sell");

        Agent memory agent = agents[agentId];

        require(agent.owner == msg.sender, "You must own the agent");

        uint256 mintAmount = cargoTruckBalanceOfWood[agentId];

        cargoTruckBalanceOfWood[agentId] = 0;

        _mint(msg.sender, mintAmount);

        return mintAmount;
    }


    function sendCargoTruckTo(uint256 fromStructureId, uint16 toX, uint16 toY) public payable returns (uint256) {

        require( houseBalanceOfWood[fromStructureId] > 0, "You don't have any wood");

        require( houseBalanceOfCargoTrucks[fromStructureId] >0 , "You don't have any cargo trucks left");

        houseBalanceOfCargoTrucks[fromStructureId] = houseBalanceOfCargoTrucks[fromStructureId] - 1; 

        Structure memory fromStructure = structures[fromStructureId];

        require(fromStructure.owner == msg.sender, "You must own the structure");

        (int8 dx, int8 dy, uint64 stopAfter) = calculateRoute(fromStructure.x, fromStructure.y, toX, toY);

        uint256 cargoTruckId = agent(msg.sender, fromStructure.x, fromStructure.y, dx, dy, unicode"🚛", stopAfter);

        if(houseBalanceOfWood[fromStructureId]<=3){
            cargoTruckBalanceOfWood[cargoTruckId] = houseBalanceOfWood[fromStructureId];
            houseBalanceOfWood[fromStructureId] = 0;
        }else{
            houseBalanceOfWood[fromStructureId] = houseBalanceOfWood[fromStructureId] - 3;
            cargoTruckBalanceOfWood[cargoTruckId] = 3;
        }       

        return cargoTruckId;
    }

    function sendTruckTo(uint256 fromStructureId, uint16 toX, uint16 toY) public payable returns (uint256) {

        require( houseBalanceOfTrucks[fromStructureId] > 0, "You don't have any trucks left");

        houseBalanceOfTrucks[fromStructureId] = houseBalanceOfTrucks[fromStructureId] - 1; 

        Structure memory fromStructure = structures[fromStructureId];

        require(fromStructure.owner == msg.sender, "You must own the structure");

        (int8 dx, int8 dy, uint64 stopAfter) = calculateRoute(fromStructure.x, fromStructure.y, toX, toY);

        return agent(msg.sender, fromStructure.x, fromStructure.y, dx, dy, unicode"🛻", stopAfter);
    }

    function car() public payable returns (uint256) {
        return agent(msg.sender, 65535, 30000, -127, 0, unicode"🚗", 0);
    }

    function returnTruckTo(uint256 truckId, uint16 toX, uint16 toY) public payable {

        Agent memory truck = agents[truckId];

        require(truck.owner == msg.sender, "You must own the agent");

        uint16 x;
        uint16 y;
        (x,y) = agentLocation(truckId);

        (int8 dx, int8 dy, uint64 stopAfter) = calculateRoute(x, y, toX, toY);
        
        agentUpdate(truckId, x, y, dx, dy, truck.emoji, stopAfter);

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
            structureUpdate(structureId, 0, 0, "");
        }

        console.log("harvested wood from tree %s", structureId);

    }


    function collect(uint256 agentId,uint256 structureId) public {

        require(agentDistanceFromStructure(agentId,structureId)<500, "too far away");

        Agent memory agent = agents[agentId];

        require(agent.owner == msg.sender, "You must own the agent");


        // lol you need to require that this is a truck 

        // any other agent cant be collected and count as a truck


        if(truckBalanceOfWood[agentId]==1){
            truckBalanceOfWood[agentId] = 0;
            houseBalanceOfWood[structureId]++;
        }

        houseBalanceOfTrucks[structureId]++;

        //Structure memory structure = structures[structureId];//this is the tree
        
        agentUpdate(agentId, 0, 0, 0, 0, "", 0);

    }



    function collectCargoTruck(uint256 agentId,uint256 structureId) public {

        require(agentDistanceFromStructure(agentId,structureId)<500, "too far away");

        Agent memory agent = agents[agentId];

        require(agent.owner == msg.sender, "You must own the agent");

        if(cargoTruckBalanceOfWood[agentId]>0){
            houseBalanceOfWood[structureId] += cargoTruckBalanceOfWood[agentId];
            cargoTruckBalanceOfWood[agentId] = 0;
        }

        houseBalanceOfCargoTrucks[structureId]++;

        //Structure memory structure = structures[structureId];//this is the tree
        
        agentUpdate(agentId, 0, 0, 0, 0, "", 0);

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