import { assert, expect } from "chai"
import { BigNumber } from "ethers"
import { network, deployments, ethers } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { RandomNumberConsumerV2, VRFCoordinatorV2Mock } from "../../typechain"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomNumberConsumer Unit Tests", async function () {
      let randomNumberConsumerV2: RandomNumberConsumerV2
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock

      beforeEach(async () => {
        await deployments.fixture(["mocks", "vrf"])
        randomNumberConsumerV2 = await ethers.getContract("RandomNumberConsumerV2")
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
      })

      it("Should successfully request a random number", async () => {
        await expect(randomNumberConsumerV2.requestRandomWords()).to.emit(
          vrfCoordinatorV2Mock,
          "RandomWordsRequested"
        )
      })

      it("Should successfully request a random number and get a result", async () => {
        await randomNumberConsumerV2.requestRandomWords()
        const requestId: BigNumber = await randomNumberConsumerV2.s_requestId()

        // simulate callback from the oracle network
        await expect(
          vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)
        ).to.emit(randomNumberConsumerV2, "ReturnedRandomness")

        const firstRandomNumber: BigNumber = await randomNumberConsumerV2.s_randomWords(0)
        const secondRandomNumber: BigNumber = await randomNumberConsumerV2.s_randomWords(1)

        assert(
          firstRandomNumber.gt(ethers.constants.Zero),
          "First random number is greather than zero"
        )

        assert(
          secondRandomNumber.gt(ethers.constants.Zero),
          "Second random number is greather than zero"
        )
      })

      it("Should successfully fire event on callback", async function () {
        await new Promise(async (resolve, reject) => {
          randomNumberConsumerV2.once("ReturnedRandomness", async () => {
            console.log("ReturnedRandomness event fired!")
            const firstRandomNumber: BigNumber = await randomNumberConsumerV2.s_randomWords(0)
            const secondRandomNumber: BigNumber = await randomNumberConsumerV2.s_randomWords(1)
            // assert throws an error if it fails, so we need to wrap
            // it in a try/catch so that the promise returns event
            // if it fails.
            try {
              assert(firstRandomNumber.gt(ethers.constants.Zero))
              assert(secondRandomNumber.gt(ethers.constants.Zero))
              resolve(true)
            } catch (e) {
              reject(e)
            }
          })
          await randomNumberConsumerV2.requestRandomWords()
          const requestId: BigNumber = await randomNumberConsumerV2.s_requestId()
          vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)
        })
      })
    })
