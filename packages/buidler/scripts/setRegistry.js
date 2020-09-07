const fs = require('fs');
const chalk = require('chalk');
const bre = require("@nomiclabs/buidler");

async function main() {
  console.log("📡 Loading NiftyMediator \n")
  const NiftyMediator = await ethers.getContractAt("NiftyMediator","0x73cA9C4e72fF109259cf7374F038faf950949C51")
  console.log("📝 Setting Registry \n")
  let result = await NiftyMediator.setNiftyRegistry("0x63d6151DC9aAf6AD66DfFc42ad1eA65A6a2EFC68")
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
