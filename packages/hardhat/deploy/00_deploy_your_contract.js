const axios = require( 'axios')

// deploy/00_deploy_your_contract.js

async function getGsnNetwork(chainId) {
  if ( chainId == 31337 ) {
    return  {
      Forwarder: require( '../build/gsn/Forwarder').address,
      Paymaster: require( '../build/gsn/Paymaster').address
    }
  }
  const gsnNetworks = await axios.get('https://opengsn.github.io/gsn-networks/gsn-networks.json')
  if ( !gsnNetworks.data ) {
    throw new Error( 'unable to fetch GSN networks '+(gsnNetworks.error || gsnNetworks))
  }
  const gsnNetwork = gsnNetworks.data.networks[chainId]
  if ( !gsnNetwork ){
    throw new Error( 'GSN is not deployed on network '+chainId)
  }

  return gsnNetwork
}

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { Forwarder } = await getGsnNetwork(await getChainId())

  await deploy("YourContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [Forwarder],
    log: true,
  });

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");
    
    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */
};
module.exports.tags = ["YourContract"];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
