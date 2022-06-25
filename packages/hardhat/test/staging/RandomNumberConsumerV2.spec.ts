import { developmentChains } from "../../helper-hardhat-config"
import { network, ethers } from "hardhat"
import { RandomNumberConsumerV2 } from "../../typechain"
import { assert } from "chai"
import { BigNumber, constants } from "ethers"

developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomNumberConsumer Staging Tests", async function () {
      let randomNumberConsumerV2: RandomNumberConsumerV2

      beforeEach(async () => {
        randomNumberConsumerV2 = await ethers.getContract("RandomNumberConsumerV2")
      })

      afterEach(async function () {
        randomNumberConsumerV2.removeAllListeners()
      })

      // We can't use an arrow functions here because we need to use `this`. So we need
      // to use `async function() {` as seen.
      it("Our event should successfully fire event on callback", async function () {
        this.timeout(300000) // wait 300 seconds max
        // we setup a promise so we can wait for our callback from the `once` function
        await new Promise(async (resolve, reject) => {
          // setup listener for our event
          randomNumberConsumerV2.once("ReturnedRandomness", async () => {
            console.log("ReturnedRandomness event fired!")
            const firstRandomNumber: BigNumber = await randomNumberConsumerV2.s_randomWords(0)
            const secondRandomNumber: BigNumber = await randomNumberConsumerV2.s_randomWords(1)
            // assert throws an error if it fails, so we need to wrap
            // it in a try/catch so that the promise returns event
            // if it fails.
            try {
              assert(
                firstRandomNumber.gt(constants.Zero),
                "First random number is greather than zero"
              )
              assert(
                secondRandomNumber.gt(constants.Zero),
                "Second random number is greather than zero"
              )
              resolve(true)
            } catch (e) {
              reject(e)
            }
          })

          await randomNumberConsumerV2.requestRandomWords()
        })
      })
    })
