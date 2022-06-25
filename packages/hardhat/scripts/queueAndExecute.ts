import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { deployments, ethers, network } from "hardhat";
import { devChains, MIN_DELAY, moveBlocks, moveTime, PROPOSAL1 } from "../hardhat-helper-config";
const { get } = deployments;

/**
 * @dev Heart of decentralized governance, programically enforce time restraints,
 * and call createOilContract on the PetroStake Contract
 */
export default (async () => {
  const { functionToCall, args, proposalDesc, value } = PROPOSAL1;
  const Governor = await ethers.getContractAt("Governor", (await get("Governor")).address);
  const PetroStake = await ethers.getContractAt("PetroStake", (await get("PetroStake")).address);
  const encodedFuncCall = PetroStake.interface.encodeFunctionData(functionToCall, args);
  // Gov.queue takes a bytes32descriptionsHash, we convert string to bytes before converting to hash
  const descHash = keccak256(toUtf8Bytes(proposalDesc));
  const descHash2 = ethers.utils.id(proposalDesc);

  console.log("Queueing");
  const txQueue = await Governor.queue([PetroStake.address], value, [encodedFuncCall], descHash);
  await txQueue.wait(1);
  //moves time beyond the minDelay to execute the function
  if (devChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }
  console.log("executing");
  const txExecute = await Governor.execute([PetroStake.address], value, [encodedFuncCall], descHash);
  const exTxReceipt = await txExecute.wait(1);
  //if no error, this if statement should be removed
  const oilContractIds = ethers.utils.formatUnits(await PetroStake.getContractIds(), 0);
  console.log("OilContract added to contract", oilContractIds);
})()
  .then(() => process.exit(1))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
/***
    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public payable virtual override returns (uint256) {

 * function queue(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public virtual override returns (uint256) {
        emit ProposalQueued(proposalId, block.timestamp + delay);
        return proposalId;
    }
 */
