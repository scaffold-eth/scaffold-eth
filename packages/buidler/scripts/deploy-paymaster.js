const fs = require('fs');
const chalk = require('chalk');
const bre = require("@nomiclabs/buidler");
/*
 redeploy NiftyMediator, update NiftyRegistry and reset the mediatorContractOnOtherSide on NiftyMain
 */
async function main() {
  console.log("📡 Deploy \n")

  console.log("🪐 DEPLOYING ON NETWORK: ",bre.network.name)

  if(bre.network.name.indexOf("xdai")>=0){
    //const Liker = await deploy("Liker")
    //const NiftyRegistry = await deploy("NiftyRegistry")
    //const NiftyInk = await deploy("NiftyInk")
    //const NiftyToken = await deploy("NiftyToken")
    //const NiftyMediator = await deploy("NiftyMediator")

    console.log("💽Loading contracts that are already deployed...")
    const Liker = await ethers.getContractAt("Liker","0xBD0621dcb64e1EEd503f709422b019B2fA197aF6")
    const NiftyRegistry = await ethers.getContractAt("NiftyRegistry","0x63d6151DC9aAf6AD66DfFc42ad1eA65A6a2EFC68")
    const NiftyInk = await ethers.getContractAt("NiftyInk","0x49dE55fbA08af88f55EB797a456fdf76B151c8b0")
    const NiftyToken = await ethers.getContractAt("NiftyToken","0xCF964c89f509a8c0Ac36391c5460dF94B91daba5")
    const NiftyMediator = await ethers.getContractAt("NiftyMediator","0x73cA9C4e72fF109259cf7374F038faf950949C51")

    let trustedForwarder = "0xb851b09efe4a5021e9a4ecddbc5d9c9ce2640ccb"

    const SimplePaymaster = await deploy("SimplePaymaster")

    console.log("setting relay hub")
    await SimplePaymaster.setRelayHub("0x63DD60B79cb8E3d2FA20A6d2EC92e101553a3920")

    console.log("setting target addresses")
    await SimplePaymaster.setTarget(NiftyInk.address, true)
    await SimplePaymaster.setTarget(NiftyToken.address, true)
    await SimplePaymaster.setTarget(Liker.address, true)

    console.log("setting trusted forwarder")
    await SimplePaymaster.setTrustedForwarder(trustedForwarder)

  }

}
main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});


async function deploy(name,_args){
  let args = []
  if(_args){
    args = _args
  }
  console.log("📄 "+name)
  const contractArtifacts = artifacts.require(name);
  //console.log("contractArtifacts",contractArtifacts)
  //console.log("args",args)

  const promise =  contractArtifacts.new(...args)


  promise.on("error",(e)=>{console.log("ERROR:",e)})


  let contract = await promise


  console.log(chalk.cyan(name),"deployed to:", chalk.magenta(contract.address));
  fs.writeFileSync("artifacts/"+name+".address",contract.address);
  console.log("\n")
  return contract;
}
