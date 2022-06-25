import * as fs from "fs";
import { deployments, ethers, network } from "hardhat";
import { devChains, moveBlocks, PROPOSAL_FILE, VOTING_PERIOD } from "../hardhat-helper-config";
const { get } = deployments;
const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
const proposalId = proposals[network.config.chainId!][0];
//IIFE
export default (async (proposalId: string) => {
  // 0= Agaist, 1= For, 2= Abstain (for example)
  const voteChoice = 1;
  const Governor = await ethers.getContractAt("Governor", (await get("Governor")).address);
  const voteTx = await Governor.castVoteWithReason(proposalId, voteChoice, "Contract available");
  const voteReceipt = await voteTx.wait(1);

  let proposalState = await Governor.state(proposalId);
  console.log("Current Propsal State Before Voting Period Over: ", proposalState);
  //while on devChains, move blocks to end voting period
  if (devChains.includes(network.name)) await moveBlocks(VOTING_PERIOD + 1);
  proposalState = await Governor.state(proposalId);
  console.log("Current Propsal State AFTER Voting: ", proposalState);
})(proposalId)
  .then(() => process.exit(1))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
