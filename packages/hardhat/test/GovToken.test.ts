import { expect } from "chai";
import { timeLog } from "console";
import { formatEther } from "ethers/lib/utils";
import { upgrades, ethers } from "hardhat";
import { MIN_DELAY } from "../hardhat-helper-config";
import { setup } from "./utils/setup";

describe("Deployments", () => {
  describe("Govtoken", () => {
    it("Mint 1 million tokens to deployer", async () => {
      const { GovToken, signers } = await setup();
      const deployer = signers[0];
      //should delegate to deployer
      //should mint to deployer
      const deployerBalance = await GovToken.balanceOf(deployer.address);
      expect(formatEther(deployerBalance)).to.equal("1000000.0");
    });
    it("Give deployer voting rights of a delegator", async () => {
      const { GovToken, signers } = await setup();
      const deployer = signers[0];
      const delegateAddress = await GovToken.delegates(deployer.address);
      expect(delegateAddress).to.equal(deployer.address);
    });
  });
  /**
       * 
       minDelay 3600, proposers, none, executors none
    function getMinDelay() public view virtual returns (uint256 duration) {
    }
       */
});
describe("TimeLock Contract", () => {
  it("Sets min delay to 3600", async () => {
    const { TimeLock, signers } = await setup();
    const currentMinDelay = await TimeLock.getMinDelay();
    expect(currentMinDelay).to.equal(MIN_DELAY);
  });
});
/**
     * 
    it("", async ()=>{
    
    })
     */
