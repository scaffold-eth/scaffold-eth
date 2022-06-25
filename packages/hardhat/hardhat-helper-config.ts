import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { network } from "hardhat";
import { ExtendedArtifact } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

//For timeLock
export const MIN_DELAY = 3600;
export const PROPOSERS = [];
export const EXECUTIONERS = [];

//For Governor Contract
export const VOTING_DELAY = 1;
export const VOTING_PERIOD = 66;
export const QUORUM_PERCENTAGE = 4;

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const PROPOSAL_FILE = "proposals.json";

export const PROPOSAL1 = {
  args: ["Deal1", ethers.utils.parseUnits("1000000", 1)],
  proposalDesc: "Proposal to create Lease 1",
  functionToCall: "createOilContract",
  value: [0],
};

export const moveBlocks = async (moves: number) => {
  for (let i = 0; i < moves; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`moved ${moves} blocks`);
};
export const moveTime = async (seconds: number) => {
  await network.provider.send("evm_increaseTime", [seconds]);
  console.log(`moving time forward ${seconds} seconds`);
};

//function takes string returns obj {contract, artifact}
//obj will have address and artifact filds
//will get contract factory, get artifact, deploy, with args
export const getArtifactAndFactory = async (hre: HardhatRuntimeEnvironment, contractName: string) => {
  const { deployments } = hre;
  const { getExtendedArtifact } = deployments;
  const { getContractFactory } = ethers;
  const artifact = await getExtendedArtifact(contractName);
  return {
    artifact,
    [contractName]: (await getContractFactory(contractName)) as ContractFactory,
  };
  /***
   * {
   * constractName: Contract
   * ...artifact
   * }
   */
};
export const devChains = ["hardhat", "localhost"];
