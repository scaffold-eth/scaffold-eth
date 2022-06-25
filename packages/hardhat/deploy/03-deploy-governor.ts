import { HardhatRuntimeEnvironment } from "hardhat/types";
import { log, time } from "console";
import { ethers, upgrades } from "hardhat";
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  getArtifactAndFactory,
} from "../hardhat-helper-config";
import { ContractFactory } from "ethers";
import { ExtendedArtifact } from "hardhat-deploy/dist/types";

/***
 * @dev deployGovernor deploys upgradable governor contract,
 * assigns role of proposer to Governor contract addres, allows any address to be executor
 * revokes role of deployer as ADMIN
 */
const deployGovernor = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deployer } = await getNamedAccounts();
  const { get, save } = deployments;

  const [timeLock, govToken] = await Promise.all([get("TimeLock"), get("GovToken")]);
  const TimeLock = await ethers.getContractAt("TimeLock", timeLock.address);

  log("Deploying Governor proxy and Implementation contract");

  const ARGS: unknown[] = [
    govToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];
  const { Governor, artifact } = await getArtifactAndFactory(hre, "Governor");
  const governor = await upgrades.deployProxy(Governor as ContractFactory, ARGS, { kind: "uups" });
  await governor.deployed();

  log("03 - Governor depoyed at :", governor.address);
  log("Setting Up Roles ===>");

  const ADMIN_ROLE = await TimeLock.TIMELOCK_ADMIN_ROLE();
  const PROPOSER_ROLE = await TimeLock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await TimeLock.EXECUTOR_ROLE();
  //const CANCELLER_ROLE = await TimeLock.CANCELLER_ROLE()
  await TimeLock.grantRole(PROPOSER_ROLE, governor.address).then(async (tx: any) => await tx.wait(1));
  await TimeLock.grantRole(EXECUTOR_ROLE, ADDRESS_ZERO).then(async (tx: any) => await tx.wait(1));
  await TimeLock.revokeRole(ADMIN_ROLE, deployer).then(async (tx: any) => await tx.wait(1));

  await save("Governor", {
    address: governor.address,
    ...(artifact as ExtendedArtifact),
  });

  log("Governor contract has Proposer Role :", await TimeLock.hasRole(PROPOSER_ROLE, governor.address));
  log("Deployer contract has admin Role :", await TimeLock.hasRole(ADMIN_ROLE, deployer));
};

deployGovernor.tags = ["Governor"];
deployGovernor.dependencies = ["GovToken", "TimeLock"];

export default deployGovernor;
