
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const bank = await ethers.getContract("Bank", deployer);
  await deploy("ClientCounter", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [ bank.address ],
    log: true,
  });
}
module.exports.tags = ["ClientCounter"];
