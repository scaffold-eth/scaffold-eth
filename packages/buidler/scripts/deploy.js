const fs = require('fs');
const chalk = require('chalk');
async function main() {
  let contractList = fs.readdirSync("./artifacts")
  for(let c in contractList){
    if(contractList[c].indexOf(".json")>=0 && contractList[c].indexOf(".swp.")<0){
      const name = contractList[c].replace(".json","")
      const contractArtifacts = artifacts.require(name);
      const contract = await contractArtifacts.new()
      console.log(chalk.cyan(name),"deployed to:", chalk.magenta(contract.address));
      fs.writeFileSync("artifacts/"+name+".address",contract.address);
    }
  }
}
main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
