import { assert, expect } from "chai"
import { BigNumber } from "ethers"
import { deployments, network, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { KeepersCounter } from "../../typechain"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Keepers Counter Unit Tests", async function () {
      let counter: KeepersCounter

      beforeEach(async () => {
        await deployments.fixture(["mocks", "keepers"])
        counter = await ethers.getContract("KeepersCounter")
      })

      it("should be able to call checkUpkeep", async () => {
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
        const { upkeepNeeded } = await counter.callStatic.checkUpkeep(checkData)
        assert.equal(upkeepNeeded, false)
      })

      it("should not be able to call perform upkeep without the time passed interval", async () => {
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
        await expect(counter.performUpkeep(checkData)).to.be.revertedWith("Time interval not met")
      })

      it("should be able to call performUpkeep after time passes", async () => {
        const startingCount: BigNumber = await counter.counter()
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
        const interval: BigNumber = await counter.interval()
        await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
        await counter.performUpkeep(checkData)
        assert.equal(startingCount.toNumber() + 1, (await counter.counter()).toNumber())
      })
    })
