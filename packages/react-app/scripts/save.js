const chalk = require("chalk");
const { clearLine } = require("readline");
const fs = require("fs");

// a little helper script to hoist deployed contract artifacts into your constants.js to save

const save = async () => {
  if(process.argv.length < 3){
    console.log("⚠️ usage: yarn save *ContractName* *optionalNewName*");
  }else{
    console.log("💽 Saving Address and ABI of "+process.argv[2]+" to constants.js...");
    const address = require("../src/contracts/"+process.argv[2]+".address.js")
    const abi = JSON.stringify(require("../src/contracts/"+process.argv[2]+".abi.js"))
    const bytecode = require("../src/contracts/"+process.argv[2]+".bytecode.js")


    let saveName = process.argv[2]
    if(process.argv.length > 3) saveName = process.argv[3]

    let currentConstants = fs.readFileSync("./src/constants.js").toString()
    const indicator = "// EXTERNAL CONTRACTS"
    const indicatorLocation = currentConstants.indexOf(indicator)+indicator.length+1


    const addedArtifacts = "\n\n//------ added by save script:\nexport const "+saveName+"_ADDRESS = \""+address+"\"\n\n"+
      "export const "+saveName+"_ABI = "+abi+"\n\n"+
      "export const "+saveName+"_BYTECODE = \""+bytecode+"\"\n\n"

    let finalString = currentConstants.substr(0,indicatorLocation)+addedArtifacts+currentConstants.substr(indicatorLocation)

    fs.writeFileSync("./src/constants.js",finalString)

    console.log("✅ saved as "+chalk.cyan(saveName)+" in "+chalk.magenta("constants.js")+" with address "+chalk.gray(address))
    //console.log("abi: ",abi)
    //console.log("bytecode: ",bytecode)
  }
};

save();
