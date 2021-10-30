// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const TO_ADDRESS = "0x0108a0A68916FCa2659A2746315D5D81a42E1be1";

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("QuadraticDiplomacyContract", {
    from: deployer,
    log: true,
    args: [TO_ADDRESS],
  });

  /*
    // Test data
    const QuadraticDiplomacyContract = await ethers.getContract(
      "QuadraticDiplomacyContract",
      deployer
    );

    const names = ["Carlos", "Austin", "Ryan"];
    const wallets = [
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    ];
    const amounts = [90, 9, 1];

    await QuadraticDiplomacyContract.addMember(names[0], wallets[0]);
    await QuadraticDiplomacyContract.addMember(names[1], wallets[1]);
    await QuadraticDiplomacyContract.addMember(names[2], wallets[2]);

    await QuadraticDiplomacyContract.giveVotes(TO_ADDRESS, 100);
    await QuadraticDiplomacyContract.giveVotes(deployer, 100);
    await QuadraticDiplomacyContract.voteMultiple(names, wallets, amounts);
  */

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");

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
module.exports.tags = ["QuadraticDiplomacyContract"];
