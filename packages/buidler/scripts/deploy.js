const fs = require('fs');
const chalk = require('chalk');
const ethers = require('ethers');

async function main() {
  console.log("📡 Deploy \n")
  // auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
  //await autoDeploy();
  // OR
  // custom deploy (to use deployed addresses dynamically for example:)
  //const exampleToken = await deploy("ExampleToken")
  //const examplePriceOracle = await deploy("ExamplePriceOracle")
  //const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])
  const balloons = await deploy("Balloons")
  const dex = await deploy("DEX",[balloons.address])

  // paste in your address here to get 10 balloons on deploy:
  await balloons.transfer("0x2d0B23210A6E04727842fD341Aefd5318C8eBC70",""+(10*10**18))

  // uncomment to init DEX on deploy:
  //console.log("Approving DEX ("+dex.address+") to take Balloons from main account...")
  //await balloons.approve(dex.address,ethers.utils.parseEther('100'))
  //console.log("INIT exchange...")
  //await dex.init(ethers.utils.parseEther('5'),{value:ethers.utils.parseEther('5')})

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
  const contract = await contractArtifacts.new(...args)
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
