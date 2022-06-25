import { numToBytes32 } from "@chainlink/test-helpers/dist/src/helpers"
import { assert, expect } from "chai"
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers"
import { network, deployments, ethers, run } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { APIConsumer, LinkToken, MockOracle } from "../../typechain"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("APIConsumer Unit Tests", async function () {
      let apiConsumer: APIConsumer
      let linkToken: LinkToken
      let mockOracle: MockOracle

      beforeEach(async () => {
        await deployments.fixture(["mocks", "api"])
        linkToken = await ethers.getContract("LinkToken")
        const linkTokenAddress: string = linkToken.address
        apiConsumer = await ethers.getContract("APIConsumer")
        mockOracle = await ethers.getContract("MockOracle")

        await run("fund-link", { contract: apiConsumer.address, linkaddress: linkTokenAddress })
      })

      it(`Should successfully make an API request`, async () => {
        await expect(apiConsumer.requestVolumeData()).to.emit(apiConsumer, "ChainlinkRequested")
      })

      it("Should successfully make an API request and get a result", async () => {
        const transaction: ContractTransaction = await apiConsumer.requestVolumeData()
        const transactionReceipt: ContractReceipt = await transaction.wait(1)
        if (!transactionReceipt.events) return
        const requestId: string = transactionReceipt.events[0].topics[1]
        const callbackValue: number = 777
        await mockOracle.fulfillOracleRequest(requestId, numToBytes32(callbackValue))
        const volume: BigNumber = await apiConsumer.volume()
        assert.equal(volume.toString(), callbackValue.toString())
      })

      it("Our event should successfully fire event on callback", async () => {
        const callbackValue: number = 777
        // we setup a promise so we can wait for our callback from the `once` function
        await new Promise(async (resolve, reject) => {
          // setup listener for our event
          apiConsumer.once("DataFullfilled", async () => {
            console.log("DataFullfilled event fired!")
            const volume: BigNumber = await apiConsumer.volume()
            // assert throws an error if it fails, so we need to wrap
            // it in a try/catch so that the promise returns event
            // if it fails.
            try {
              assert.equal(volume.toString(), callbackValue.toString())
              resolve(true)
            } catch (e) {
              reject(e)
            }
          })
          const transaction: ContractTransaction = await apiConsumer.requestVolumeData()
          const transactionReceipt: ContractReceipt = await transaction.wait(1)
          if (!transactionReceipt.events) return
          const requestId = transactionReceipt.events[0].topics[1]
          await mockOracle.fulfillOracleRequest(requestId, numToBytes32(callbackValue))
        })
      })
    })
