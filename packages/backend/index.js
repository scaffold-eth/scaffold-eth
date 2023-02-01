import fs from 'fs';
import express from 'express';
import { ethers, providers, Contract, utils, BigNumber } from "ethers";
import { Buffer } from 'buffer';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const title = "🫡  beans airdropper"

console.log(title)

const RPCURL = "https://chain.buidlguidl.com:8545"

console.log(" 📠 connecting to ",RPCURL,"...")

const contractAddress = "0x02adF01480dD339Eda259ccE88aB0D9207C440d4"

const startBlock = 1;

const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]




let burnerWallet 

if(!process.env.BURNER_KEY){
    console.log("\n🗝 Generating Burner Key...\n\n");
    burnerWallet = ethers.Wallet.createRandom();
    fs.appendFileSync( ".env", "\nBURNER_KEY='"+burnerWallet.privateKey+"'\n")
    console.log("💾 ",burnerWallet.address)
}else{
    burnerWallet = new ethers.Wallet(process.env.BURNER_KEY);
    console.log("🔐 ",burnerWallet.address)
}

console.log("🧑‍🔬 Burner Wallet: ",burnerWallet.address)

const provider = new providers.JsonRpcProvider(RPCURL);

const walletSigner = burnerWallet.connect(provider)

console.log("💵 burner balance: ",utils.formatEther(await provider.getBalance(burnerWallet.address)),"ETH")

/*provider.on("block", (blockNumber) => {
    // Emitted on every block change
    console.log(" 📦 Block: " + blockNumber);
})*/





let lastBlockTracked = 0;

const fileCachingForLocalDebugging = false


let tokensOfAddress = {}

let tokens = {}

const TOKENCACHING = true
const directory = './tokens';

let lastKnownBlock = 0

const DOUBLECHECKBACKWARDS = 100 //this is how many blocks we go back to double check that we didn't miss any events
const BACKOFFFROMHEAD = 0 //seems like this call takes much longer when we demand the very latest block so when we back off a could seconds it's faster idk prob not




setInterval(async () => {

    const startTime = Date.now()

    console.log("📡 polling for new blocks...")

    try{


        const currentBlock = await provider.getBlockNumber()

        lastKnownBlock = currentBlock

        let startRange = Math.max(startBlock,lastBlockTracked-DOUBLECHECKBACKWARDS)
        let endRange = currentBlock-BACKOFFFROMHEAD

        //console.log("triggered",lastBlockTracked)
        console.log(" 📦 current block is ",currentBlock," 👉 getting live events start with ",startRange," and going to ",endRange)
    
        //console.log("current block", currentBlock)

        //console.log("getting live events start with lastBlockTracked-10",startRange," and going to currentBlock-10 ",endRange)
        let newEvents = await contract.queryFilter(filter, startRange, endRange);

        for (let event in newEvents) {
            //console.log("processing new event",newEvents[event])
            await processTx(newEvents[event])
        }

        lastBlockTracked = endRange

        const endTime = Date.now()

        const elapsedTime = endTime - startTime;

        console.log(`⏱ ${elapsedTime}ms to process ${newEvents.length} events`);

    }catch(e){
        console.log("🚨 error",e)
    }

    

}, 2000);







console.log("⚙️ loading all events...")

// Instantiate the contract instance

const contract = new Contract(contractAddress, abi, provider);

const filter = contract.filters.Transfer(null, null);

let liveFilter = {
    address: contractAddress,
    topics: [
        utils.id("Transfer(address,uint256)"),
    ]
}

console.log("📡 listening for transfers maybe...")
provider.on(liveFilter, (event) => {
    console.log("🛰 🛰 🛰 Transfer event: ",event);

    let tx = event

    //fs.writeFileSync("./tx.json", JSON.stringify(tx))

    //console.log("from",utils.defaultAbiCoder.decode(['address'],tx.topics[1]))
    console.log("to",utils.defaultAbiCoder.decode(['address'],tx.topics[1]))
    console.log("amount",utils.defaultAbiCoder.decode(['uint256'],tx.topics[2]))

    let txObj = {args:[ 
        utils.defaultAbiCoder.decode(['address'],tx.topics[1])[0],
        utils.defaultAbiCoder.decode(['uint256'],tx.topics[2])[0]
    ]}
    console.log("txObj",txObj)

    processTx(txObj)
})

