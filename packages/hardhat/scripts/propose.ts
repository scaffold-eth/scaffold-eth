import { deployments, ethers, network } from "hardhat";
import { devChains, moveBlocks, PROPOSAL1, PROPOSAL_FILE, VOTING_DELAY } from "../hardhat-helper-config";
import * as fs from "fs";
const { args, proposalDesc, functionToCall, value } = PROPOSAL1;
const { get } = deployments;
//IIFE
export default (async (
  functionToCall: string, //"createOilContract"
  args: unknown[], // ["Deal1", ethers.utils.parseEther("100")],
  value: number[], //[0],
  proposalDesc: string //"Proposal to create Lease 1",
) => {
  const Governor = await ethers.getContractAt("Governor", (await get("Governor")).address);
  const PetroStake = await ethers.getContractAt("PetroStake", (await get("PetroStake")).address);
  //function createOilContract(string calldata contractName, uint256 contractValue) external onlyOwner {
  console.log("***logging petrostake Interface ===> ***");
  // ecodedFunctionData takes a string of the function name and an array of the arguments
  const encodedFunctionCall = PetroStake.interface.encodeFunctionData(functionToCall, args);

  //get contractAt returns a contract connected to the first signer returned from "getSigners()"
  const tx = await Governor.propose([PetroStake.address], value, [encodedFunctionCall], proposalDesc);
  const txReceipt = await tx.wait(1);

  const proposalId = txReceipt.events[0].args.proposalId.toString();
  console.log("Proposal ID ===>", proposalId);

  fs.writeFileSync(
    PROPOSAL_FILE,
    JSON.stringify({
      [network.config.chainId!.toString()]: [proposalId],
    })
  );

  if (devChains.includes(network.name)) await moveBlocks(VOTING_DELAY + 1); //jumpingTime if in development
})(functionToCall, args, value, proposalDesc)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
/*
 * 
	function propose(
		address[] memory targets, -the traget contract(s) subject to governance
		uint256[] memory values, - ether send with each contract
		bytes[] memory calldatas, - in those target contracts, what functions are we calling and what args are we passing in
		string memory description - human readable description of what is being proposed
 */
