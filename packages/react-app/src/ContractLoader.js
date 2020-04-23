import { ethers } from "ethers";
export default function ContractLoader(provider,ready) {
  let contractList = require("./contracts/contracts.js")
  for(let c in contractList){
    let contracts = []
    contracts[contractList[c]] = new ethers.Contract(
      require("./contracts/"+contractList[c]+".address.js"),
      require("./contracts/"+contractList[c]+".abi.js"),
      provider,
    );
    if(typeof ready == "function") { ready(contracts) }
  }
}
