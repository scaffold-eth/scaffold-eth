const fs = require('fs');
const chalk = require('chalk');
const bre = require("@nomiclabs/buidler");
async function main() {
  console.log("📡 Deploy \n")
  // auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
  //await autoDeploy();
  // OR
  // custom deploy (to use deployed addresses dynamically for example:)

  console.log("🪐 DEPLOYING ON NETWORK: ",bre.network.name)

  const NFTINK = await deploy("NFTINK")
  const Liker = await deploy("Liker")

  console.log(" 📝 Adding NFTINK ("+NFTINK.address+") TO Liker...")
  await Liker.addContract(NFTINK.address)
  console.log("")

  if(bre.network.name.indexOf("localhost")>=0){
    console.log("Local deploy, loading GSN trusted forwarder from a file...")
    await NFTINK.setTrustedForwarder("0x0000000000000000000000000000000000000000")
    await Liker.setTrustedForwarder("0x0000000000000000000000000000000000000000")
    console.log("Set SignatureChecker flag to true...")
    await NFTINK.setCheckSignatureFlag(true)
  }
  else if(bre.network.name.indexOf("sidechain")>=0){
    console.log("Local deploy, loading GSN trusted forwarder from a file...")
    let trustedForwarder
    try{
      let trustedForwarderObj = JSON.parse(fs.readFileSync("../react-app/src/gsn/Forwarder.json"))
      console.log("⛽️ Setting GSN Trusted Forwarder on NFTINK to ",trustedForwarderObj.address)
      await NFTINK.setTrustedForwarder(trustedForwarderObj.address)
      console.log("⛽️ Setting GSN Trusted Forwarder on Liker to ",trustedForwarderObj.address)
      await Liker.setTrustedForwarder(trustedForwarderObj.address)
      console.log("Set SignatureChecker flag to false...")
      await NFTINK.setCheckSignatureFlag(false)
    }catch(e){
      console.log(e)
    }
  }
  else if(bre.network.name=="kovan") {
    console.log(" 🟣 KOVAN deploy, adding Kovan trusted forwarder...")
    //https://docs.opengsn.org/gsn-provider/networks.html
    //await NFTINK.setTrustedForwarder("0x6453D37248Ab2C16eBd1A8f782a2CBC65860E60B")
    //await Liker.setTrustedForwarder("0x6453D37248Ab2C16eBd1A8f782a2CBC65860E60B")
    await NFTINK.setTrustedForwarder("0x77777e800704Fb61b0c10aa7b93985F835EC23fA")
    await Liker.setTrustedForwarder("0x77777e800704Fb61b0c10aa7b93985F835EC23fA")

  }else if(bre.network.name=="xdai") {
    console.log(" ♦ xDAI deploy 0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
    //https://docs.opengsn.org/gsn-provider/networks.html
    await NFTINK.setTrustedForwarder("0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
    await Liker.setTrustedForwarder("0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb")
  }else if(bre.network.name=="rinkeby") {
    console.log(" 🟨 Rinkeby deploy, no known trusted forwarder yet.")
    //https://docs.opengsn.org/gsn-provider/networks.html
    await NFTINK.setTrustedForwarder("0x0000000000000000000000000000000000000000")
    await Liker.setTrustedForwarder("0x0000000000000000000000000000000000000000")
  }else if(bre.network.name=="mainnet") {
    console.log(" 🚀 Mainnet deploy, no known trusted forwarder yet.")
    //https://docs.opengsn.org/gsn-provider/networks.html
    await NFTINK.setTrustedForwarder("0x0000000000000000000000000000000000000000")
    await Liker.setTrustedForwarder("0x0000000000000000000000000000000000000000")
  }



  //const examplePriceOracle = await deploy("ExamplePriceOracle")
  //const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])
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
