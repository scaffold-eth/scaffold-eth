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

  const Merkler = await ethers.getContract("Merkler");

  console.log(Merkler);

  function hashToken(account, amount) {
    return Buffer.from(
      ethers.utils
        .solidityKeccak256(["address", "uint256"], [account, amount])
        .slice(2),
      "hex"
    );
  }

  const merkleTree = new MerkleTree(
    Object.entries(tokens).map((token) => hashToken(...token)),
    keccak256,
    { sortPairs: true }
  );

  console.log(merkleTree.getHexRoot());

  await Merkler.initializeEthMerkler(
    merkleTree.getHexRoot(),
    "0x60Ca282757BA67f3aDbF21F3ba2eBe4Ab3eb01fc",
    "1",
    {
      value: ethers.utils.parseEther("6"),
    }
  );

  for (const [account, amount] of Object.entries(tokens)) {
    const proof = merkleTree.getHexProof(hashToken(account, amount));
    console.log(account, amount, proof);
    /**
     * Redeems token using merkle proof (anyone with the proof)
     */
    //await Merkler.redeem(account, amount, proof);
    //console.log(`redeemed for ${account}`);
  }

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");

    To take ownership of yourContract using the ownable library uncomment next line and add the
    address you want to be the owner.
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = ["YourContract"];
