const fs = require('fs');
const chalk = require('chalk');
const bre = require("@nomiclabs/buidler");
const axios = require('axios');


const realEtheres = require("ethers");

async function main() {
  const gasUsage = 0.04377901
  console.log("👀 Getting current gas price...")
  const gasPrice = (await axios.get('https://ethgasstation.info/json/ethgasAPI.json')).data.fast
  console.log("gasPrice",gasPrice)

  //WHY THE F DOES THIS LINE NOT WORK BUT THE ONE BELOW IT DOES?!?>
  //const mainnetProvider = new realEtheres.providers.InfuraProvider("mainnet", "9ea7e149b122423991f56257b882261c")
  const mainnetProvider = new realEtheres.providers.JsonRpcProvider("https://mainnet.infura.io/v3/9ea7e149b122423991f56257b882261c")
  const ethDaiExchangeContract = new realEtheres.Contract("0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667",
    [
      {
        "name": "getEthToTokenInputPrice",
        "outputs": [{ "type": "uint256", "name": "out" }],
        "inputs": [{ "type": "uint256", "name": "eth_sold" }],
        "constant": true,
        "payable": false,
        "type": "function",
        "gas": 5542
      }
    ],
    mainnetProvider,
  );
  const exchangeRate = await ethDaiExchangeContract.getEthToTokenInputPrice("10000000000000000000");
  const price = parseFloat(exchangeRate.div("100000000000000000"))/100
  console.log(price)

  let cost = Math.round(price * gasPrice * gasUsage)/1000
  console.log("cost",cost)

  let safeCost = Math.ceil( cost*=1.05 )

  console.log("📡 Loading NiftyMediator \n")
  const NiftyMediator = await ethers.getContractAt("NiftyMediator","0x73cA9C4e72fF109259cf7374F038faf950949C51")

  console.log("💵 Setting Relay Price $"+safeCost+"\n")
  let result = await NiftyMediator.setRelayPrice(""+safeCost+"000000000000000000")
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
