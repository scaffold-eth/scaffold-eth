import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"

task("block-number", "Prints the current block number").setAction(
  async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    await hre.ethers.provider.getBlockNumber().then((blockNumber: number) => {
      console.log(`Current block number: ${blockNumber}`)
    })
  }
)
