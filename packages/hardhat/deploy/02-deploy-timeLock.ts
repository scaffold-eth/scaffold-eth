import { HardhatRuntimeEnvironment } from "hardhat/types";
import { log } from "console";
import { ethers, upgrades } from "hardhat";
import {
  MIN_DELAY,
  PROPOSERS,
  EXECUTIONERS,
  getArtifactAndFactory,
} from "../hardhat-helper-config";
import { DeployFunction, ExtendedArtifact } from "hardhat-deploy/dist/types";
import { ContractFactory } from "ethers";

/***
 * proposers are those that can proposed a governance
 * executers are array of addresses that can execute a successful proposal
 * only governor contract to be proposer, anyone can be executer
 *
 * min delay is peroid of time after a vote has passed,
 * but before execution
 */

const deployTimeLock: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deployer } = await getNamedAccounts();
  const { save } = deployments;

  log("Deploying TimeLock Proxy and Imp contract");
  /****
   * save(name: string, deployment: DeploymentSubmission): Promise<void>; // low level save of deployment
  get(name: string): Promise<Deployment>; // fetch a deployment by name, throw if not existingsave(name: string, deployment: DeploymentSubmission): Promise<void>; // low level save of deployment
   */

  const { TimeLock, artifact } = await getArtifactAndFactory(hre, "TimeLock");
  const ARGS = [MIN_DELAY, PROPOSERS, EXECUTIONERS];
  const timeLock = await upgrades.deployProxy(TimeLock as ContractFactory, ARGS, {
    kind: "uups",
  });
  await timeLock.deployed();

  log("02- TimeLock deployed to :", timeLock.address);
  const ADMIN_ROLE = await timeLock.TIMELOCK_ADMIN_ROLE();
  log("Deployer has admin role: ", await timeLock.hasRole(ADMIN_ROLE, deployer));

  await save("TimeLock", {
    address: timeLock.address,
    ...(artifact as ExtendedArtifact),
  });
};

export default deployTimeLock;
deployTimeLock.tags = ["TimeLock"];
/***
 * 
	function initialize(
		uint256 minDelay,
		address[] memory proposers,
		address[] memory executors
	) external initializer {
		//passing variables to init is the same as passing to the parent contract's constructor
		__UUPSUpgradeable_init();
		__TimelockController_init(minDelay, proposers, executors);
	}

 */
