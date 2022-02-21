// deploy/00_deploy_your_contract.js

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("YourContract", {
    from: deployer,
    log: true,
    waitConfirmations: 5
  });
};
module.exports.tags = ["YourContract"];
