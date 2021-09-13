module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const exampleExternalContract = await deployments.get("ExampleExternalContract");
  await deploy("Staker", {
    from: deployer,
    args: [exampleExternalContract.address],
    log: true,
  });
}

module.exports.tags = ["Staker"];
