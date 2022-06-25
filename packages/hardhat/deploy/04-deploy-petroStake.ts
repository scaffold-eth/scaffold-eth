import { log } from "console";
import { ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";
import { DeployFunction, ExtendedArtifact } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getArtifactAndFactory, ADDRESS_ZERO } from "../hardhat-helper-config";

const deployPetro: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  log("Deploying PetroStake Proxy and Imp");
  const { deployments } = hre;
  const { get, save } = deployments;

  const timeLock = await get("TimeLock");
  const ARGS = [
    timeLock.address,
    ADDRESS_ZERO,
    ADDRESS_ZERO,
    ADDRESS_ZERO,
    ethers.utils.parseUnits("3000", 0),
  ];
  const { PetroStake, artifact } = await getArtifactAndFactory(hre, "PetroStake");
  //you can deploy upgradeable contracts linked to external libraries by setting
  //the unsafeAllowLinkedLibraries flag to true in the deployProxy or upgradeProxy calls
  const petroStake = await upgrades.deployProxy(PetroStake as ContractFactory, ARGS, {
    kind: "uups",
  });
  log("4- PetroStake deployed at :", petroStake.address);
  const isTimeLockOWner = timeLock.address == (await petroStake.owner());
  log("owner of Petro stake is now TimeLock Contract: ", isTimeLockOWner);
  //who is owner() of petrostake, timeLock
  //console.log("deployments post mutation:", DEPLOYMENTS);

  await save("PetroStake", {
    address: petroStake.address,
    ...(artifact as ExtendedArtifact),
  });
};
deployPetro.tags = ["PetroStake"];
deployPetro.dependencies = ["TimeLock"];
export default deployPetro;
