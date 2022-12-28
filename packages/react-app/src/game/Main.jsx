import React, { useCallback, useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { ethers } from "ethers";
import { getRPCPollTime, Transactor, Web3ModalSetup } from "../helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useUserProviderAndSigner,
  usePoller,
} from "eth-hooks";

import {
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

import { GameLoop } from ".";

import { useLocalStorage } from "../hooks";
import { ConsoleSqlOutlined } from "@ant-design/icons";

export default function Main({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  setShowLocalWallet,
  readContracts,
  contractConfig,
  YourContract,
  setSelectedNetwork,
}) {
  const { currentTheme } = useThemeSwitcher();

  const [localhostProvider, setlocalhostProvider] = useState();
  const [found, setFound] = useState(false);
  useEffect(() => {
    console.log("useEffect");
    try {
      let newprovider = new ethers.providers.JsonRpcProvider("http://localhost:8545/");
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
  const [agentRender, setAgentRender] = useState([]);

  const [gameContract, setGameContract] = useLocalStorage("gameContract");

  const [gameContractObj, setGameContractObj] = useState();

  usePoller(() => {
    console.log("POLLER!");
    const doCheck = async () => {
      console.log("DOCHEKC!!");
      console.log("localhostProvider", localhostProvider);
      if (localhostProvider) {
        try {
          let blockNumber = await localhostProvider.getBlockNumber();
          console.log("blockNumber", blockNumber);
          setFound(true);

          //triggering a transaction to make timestamps work better
          let faucetTx = Transactor(localhostProvider, null, null, true);
          faucetTx({
            to: "0x0000000000000000000000000000000000000000",
            value: 0,
          });

          const timestamp = (await localhostProvider.getBlock(blockNumber)).timestamp;
          console.log("timestamp", timestamp);

          if (!gameContract) {
            console.log("🧘‍♂️ DEPLOYING");

            //console.log("GET BYTECOE AND INTEFARECE FROM ",contractConfig.deployedContracts['31337'].localhost.contracts.YourContract)
            //console.log("MAYBE FROM ",readContracts)
            //console.log("or even ",YourContract)

            let deployer = new ethers.ContractFactory(
              YourContract.abi,
              YourContract.bytecode,
              localhostProvider.getSigner(0),
            );
            console.log("deployer", deployer);

            let result = await deployer.deploy();

            console.log("result", result);
            if (result && result.address) {
              setGameContract(result.address);
              const contract = new ethers.Contract(result.address, YourContract.abi, localhostProvider.getSigner(0));

              setGameContractObj(contract);

              await (await contract.agent(30000, 30000, -40, 0, "🚜", 300)).wait();
              await (await contract.agent(30000, 31000, -120, 0, "🏎", 0)).wait();

              await (await contract.structure(8000, 31000, "🏠")).wait();
              await (await contract.structure(8000, 30000, "🏚")).wait();
            }
          } else {
            console.log("🥊 gameContract", gameContract);

            //const contractAddress = readContracts["YourContract"].address
            //const contractabi = contractConfig.deployedContracts['31337'].localhost.contracts.YourContract.abi

            const contract = new ethers.Contract(gameContract, YourContract.abi, localhostProvider);
            if (!gameContractObj) setGameContractObj(contract);
            //console.log("contract", contract)

            const Structures = await contract.queryFilter(
              { topics: [ethers.utils.id("Structure(address,uint16,uint16,string)")] },
              0,
              blockNumber,
            );

            console.log("Structures", Structures.length);
            let structureRenderUpdate = [];
            for (let i = 0; i < Structures.length; i++) {
              console.log("rndering structure");
              let xPercent = (Structures[i].args.x * 100) / 65535;
              let yPercent = (Structures[i].args.y * 100) / 65535;
              structureRenderUpdate.push(
                <div id={"structure" + i} style={{ position: "absolute", left: xPercent + "%", top: yPercent + "%" }}>
                  {Structures[i].args.emoji}
                </div>,
              );
            }
            setStructureRender(structureRenderUpdate);

            const Agents = await contract.queryFilter(
              { topics: [ethers.utils.id("Agent(address,uint16,uint16,int8,int8,string,uint64,uint64)")] },
              0,
              blockNumber,
            );

            console.log("Agents", Agents);
            let agentRenderUpdate = [];
            for (let i = 0; i < Agents.length; i++) {
              console.log("rndering agent");

              let timePassed = timestamp - Agents[i].args.startTime;
              if (Agents[i].args.stopAfter > 0 && timePassed > Agents[i].args.stopAfter)
                timePassed = Agents[i].args.stopAfter;

              let xOffset = (Agents[i].args.dx * timePassed) % 65535;
              let yOffset = (Agents[i].args.dy * timePassed) % 65535;

              let absoluteY = Agents[i].args.y + yOffset;
              if (absoluteY < 0) absoluteY = 65535 + absoluteY;

              let absoluteX = Agents[i].args.x + xOffset;
              if (absoluteX < 0) absoluteX = 65535 + absoluteX;

              let xPercent = (absoluteX * 100) / 65535;
              let yPercent = (absoluteY * 100) / 65535;

              console.log("RENDER AT", xPercent, yPercent);

              agentRenderUpdate.push(
                <div
                  id={"agent" + i}
                  style={{
                    position: "absolute",
                    left: xPercent + "%",
                    top: yPercent + "%" /*,transform:"scaleX(-1)"*/,
                  }}
                >
                  {Agents[i].args.emoji}
                </div>,
              );
            }
            setAgentRender(agentRenderUpdate);

            GameLoop({
              provider: localhostProvider,
              address,
              setTheState,
            });
          }

          setShowLocalWallet(true);
          setSelectedNetwork("localhost");
        } catch (e) {
          setGameContract("");
          setGameContractObj(null);
          setStructureRender([]);
          setAgentRender([]);
          setShowLocalWallet(false);
          console.log(e);
          setFound(false);
          setTheState("📡 connecting again...");
          setSelectedNetwork("mainnet");
        }
      }
    };

    if (true) doCheck();
  }, 2500);

  console.log("gameContractObj", gameContractObj);

  return (
    <div>
      <div
        style={{ position: "absolute", left: 0, top: 0, width: "25", height: "25", zIndex: 2 }}
        onClick={() => {
          setGameContract("");
        }}
      >
        🫡
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: -1 }}>
        {structureRender}
        {agentRender}
        <div style={{ margin: "auto", marginTop: "25%", width: 500 }}>
          <div style={{ padding: 16, position: "fixed", bottom: 16, left: 16 }}>{theState}</div>
        </div>
        <div style={{ margin: "auto", marginTop: "100%", paddingBottom: 800 }}>
          {gameContract && (
            <Contract
              address={gameContract}
              name="YourContract"
              customContract={gameContractObj}
              signer={localhostProvider && localhostProvider.getSigner && localhostProvider.getSigner(0)}
              provider={localhostProvider}
            />
          )}
        </div>
      </div>
    </div>
  );
}
