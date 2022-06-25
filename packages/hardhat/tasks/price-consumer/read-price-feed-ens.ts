import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { MockV3Aggregator, MockV3Aggregator__factory } from "../../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"

type RoundData = {
  roundId: BigNumber
  answer: BigNumber
  startedAt: BigNumber
  updatedAt: BigNumber
  answeredInRound: BigNumber
}

// This script only works with --network 'mainnet', or 'hardhat' when running a fork of mainnet
task("read-price-feed-ens", "Gets the latest price from a Chainlink Price Feed")
  .addParam("pair", "The token pair that you want to read, ie 'btc-usd'")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const ensAddress: string = `${taskArgs.pair}.data.eth`

    console.log(`Reading data from Price Feed consumer contract ${ensAddress}`)

    //Get signer information
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
    const signer: SignerWithAddress = accounts[0]

    const priceFeedConsumerContract: MockV3Aggregator = MockV3Aggregator__factory.connect(
      ensAddress,
      signer
    )

    const data: RoundData = await priceFeedConsumerContract.latestRoundData()

    console.log(`Price is: ${data.answer.toString()}`)
  })
