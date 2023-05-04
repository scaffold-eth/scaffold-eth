// deploy/00_deploy_your_contract.js

const fs = require("fs");
const path = require("path");

let bbNode;
try {
    bbNode = JSON.parse(
        fs
            .readFileSync(path.join(__dirname, "../../buildbear/nodes.json"))
            .toString()
            .trim()
    );
} catch (e) {
    console.log("No buildbear node found");
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { BASE_URL } = await import("../../buildbear/constants.mjs");
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("Balloons", {
        // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
        from: deployer,
        // args: [ "Hello", ethers.utils.parseEther("1.5") ],
        log: true,
    });

    const balloons = await ethers.getContract("Balloons", deployer);

    await deploy("DEX", {
        // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
        from: deployer,
        args: [balloons.address],
        log: true,

    });

    const dex = await ethers.getContract("DEX", deployer);

    // paste in your front-end address here to get 10 balloons on deploy:
    await balloons.transfer(
        "0x7030f4D0dC092449E4868c8DDc9bc00a14C9f561",
        "" + 100 * 10 ** 18
    );

    // uncomment to init DEX on deploy:
    console.log(
        "Approving DEX (" + dex.address + ") to take Balloons from main account..."
    );
    // If you are going to the testnet make sure your deployer account has enough ETH
    await balloons.approve(dex.address, ethers.utils.parseEther("100"));
    console.log("INIT exchange...");
    await dex.init(ethers.utils.parseEther("2"), {
        value: ethers.utils.parseEther("2"),
        gasLimit: 200000,
    });
};

module.exports.tags = ["Balloons", "DEX"];
