// deploy/00_deploy_your_contract.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("NextJSTicket", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["NextJSTicket"];
