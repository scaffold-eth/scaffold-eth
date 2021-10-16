// deploy/00_deploy_your_contract.js

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("../tokens.json");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("Merkler", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  /*

  const Merkler = await ethers.getContract("Merkler");

  function hashToken(index, account, amount) {
    return Buffer.from(
      ethers.utils
        .solidityKeccak256(
          ["uint256", "address", "uint256"],
          [index, account, amount]
        )
        .slice(2),
      "hex"
    );
  }

  const merkleTree = new MerkleTree(
    Object.entries(tokens).map((token, index) => hashToken(index, ...token)),
    keccak256,
    { sortPairs: true }
  );

  console.log(merkleTree.getHexRoot());

  const initializerTx = await Merkler.initializeEthMerkler(
    merkleTree.getHexRoot(),
    "0x60Ca282757BA67f3aDbF21F3ba2eBe4Ab3eb01fc",
    "1",
    "0x0",
    {
      value: ethers.utils.parseEther("6"),
    }
  );

  for (const claim of Object.entries(tokens).entries()) {
    const proof = merkleTree.getHexProof(
      hashToken(claim[0], claim[1][0], claim[1][1])
    );
    console.log(claim[0], claim[1][0], claim[1][1], proof);
    const claimTx = await Merkler.redeem(
      claim[0],
      claim[1][0],
      claim[1][1],
      proof
    );
    console.log(`claimed ${claim[1][0]} for ${claim[1][1]}`);
    console.log(claimTx);
  }
  */
};
module.exports.tags = ["YourContract"];
