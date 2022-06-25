import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { KeepersCounter, KeepersCounter__factory } from "../../typechain"
import { BigNumber } from "ethers"

task(
  "read-keepers-counter",
  "Gets the value of the counter from the Counter contract used to demo Chainlink Keepers"
)
  .addParam("contract", "The address of the Price Feed consumer contract that you want to read")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const contractAddr = taskArgs.contract
    const networkId = hre.network.name

    console.log("Reading counter from Keepers contract ", contractAddr, " on network ", networkId)

    //Get signer information
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
    const signer: SignerWithAddress = accounts[0]

    const keepersCounterContract: KeepersCounter = KeepersCounter__factory.connect(
      contractAddr,
      signer
    )
    const counter: BigNumber = await keepersCounterContract.counter()

    console.log(`Counter is: ${counter.toString()}`)
  })
