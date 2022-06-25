import { assert } from "chai"
import { BigNumber } from "ethers"
import { deployments, network, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { MockV3Aggregator, PriceConsumerV3 } from "../../typechain"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("PriceConsumer Unit Tests", async function () {
      // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
      let priceConsumerV3: PriceConsumerV3
      let mockV3Aggregator: MockV3Aggregator

      beforeEach(async () => {
        await deployments.fixture(["mocks", "feed"])
        priceConsumerV3 = await ethers.getContract("PriceConsumerV3")
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
      })

      describe("constructor", () => {
        it("sets the aggregator addresses correctly", async () => {
          const response: string = await priceConsumerV3.getPriceFeed()
          assert.equal(response, mockV3Aggregator.address)
        })
      })

      describe("getLatestPrice", () => {
        it("should return the same value as the mock", async () => {
          const priceConsumerResult: BigNumber = await priceConsumerV3.getLatestPrice()
          const priceFeedResult: BigNumber = (await mockV3Aggregator.latestRoundData()).answer
          assert.equal(priceConsumerResult.toString(), priceFeedResult.toString())
        })
      })
    })
