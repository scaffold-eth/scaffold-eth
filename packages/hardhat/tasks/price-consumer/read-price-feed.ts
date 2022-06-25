import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { PriceConsumerV3, PriceConsumerV3__factory } from "../../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"

task("read-price-feed", "Gets the latest price from a Chainlink Price Feed")
  .addParam("contract", "The address of the Price Feed consumer contract that you want to read")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const contractAddr: string = taskArgs.contract
    const networkId: string = hre.network.name

    console.log(
      `Reading data from Price Feed consumer contract ${contractAddr} on network ${networkId}`
    )

    //Get signer information
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
    const signer: SignerWithAddress = accounts[0]

    const priceFeedConsumerContract: PriceConsumerV3 = PriceConsumerV3__factory.connect(
      contractAddr,
      signer
    )

    const price: BigNumber = await priceFeedConsumerContract.getLatestPrice()
    console.log(`Price is ${price.toString()}`)
  })
