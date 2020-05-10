const fs = require('fs');
const chalk = require('chalk');
async function main() {
  console.log("📡 Deploy \n")
  let contractList = fs.readdirSync("./contracts")
  for(let c in contractList){
    if(contractList[c].indexOf(".sol")>=0 && contractList[c].indexOf(".swp.")<0){
      const name = contractList[c].replace(".sol","")
      const contractArtifacts = artifacts.require(name);
      let args = []
      try{
        const argsFile = "./contracts/"+name+".args"
        //console.log("READING",argsFile)
        if (fs.existsSync(argsFile)) {
          args = JSON.parse(fs.readFileSync(argsFile))
          //console.log("LOADED ARGS",args,...args)
        }
      }catch(e){
        console.log(e)
      }
      console.log("📄 "+name)
      const contract = await contractArtifacts.new(...args)
      console.log(chalk.cyan(name),"deployed to:", chalk.magenta(contract.address));
      fs.writeFileSync("artifacts/"+name+".address",contract.address);
      console.log("\n")
    }
  }
}
main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
