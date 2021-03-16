const fs = require('fs');
const chalk = require('chalk');
const bre = require("@nomiclabs/buidler");
/*
 redeploy NiftyMediator, update NiftyRegistry and reset the mediatorContractOnOtherSide on NiftyMain
 */
async function main() {
  console.log("📡 Deploy \n")
  // auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
  //await autoDeploy();
  // OR
  // custom deploy (to use deployed addresses dynamically for example:)

  console.log("🪐 DEPLOYING ON NETWORK: ",bre.network.name)

  if(bre.network.name.indexOf("sidechain")>=0 || bre.network.name.indexOf("kovan")>=0|| bre.network.name.indexOf("xdai")>=0){
    const Liker = await deploy("Liker")
    const NiftyRegistry = await deploy("NiftyRegistry")
    const NiftyInk = await deploy("NiftyInk")
    const NiftyToken = await deploy("NiftyToken")
    const NiftyMediator = await deploy("NiftyMediator")

    //console.log("💽Loading local contract that are already deployed...")
    //const Liker = await ethers.getContractAt("Liker","0xBD0621dcb64e1EEd503f709422b019B2fA197aF6")
    //const NiftyRegistry = await ethers.getContractAt("NiftyRegistry","0x63d6151DC9aAf6AD66DfFc42ad1eA65A6a2EFC68")
    //const NiftyInk = await ethers.getContractAt("NiftyInk","0x49dE55fbA08af88f55EB797a456fdf76B151c8b0")
    //const NiftyToken = await ethers.getContractAt("NiftyToken","0xCF964c89f509a8c0Ac36391c5460dF94B91daba5")
    //const NiftyMediator = await ethers.getContractAt("NiftyMediator","0x73cA9C4e72fF109259cf7374F038faf950949C51")


    await NiftyRegistry.setInkAddress(NiftyInk.address)
    await NiftyRegistry.setTokenAddress(NiftyToken.address)
    console.log("setBridgeMediatorAddress",NiftyMediator.address)
    await NiftyRegistry.setBridgeMediatorAddress(NiftyMediator.address)
    await NiftyInk.setNiftyRegistry(NiftyRegistry.address)
    await NiftyToken.setNiftyRegistry(NiftyRegistry.address)
    await NiftyMediator.setNiftyRegistry(NiftyRegistry.address)
    await Liker.addContract(NiftyInk.address)

    let trustedForwarder = "0x3619DbE27d7c1e7E91aA738697Ae7Bc5FC3eACA5"

    const SimplePaymaster = await deploy("SimplePaymaster")

    console.log("setting relay hub")
    await SimplePaymaster.setRelayHub("0x038B86d9d8FAFdd0a02ebd1A476432877b0107C8")

    console.log("setting target addresses")
    await SimplePaymaster.setTarget(NiftyInk.address, true)
    await SimplePaymaster.setTarget(NiftyToken.address, true)
    await SimplePaymaster.setTarget(Liker.address, true)

    console.log("setting trusted forwarder")
    await SimplePaymaster.setTrustedForwarder(trustedForwarder)
    console.log("setting trusted forwarder")
    await NiftyInk.setTrustedForwarder(trustedForwarder)
    console.log("setting trusted forwarder")
    await NiftyToken.setTrustedForwarder(trustedForwarder)
    console.log("setting trusted forwarder")
    await NiftyMediator.setTrustedForwarder(trustedForwarder)
    console.log("setting trusted forwarder")
    await Liker.setTrustedForwarder(trustedForwarder)

    console.log("setting gas limit")
    await NiftyMediator.setRequestGasLimit("1500000")

    if(bre.network.name.indexOf("kovan")>=0){
      /*await NiftyMediator.setBridgeContract("0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560")
      await NiftyInk.setTrustedForwarder("0x77777e800704Fb61b0c10aa7b93985F835EC23fA")
      await NiftyToken.setTrustedForwarder("0x77777e800704Fb61b0c10aa7b93985F835EC23fA")
      await NiftyMediator.setTrustedForwarder("0x77777e800704Fb61b0c10aa7b93985F835EC23fA")
      await NiftyMediator.setRequestGasLimit("1500000")
      await Liker.setTrustedForwarder("0x77777e800704Fb61b0c10aa7b93985F835EC23fA")*/
    }else if(bre.network.name.indexOf("xdai")>=0){
      //console.log("setBridgeContract")
      //await NiftyMediator.setBridgeContract("0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59")
      //await NiftyInk.setTrustedForwarder("0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
      //await NiftyToken.setTrustedForwarder("0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
      //console.log("setTrustedForwarder...")
      //await NiftyMediator.setTrustedForwarder("0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
      //console.log("setRequestGasLimit...")
      //await NiftyMediator.setRequestGasLimit("1500000")
      //await Liker.setTrustedForwarder("0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
      //const NiftyMediator = await ethers.getContractAt("NiftyMediator","0xdFDE4746486086D00F82b81bB84360B72a233a07")
      //console.log("📡 setMediatorContractOnOtherSide...")
      console.log("set mediator contract on other side....")
      let result = await NiftyMediator.setMediatorContractOnOtherSide("0xc02697c417DdAcfbe5EdbF23eDad956BC883F4fb")
      //console.log("result",result)
    }
    //await Liker.addContract(NiftyInk.address)

    /*if(bre.network.name.indexOf("sidechain")>=0) {
      let trustedForwarder
      try{
        let trustedForwarderObj = JSON.parse(fs.readFileSync("../react-app/src/gsn/Forwarder.json"))
        console.log("⛽️ Setting GSN Trusted Forwarder on NiftyRegistry to ",trustedForwarderObj.address)
        await NiftyInk.setTrustedForwarder(trustedForwarderObj.address)
        await NiftyToken.setTrustedForwarder(trustedForwarderObj.address)
        await NiftyMediator.setTrustedForwarder(trustedForwarderObj.address)
        console.log("⛽️ Setting GSN Trusted Forwarder on Liker to ",trustedForwarderObj.address)
        await Liker.setTrustedForwarder(trustedForwarderObj.address)

      }catch(e){
        console.log(e)
      }
    }*/

  }



  if(bre.network.name.indexOf("localhost")>=0 || bre.network.name.indexOf("sokol")>=0 || bre.network.name.indexOf("mainnet")>=0){
    console.log("🚀 Main Deploy ! ")
    const NiftyMain = await deploy("NiftyMain")
    if(bre.network.name.indexOf("sokol")>=0) {
      //await NiftyMain.setBridgeContract("0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560")
    //  await NiftyMain.setRequestGasLimit("1500000")
    } else if(bre.network.name.indexOf("mainnet")>=0) {
      //await NiftyMain.setBridgeContract("0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e")
      //await NiftyMain.setRequestGasLimit("1500000")
    }
    //const NiftyMain = await ethers.getContractAt("NiftyMain","0xc02697c417DdAcfbe5EdbF23eDad956BC883F4fb")
    //console.log("setMediatorContractOnOtherSide...")
    await NiftyMain.setMediatorContractOnOtherSide("0x73cA9C4e72fF109259cf7374F038faf950949C51")
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

async function autoDeploy() {
  let contractList = fs.readdirSync("./contracts")
  for(let c in contractList){
    if(contractList[c].indexOf(".sol")>=0 && contractList[c].indexOf(".swp.")<0){
      const name = contractList[c].replace(".sol","")
      let args = []
      try{
        const argsFile = "./contracts/"+name+".args"
        if (fs.existsSync(argsFile)) {
          args = JSON.parse(fs.readFileSync(argsFile))
        }
      }catch(e){
        console.log(e)
      }
      await deploy(name,args)
    }
  }
}