let knownAddresses = []

const processTx = async (tx) => {
    //console.log("TX",tx)
    if(!knownAddresses.includes(tx.args.to)) await newAddress(tx.args.to)
    if(!knownAddresses.includes(tx.args.from)) await newAddress(tx.args.from)
}

const newAddress = async (newaddress) => {
    knownAddresses.push(newaddress)
    console.log("📡 new address",newaddress)
    try{
        let newAddressBalance =  await provider.getBalance(newaddress)
        if(newAddressBalance.gt( ethers.utils.parseEther("0.0001" ))){
            console.log("📡 new address has balance")
        }else{
            console.log("📡 new address has no balance")
            await walletSigner.sendTransaction({to:newaddress, value:utils.parseEther("0.001")})
        }
    }catch(e){
        console.log("📡 error",e)
    }
}


/*





const currentBlock = await provider.getBlockNumber()
console.log("current block", currentBlock)
lastKnownBlock = currentBlock;



let allEvents
if(fileCachingForLocalDebugging){
    try{
        const stringOfEvents = fs.readFileSync('cache.json', 'utf8');
        allEvents = JSON.parse(stringOfEvents)
    }catch(e){
       
    }
}

if(!allEvents){
    console.log("can't read cache querying RPC...")
    // Set up event filter to get all Transfer events
    // Get all past Transfer events
    console.log(" only getting up to currentBlock-10...",currentBlock-10)
    lastBlockTracked = currentBlock-10
    allEvents = await contract.queryFilter(filter, startBlock, lastBlockTracked);

    console.log("caching",allEvents.length," events...")
    fs.writeFileSync('./cache.json', JSON.stringify(allEvents));
}


console.log("loaded ",allEvents.length, "events")



const processTx = async (tx) => {
    let to = tx.args[1].toLowerCase()
    if(!tokensOfAddress[to]){
        tokensOfAddress[to] = []
    }
    let tokenId
    if(BigNumber.isBigNumber(tx.args[2])){
        tokenId = tx.args[2].toNumber()
    }else{
        tokenId = BigNumber.from(tx.args[2].hex).toNumber()
    }
    //console.log("tokenId", tokenId)
    if(!(await tokenExistsForAddress(to, tokenId))){
        tokensOfAddress[to].push(tokenId)
    }

    let from = tx.args[0].toLowerCase()
    removeTokenFromAddress(from, tokenId);


   // console.log("checking for tokenUri of tokenId ",tokenId)

    if (!fs.existsSync(directory)) { fs.mkdirSync(directory) }
    if(!tokens[tokenId]){
        tokens[tokenId] = await loadTokienUri(tokenId)
    }

}

const loadTokienUri = async (tokenId) => {
    if(TOKENCACHING){
        let possibleToken
        try{
            possibleToken = fs.readFileSync("./tokens/"+tokenId+".json")
            if(possibleToken){
                return JSON.parse(possibleToken)
            }
        }catch(e){
            //console.log("cache miss")
        }
    }
    console.log("📡 looking up token ",tokenId)
    const base64Encoded = await contract.tokenURI(tokenId)
    const decodedString = Buffer.from(base64Encoded.replace("data:application/json;base64,",""), 'base64').toString();
    fs.writeFileSync("./tokens/"+tokenId+".json", decodedString)
    const tokenObject = JSON.parse(decodedString)
    return tokenObject
}

const removeTokenFromAddress = async (address, tokenId) => {
    for (let tokenIndex in tokensOfAddress[address]) {
        if(tokensOfAddress[address][tokenIndex]===(tokenId)){
            tokensOfAddress[address].splice(tokenIndex, 1)
        }
    }
}

const tokenExistsForAddress = async (address, tokenId) => {
    for (let tokenIndex in tokensOfAddress[address]) {
        if(tokensOfAddress[address][tokenIndex]===(tokenId)){
            return true
        }
    }
    return false;
}

for (let event in allEvents) {
    await processTx(allEvents[event])
}
*/