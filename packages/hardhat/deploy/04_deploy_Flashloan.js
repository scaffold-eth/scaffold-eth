

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

    const flashloanArb = await deploy("ArbitrageFlashLoan", {
        // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
        from: deployer,
        args: ["0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"],
        log: true,
    });

    // if deploying on buildbear node print explorer link
    console.log(
        "Checkout Lending at: ",
        `https://explorer.${BASE_URL}/${bbNode.nodeId}/address/${flashloanArb.address}`
    );

};

module.exports.tags = ["ArbitrageFlashLoan"];
