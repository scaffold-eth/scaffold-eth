// deploy/00_deploy_tokendistributor_contract.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("TokenDistributor", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["TokenDistributor"];
