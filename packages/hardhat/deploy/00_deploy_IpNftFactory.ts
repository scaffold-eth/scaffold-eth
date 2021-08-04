import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // if (hre.network.name === "matic" || hre.network.name === "mumbai")
  //   console.log(
  //     `Deploying ProtectionResolver to ${hre.network.name}. Hit ctrl + c to abort`
  //   );
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const contract = await deploy("IpNftFactory", {
    from: deployer,
    log: true
  });
};

export default func;
func.id = "deploy_ip_nft_factory"; // id required to prevent reexecution
func.tags = ["IpNftFactory"];
