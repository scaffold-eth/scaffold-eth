import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { APIConsumer, APIConsumer__factory } from "../../typechain"
import { BigNumber, constants } from "ethers"

task("read-data", "Calls an API Consumer Contract to read data obtained from an external API")
  .addParam("contract", "The address of the API Consumer contract that you want to call")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const contractAddr: string = taskArgs.contract
    const networkId: string = hre.network.name

    console.log(`Reading data from API Consumer contract ${contractAddr} on network ${networkId}`)

    //Get signer information
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
    const signer: SignerWithAddress = accounts[0]

    const apiConsumerContract: APIConsumer = APIConsumer__factory.connect(contractAddr, signer)

    const result: BigNumber = await apiConsumerContract.volume()
    console.log(`Data is: ${result}`)

    if (
      result == constants.Zero &&
      ["hardhat", "localhost", "ganache"].indexOf(hre.network.name) == 0
    ) {
      console.log("You'll either need to wait another minute, or fix something!")
    }

    if (["hardhat", "localhost", "ganache"].indexOf(hre.network.name) >= 0) {
      console.log("You'll have to manually update the value since you're on a local chain!")
    }
  })
