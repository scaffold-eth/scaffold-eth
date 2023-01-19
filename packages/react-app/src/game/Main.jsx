import React, { useCallback, useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { ethers } from "ethers";
import { getRPCPollTime, Transactor, Web3ModalSetup } from "../helpers";
import { useParams } from "react-router-dom";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useUserProviderAndSigner,
  usePoller,
} from "eth-hooks";

import {
  Address,
  Account,
  Balance,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
} from "../components";

//import { helpers } from "@nomicfoundation/hardhat-network-helpers";

import Level1 from "./Level1.json";

import { GameLoop } from ".";

import { useLocalStorage } from "../hooks";
//import { ConsoleSqlOutlined } from "@ant-design/icons";
//import { getContractAddress } from "ethers/lib/utils";

const DEBUG = false;

const POLL_TIME = 2000;

export default function Main({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  setShowLocalWallet,
  readContracts,
  contractConfig,
  setSelectedNetwork,
}) {
  const { currentTheme } = useThemeSwitcher();

  const [gameContract, setGameContract] = useLocalStorage("gameContract");

  let { incomingContractAddress } = useParams();

  useEffect(() => {
    if (incomingContractAddress) {
      //console.log(" 🚒🚒🚒 incomingContractAddress", incomingContractAddress);
      setGameContract(incomingContractAddress);
    }
  }, [incomingContractAddress]);

  const [errors, setErrors] = useState([]);

  const [localhostProvider, setlocalhostProvider] = useState();
  const [found, setFound] = useState(false);
  useEffect(() => {
    console.log("useEffect");
    try {
      let newprovider;
      if (window.location.hostname === "stage.ether.town") {
        console.log(" 📡 using PUBLIC RPC provider for stage.ether.town");
        newprovider = new ethers.providers.JsonRpcProvider("https://chain.ether.town");
      } else {
        console.log(" 📡 using RPC provider for localhost");
        newprovider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      }

      console.log("SETTING newprovider", newprovider);
      if (newprovider) {
        setlocalhostProvider(newprovider);
      }
    } catch (e) {
      console.log(e);
    }
  }, [address]);

  const [theState, setTheState] = useState("listening...");

  const [structureRender, setStructureRender] = useState([]);
  const [knownStructures, setKnownStructures] = useState([]);
  const [knownAgents, setKnownAgents] = useState([]);

  const [agentRender, setAgentRender] = useState([]);

  if (DEBUG) console.log("📦 gameContract from localStorage:", gameContract);

  const [gameContractObj, setGameContractObj] = useState();

  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  const [myHouse, setMyHouse] = useState();
  const [myHouseObject, setMyHouseObject] = useLocalStorage("houseObject");

  const loadVisibleStructures = useCallback(async (contract, blockNumber) => {
    //lets measure how long this takes and report it in the console
    let startLoadingStructures = new Date().getTime();

    const Structures = await contract.queryFilter(
      { topics: [ethers.utils.id("StructureRender(uint256,address,uint16,uint16,string,uint64)")] },
      0,
      blockNumber,
    );

    //console.log("ALL Structures", Structures);

    let visibleStructures = {};
    for (let i = 0; i < Structures.length; i++) {
      let structureId = Structures[i].args.id.toNumber();
      //console.log("looking at structureId",structureId,"with index",i)
      if (!visibleStructures[structureId]) visibleStructures[structureId] = Structures[i];
      else {
        //if the structre is already in the list, we need to check if this one is more recent
        //console.log("visibleStructures[structureId].args.startTime?.toNumber() ",visibleStructures[structureId].args.startTime?.toNumber() )
        //console.log("Structures[i].args.startTime?.toNumber()",Structures[i].args.startTime?.toNumber())
        if (visibleStructures[structureId].args.startTime?.toNumber() < Structures[i].args.startTime?.toNumber()) {
          visibleStructures[structureId] = Structures[i];
        }
      }
    }
    let finalVisibleStructures = [];
    //console.log("visibleStructures",visibleStructures)
    for (let i in visibleStructures) {
      finalVisibleStructures.push(visibleStructures[i]);
    }

    if (DEBUG) console.log("finalVisibleStructures", finalVisibleStructures);

    if (DEBUG) console.log("⏱ Time loading Structures events", new Date().getTime() - startLoadingStructures, "ms");

    return finalVisibleStructures;
  });

  const doContractDeployment = async () => {
    console.log("🧘‍♂️ DEPLOYING");

    //console.log("GET BYTECOE AND INTEFARECE FROM ",contractConfig.deployedContracts['31337'].localhost.contracts.YourContract)
    //console.log("MAYBE FROM ",readContracts)
    //console.log("or even ",YourContract)

    let deployer = new ethers.ContractFactory(Level1.abi, Level1.bytecode, localhostProvider.getSigner(0));
    console.log("deployer", deployer);

    let result = await deployer.deploy();

    console.log("result", result);
    if (result && result.address) {
      console.log("Setting game contract...", result.address);
      setGameContract(result.address);
      const contract = new ethers.Contract(result.address, Level1.abi, localhostProvider.getSigner(0));

      setGameContractObj(contract);

      /*
      await (await contract.agent(30000, 30000, -40, 0, "🚜", 300)).wait();
      await (await contract.agent(30000, 31000, -120, 0, "🏎", 0)).wait();

      await (await contract.structure(8000, 31000, "🏠")).wait();
      await (await contract.structure(8000, 30000, "🏚")).wait();
      */
      await (await contract.generate()).wait();
      //await (await contract.generate()).wait();
      //await (await contract.generate()).wait();
    }
  };

  usePoller(() => {
    //console.log("POLLER!");
    const doCheck = async () => {
      //console.log("DOCHEKC!!");
      //console.log("localhostProvider", localhostProvider);
      if (localhostProvider) {
        //if you find your house in localStorage, load it up
        if (myHouseObject && !myHouse) {
          console.log("💾💾💾💾 updating to my house load load load ");
          console.log("myHouseObject", myHouseObject);
          setMyHouse([myHouseObject.x, myHouseObject.y]);
        }

        try {
          let blockNumber = await localhostProvider.getBlockNumber();
          //console.log("blockNumber", blockNumber);
          setFound(true);

          //triggering a transaction to make timestamps work better
          let faucetTx = Transactor(localhostProvider, null, null, true);
          faucetTx({
            to: "0x0000000000000000000000000000000000000000",
            value: 0,
          });

          const timestamp = (await localhostProvider.getBlock(blockNumber)).timestamp;
          setCurrentTimestamp(timestamp);
          //console.log("timestamp", timestamp);

          if (DEBUG) console.log("👀 looking for gameContract at", gameContract);
          if (!gameContract || (await localhostProvider.getCode(gameContract)) === "0x") {
            console.log(" 💻 ", window.location.hostname);
            if (window.location.hostname === "localhost" /*&& !incomingContractAddress*/) {
              doContractDeployment();
            } else {
              console.log(" 🕰 waiting for a game contract...");
            }
          } else {
            if (DEBUG) console.log("🥊 gameContract", gameContract);

            //let's keep the url up to date with the selected game contract so it's easy to share and obvious what you are looking at
            //console.log("incomingContractAddress", incomingContractAddress);
            //console.log("gameContract", gameContract);
            if (incomingContractAddress !== gameContract) {
              window.history.replaceState(null, gameContract, "/" + gameContract);
            }

            console.log("🏡 my house is ", myHouseObject);

            //const contractAddress = readContracts["YourContract"].address
            //const contractabi = contractConfig.deployedContracts['31337'].localhost.contracts.YourContract.abi

            const contract = new ethers.Contract(gameContract, Level1.abi, localhostProvider);
            if (!gameContractObj) setGameContractObj(contract);
            //console.log("contract", contract)

            let finalVisibleStructures = await loadVisibleStructures(contract, blockNumber);
            setKnownStructures(finalVisibleStructures);

            //console.log("Structures", Structures.length);
            let structureRenderUpdate = [];
            for (let i = 0; i < finalVisibleStructures.length; i++) {
              //console.log("rndering structure");
              let xPercent = (finalVisibleStructures[i].args.x * 100) / 65535;
              let yPercent = (finalVisibleStructures[i].args.y * 100) / 65535;
              structureRenderUpdate.push(
                <div
                  id={"structure" + i}
                  style={{
                    position: "absolute",
                    transform: "scale(2)",
                    left: "calc(" + xPercent + "%)",
                    top: "calc(" + yPercent + "% - 4px)",
                  }}
                >
                  {finalVisibleStructures[i].args.emoji}
                </div>,
              );
            }
            setStructureRender(structureRenderUpdate);

            //lets measure how long this takes and report it in the console
            let startLoadingAgents = new Date().getTime();

            const Agents = await contract.queryFilter(
              {
                topics: [ethers.utils.id("AgentRender(uint256,address,uint16,uint16,int8,int8,string,uint64,uint64)")],
              },
              0,
              blockNumber,
            );

            if (DEBUG) console.log("⏱ Time loading Agents events", new Date().getTime() - startLoadingAgents, "ms");

            if (DEBUG) console.log("ALL AGENTS", Agents);

            //lets create a new list of just agents that are visible
            let visibleAgents = {};
            for (let i = 0; i < Agents.length; i++) {
              let agentId = Agents[i].args.id;
              if (!visibleAgents[agentId]) visibleAgents[agentId] = Agents[i];
              else {
                //if the agent is already in the list, we need to check if this one is more recent
                //console.log("COMPARING AGENT START TIMES",visibleAgents[agentId].args.startTime,Agents[i].args.startTime)
                if (visibleAgents[agentId].args.startTime?.toNumber() < Agents[i].args.startTime?.toNumber()) {
                  visibleAgents[agentId] = Agents[i];
                }
              }
            }

            let finalVisibleAgents = [];
            if (DEBUG) console.log("visibleAgents", visibleAgents);
            for (let i in visibleAgents) {
              finalVisibleAgents.push(visibleAgents[i]);
            }

            if (DEBUG) console.log("finalVisibleAgents", finalVisibleAgents);

            const renderAgent = agent => {
              let timePassed = timestamp - agent.startTime;
              if (agent.stopAfter > 0 && timePassed > agent.stopAfter) timePassed = agent.stopAfter;

              let xOffset = (agent.dx * timePassed) % 65535;
              let yOffset = (agent.dy * timePassed) % 65535;

              let absoluteY = agent.y + yOffset;
              if (absoluteY < 0) absoluteY = 65535 + absoluteY;

              let absoluteX = agent.x + xOffset;
              if (absoluteX < 0) absoluteX = 65535 + absoluteX;

              let xPercent = (absoluteX * 100) / 65535;
              let yPercent = (absoluteY * 100) / 65535;

              //console.log("RENDER AT", xPercent, yPercent);
              let waitingClick = 0;
              if (agent.emoji == "🛻" && agent.owner == address) {
                waitingClick = 1;
                if (timePassed >= agent.stopAfter) {
                  waitingClick = 2;
                }
              }

              return (
                <div
                  id={"agent" + agent.id.toNumber()}
                  style={{
                    position: "absolute",
                    transform: "scale(2)",
                    left: "calc(" + xPercent + "% )",
                    top: "calc(" + yPercent + "% - 4px)" /*,transform:"scaleX(-1)"*/,
                    /*backgroundColor: waitingClick==2 ? "red" : "white",*/
                  }}
                >
                  {agent.emoji}
                </div>
              );
            };

            ////////////
            setKnownAgents(finalVisibleAgents);

            //console.log("Agents", Agents);
            let agentRenderUpdate = [];
            for (let i = 0; i < finalVisibleAgents.length; i++) {
              //console.log("rndering agent");
              agentRenderUpdate.push(renderAgent(finalVisibleAgents[i].args));
            }
            setAgentRender(agentRenderUpdate);

            /*
            //look through all trucks to see if any of them are mine and ready to come back to the house
            for(let i = 0; i < Agents.length; i++){
              if(Agents[i].args.emoji == "🛻" && Agents[i].args.owner == address){
                console.log("found my truck", Agents[i].args);
                let timePassed = timestamp - Agents[i].args.startTime
                console.log("time passed",timePassed);

                if(Agents[i].args.stopAfter > 0 && timePassed > Agents[i].args.stopAfter){
                  console.log("truck is stopped");


                }
              }
            }*/

            //setDistExample(await contract.agentDistanceFromStructure(3, 2));

            let myHouseId;

            if (knownStructures && (myHouse || myHouse)) {
              console.log("checking house id");
              for (let i = 0; i < knownStructures.length; i++) {
                //console.log("rndering structure");
                if (
                  knownStructures[i].args.x == myHouse[0] &&
                  knownStructures[i].args.y == myHouse[1] &&
                  knownStructures[i].args.owner == address
                ) {
                  myHouseId = knownStructures[i].args.id;
                }
              }
            }

            if (DEBUG) console.log("myHouseId", myHouseId);

            if (myHouseId) {
              //"SUP"+(myHouseId?myHouseId.toNumber():"...")

              let myTrucks = await contract.houseBalanceOfTrucks(myHouseId);
              let myCargoTrucks = await contract.houseBalanceOfCargoTrucks(myHouseId);
              let myWood = await contract.houseBalanceOfWood(myHouseId);

              let myGold = await contract.balanceOf(address);

              setTheState(
                "⭐️" +
                  myGold?.toNumber() +
                  " 🚛" +
                  myCargoTrucks?.toNumber() +
                  " 🚙" +
                  myTrucks?.toNumber() +
                  "  🪵" +
                  myWood?.toNumber(),
              );
            } else {
              setTheState("👆 Click anywhere to start 🏕");
            }

            GameLoop({
              provider: localhostProvider,
              address,
              setTheState,
            });
          }

          setShowLocalWallet(true);
          setSelectedNetwork("localhost");
        } catch (e) {
          console.log(e);

          console.log("☢️ reseting game ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ");

          setTimeout(() => {
            setGameContract("");
            setGameContractObj(null);
            setStructureRender([]);
            setAgentRender([]);
            setShowLocalWallet(false);
            setFound(false);
            setTheState("📡 connecting again...");
            setSelectedNetwork("mainnet");
            setMyHouseObject(null);
          }, 3000);
        }
      }
    };

    if (true) doCheck();
  }, POLL_TIME);

  //console.log("gameContractObj", gameContractObj);

  const errorRender = [];

  for (let ee in errors) {
    let timePassed = Date.now() - errors[ee].timestamp;
    let opacity = 0;
    //console.log("timePassed",timePassed)
    if (timePassed < 5000) {
      //console.log("error",errors[ee])
      opacity = 1 - timePassed / 5000;
    }
    if (opacity > 0) {
      errorRender.push(
        <div style={{ position: "absolute", left: errors[ee].x - 8, top: errors[ee].y - 10, opacity: opacity }}>
          📛
        </div>,
      );
    }
  }

  const handleClick = async clickEvent => {
    // ============================================================================ ------------------------------------------------------
    // ============================================================================ ------------------------------------------------------
    // ==========================  click          ================================= ------------------------------------------------------
    // ============================================================================ ------------------------------------------------------
    // ============================================================================ ------------------------------------------------------

    const currentTarget = clickEvent.currentTarget;

    console.log("currentTarget", currentTarget);

    const button = currentTarget;
    const circle = document.createElement("div");
    circle.classList.add("ripple");
    button.appendChild(circle);

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    circle.style.width = diameter + "px";
    circle.style.height = diameter + "px";
    circle.style.left = clickEvent.clientX - button.offsetLeft - diameter / 2 + "px";
    circle.style.top = clickEvent.clientY - button.offsetTop - diameter / 2 + "px";

    circle.addEventListener("animationend", function () {
      button.removeChild(circle);
    });

    console.log("CLICK", clickEvent.clientX, clickEvent.clientY);
    console.log("window.screen.width", window.innerWidth, window.innerHeight);
    let mapX = Math.floor((clickEvent.clientX * 65535) / window.innerWidth);
    let mapY = Math.floor((clickEvent.clientY * 65535) / window.innerHeight);

    let userWally = userSigner.connect(localhostProvider);
    console.log("👨‍🏫 connecting to contract as ", userWally);
    const contract = new ethers.Contract(gameContract, Level1.abi, userWally);

    const attemptAction = async action => {
      try {
        let result = await action;
        console.log("result", result);
        console.log("wait:", await result.wait());
      } catch (er) {
        console.log("error", er);
        setErrors([...errors, { x: clickEvent.clientX, y: clickEvent.clientY, error: er, timestamp: Date.now() }]);
      }
    };

    if (!myHouse) {
      console.log("🥩", mapX, mapY);

      await attemptAction(contract.stake(mapX, mapY));

      let blockNumber = await localhostProvider.getBlockNumber();
      console.log("at this point our house should be deployed, let's find it and save it in localstorage");
      let finalVisibleStructures = await loadVisibleStructures(contract, blockNumber);
      for (let i = 0; i < finalVisibleStructures.length; i++) {
        //console.log(finalVisibleStructures[i].args)
        if (
          finalVisibleStructures[i].args.emoji == "⛺️" &&
          finalVisibleStructures[i].args.owner == address &&
          finalVisibleStructures[i].args.x == mapX &&
          finalVisibleStructures[i].args.y == mapY
        ) {
          console.log("🏠 found my house at", finalVisibleStructures[i].args.x, finalVisibleStructures[i].args.y);
          setMyHouseObject({
            x: finalVisibleStructures[i].args.x,
            y: finalVisibleStructures[i].args.y,
            emoji: finalVisibleStructures[i].args.emoji,
            owner: finalVisibleStructures[i].args.owner,
          });
          setMyHouse([mapX, mapY]);
        }
      }
    } else {
      console.log("USER CLICKED AT ", mapX, mapY);
      console.log("already have a house so find the nearest tree and send a truck to it");

      console.log(
        "either you clicked a truck and you want to send it home or you clicked a sturcture to send a truck to",
      );

      //lets search all structures for a truck near the mapx,mapy

      const dist = (x1, y1, x2, y2) => {
        let xDiff = Math.abs(x1 - x2);
        let yDiff = Math.abs(y1 - y2);
        let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        return distance;
      };

      const nearestStructure = (knownStructures, x, y, emoji) => {
        let nearest;
        let nearestDistance = 65535;
        for (let i = 0; i < knownStructures.length; i++) {
          //console.log("rndering structure");
          if (knownStructures[i].args.emoji == emoji) {
            let xDiff = Math.abs(knownStructures[i].args.x - x);
            let yDiff = Math.abs(knownStructures[i].args.y - y);
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
            if (distance < nearestDistance) {
              nearest = knownStructures[i];
              nearestDistance = distance;
              nearest.distance = distance;
            }
          } else {
            //console.log("not a tree",knownStructures[i])
          }
        }
        return nearest;
      };

      const nearestAgent = (knownAgents, x, y, emoji, owner) => {
        let nearest;
        let nearestDistance = 65535;
        for (let i = 0; i < knownAgents.length; i++) {
          //console.log("rndering structure");
          if (knownAgents[i].args.emoji == emoji && knownAgents[i].args.owner == owner) {
            let timePassed = currentTimestamp - knownAgents[i].args.startTime;
            if (knownAgents[i].args.stopAfter > 0 && timePassed > knownAgents[i].args.stopAfter) {
              timePassed = knownAgents[i].args.stopAfter;
            }

            let xOffset = (knownAgents[i].args.dx * timePassed) % 65535;
            let yOffset = (knownAgents[i].args.dy * timePassed) % 65535;

            let xDiff = Math.abs(knownAgents[i].args.x + xOffset - x);
            let yDiff = Math.abs(knownAgents[i].args.y + yOffset - y);
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
            if (distance < nearestDistance) {
              nearest = knownAgents[i];
              nearest.actualLocation = [knownAgents[i].args.x + xOffset, knownAgents[i].args.y + yOffset];
              nearest.distance = distance;
              //nearestTruckId = i
              nearestDistance = distance;
            }
          }
        }
        return nearest;
      };

      const CLICKDISTANCEFUDGE = 800;

      let myHouseId;
      for (let i = 0; i < knownStructures.length; i++) {
        //console.log("rndering structure");
        if (
          knownStructures[i].args.x == myHouse[0] &&
          knownStructures[i].args.y == myHouse[1] &&
          knownStructures[i].args.owner == address
        ) {
          myHouseId = knownStructures[i].args.id;
        }
      }

      console.log("myHouseId", myHouseId);

      if (knownStructures) {
        let nearestCargoTruck = nearestAgent(knownAgents, mapX, mapY, "🚛", address);
        let nearestTruck = nearestAgent(knownAgents, mapX, mapY, "🛻", address);
        let nearestTree = nearestStructure(knownStructures, mapX, mapY, "🌲");
        let theMarket = nearestStructure(knownStructures, mapX, mapY, "🏪");

        console.log("theMarket distance ", theMarket.distance);
        if (nearestCargoTruck?.distance < CLICKDISTANCEFUDGE) {
          console.log("🚛 cargo truck clicked", nearestCargoTruck.args);

          let distanceToMarket = dist(
            nearestCargoTruck.actualLocation[0],
            nearestCargoTruck.actualLocation[1],
            theMarket.args.x,
            theMarket.args.y,
          );

          if (distanceToMarket < 500) {
            //sell cargo
            await attemptAction(contract.sellCargo(nearestCargoTruck.args.id, theMarket.args.id));
          }

          let distanceFromHome = dist(
            nearestCargoTruck.actualLocation[0],
            nearestCargoTruck.actualLocation[1],
            myHouse[0],
            myHouse[1],
          );

          console.log("distanceFromHome", distanceFromHome);

          if (distanceFromHome < 500) {
            console.log("🚛=>🏠 +🪵");
            console.log("collectcollectcollectcollectcollect", nearestCargoTruck.args.id, myHouseId);
            await attemptAction(contract.collectCargoTruck(nearestCargoTruck.args.id, myHouseId));
          } else {
            // go home
            await attemptAction(contract.returnCargoTruckTo(nearestCargoTruck.args.id, myHouse[0], myHouse[1]));
          }
        } else if (theMarket?.distance < CLICKDISTANCEFUDGE) {
          console.log("MARKET CLICKED", theMarket);
          console.log("🚛 🚛🚛 SHIP IT", theMarket.args.id);

          await attemptAction(contract.sendCargoTruckTo(myHouseId, theMarket.args.x, theMarket.args.y));
        } else if (nearestTruck?.distance < CLICKDISTANCEFUDGE) {
          console.log("TRUCK CLICKED", nearestTruck.args.id);
          console.log(nearestTruck);

          let truckCargo = await contract.truckBalanceOfWood(nearestTruck.args.id);
          console.log("truckCargo", truckCargo);

          let distanceFromHome = dist(
            nearestTruck.actualLocation[0],
            nearestTruck.actualLocation[1],
            myHouse[0],
            myHouse[1],
          );

          console.log("distanceFromHome", distanceFromHome);

          if (distanceFromHome < 500) {
            console.log("🛻=>🏠 +🪵");
            console.log("collectcollectcollectcollectcollect", nearestTruck.args.id, myHouseId);
            await attemptAction(contract.collect(nearestTruck.args.id, myHouseId));
          } else {
            console.log("🛻🫡🪚👀 delivery truck is out searching for wood... ");
            console.log("finding nearest tree to harvest");

            let nearestTreeToTruck = nearestStructure(
              knownStructures,
              nearestTruck.actualLocation[0],
              nearestTruck.actualLocation[1],
              "🌲",
            );

            console.log("nearest tree to this truck is ", nearestTreeToTruck);
            if (nearestTreeToTruck?.distance < 300) {
              console.log("Calling HARVEST:", nearestTruck.args.id, nearestTreeToTruck.args.id);
              await attemptAction(contract.harvest(nearestTruck.args.id, nearestTreeToTruck.args.id));
            }

            attemptAction(contract.returnTruckTo(nearestTruck.args.id, myHouse[0], myHouse[1]));
          }
        } else if (nearestTree?.distance < CLICKDISTANCEFUDGE) {
          console.log("TREE CLICKED");

          await attemptAction(contract.sendTruckTo(myHouseId, nearestTree.args.x, nearestTree.args.y));
        } else {
          console.log("☁️ ☁️ ☁️ CANT FIND A TREE NEARBY ☁️ ☁️ ☁️ ");
        }
      }
    }
  };

  return (
    <div>
      {errorRender}
      <div
        style={{ position: "absolute", left: 0, top: 100, width: "250", height: "250", zIndex: 99 }}
        onClick={() => {
          console.log("🫡 clearing local storage");
          setGameContract("");
          setMyHouseObject(null);
          setMyHouse(null);
          window.history.replaceState(null, "LOADING...", "/");
        }}
      >
        🫡
      </div>
      <div
        style={{ position: "absolute", left: 20, top: 0, width: "25", height: "25", zIndex: 99 }}
        onClick={() => {
          console.log("🛰 force deploy");
          doContractDeployment();
          //setGameContract("");
          //setMyHouseObject(null)
        }}
      >
        🛰
      </div>
      <div style={{ margin: "auto", marginTop: "25%", width: 500 }}>
        <div style={{ padding: 16, position: "fixed", bottom: 16, left: 16, zIndex: 5 }}>
          {theState} <Address value={gameContract} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: -1 }}>
        {structureRender}
        {agentRender}
        {/*
        <div style={{ margin: "auto", marginTop: "100%", paddingBottom: 800 }}>
          {gameContract && (
            <Contract
              address={gameContract}
              name="Level1"
              customContract={gameContractObj}
              signer={localhostProvider && localhostProvider.getSigner && localhostProvider.getSigner(0)}
              provider={localhostProvider}
            />
          )}
        </div>
        */}
      </div>
      <div
        id="townRenderThing"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "100%",
          height: "100%",
          opacity: 0.1,
          background: "#666666",
          cursor: "pointer",
        }}
        onTouchStart={async e => {
          ///prevent default:
          e.preventDefault();
          handleClick(e);
        }}
        onClick={handleClick}
      ></div>
    </div>
  );
}
