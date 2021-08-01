import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer, simpleERC20Beneficiary } = await getNamedAccounts();
  await deploy("IpNftFactory", {
    from: deployer,
    log: true,
  });
  // code here
};
export default func;
