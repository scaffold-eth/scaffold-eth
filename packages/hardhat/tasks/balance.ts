import { ethers, BigNumber, utils } from "ethers"
import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"

const jsonRpcProvider = process.env.ALCHEMY_MAINNET_RPC_URL // https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider
const provider = ethers.getDefaultProvider(jsonRpcProvider)

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs: TaskArguments): Promise<void> => {
    const account: string = utils.getAddress(taskArgs.account)
    const balance: BigNumber = await provider.getBalance(account)

    console.log(`${utils.formatEther(balance)} ETH`)
  })
