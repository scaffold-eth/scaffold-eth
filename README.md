# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 🎲 Dice Game using RANDAO as randomness source

Ethereum PoS introduce randoness usign block.difficulty. Look at https://eips.ethereum.org/EIPS/eip-4399 for more information.

In this dice game the user can bet on a number between 0 and 15 and then some blocks after the bet, he can roll the dice to check if he won.

When the user bet, the current block number is saved on the contract along with the bet number. Then a future block number is used to determine what number is gotten from the dice. To do that, the ```rollTheDice``` method receives the RLP encoded block header (this is the block header for the future block where the dice number is get). For example, if the bet is on the block number 100 and the ```futureBlocks``` on the contract is set to 10, then the ```rollTheDice``` method needs to receive the header for the block 110.

The contract checks that it's the right block number and the block hash is ok (comparing blockhash(number) and the hash calculated from the block header sent to the method). If it's ok, the contract use the field ```mixHash``` from the header as randoness source as described at https://eips.ethereum.org/EIPS/eip-4399

The frontend has to get the block data, set it in the right order and RLP encode it before send the data to the ```rollTheDice``` method:

```
    const futureBlockNumber = blockNumber.add(futureBlocks).toNumber();
    if (DEBUG) console.log("futureBlockNumber: ", futureBlockNumber);

    const blockData = await localProvider.send("eth_getBlockByNumber", [
      ethers.utils.hexValue(futureBlockNumber),
      true,
    ]);
    if (DEBUG) console.log("blockData: ", blockData);

    let values = [];
    values.push(blockData.parentHash);
    values.push(blockData.sha3Uncles);
    values.push(blockData.miner);
    values.push(blockData.stateRoot);
    values.push(blockData.transactionsRoot);
    values.push(blockData.receiptsRoot);
    values.push(blockData.logsBloom);
    values.push(blockData.difficulty);
    values.push(blockData.number);
    values.push(blockData.gasLimit);
    values.push(blockData.gasUsed);
    values.push(blockData.timestamp);
    values.push(blockData.extraData);
    values.push(blockData.mixHash);
    values.push(blockData.nonce);
    if ("baseFeePerGas" in blockData) {
      values.push(blockData.baseFeePerGas);
    }

    for (let i = 0; i < values.length; i++) {
      if (values[i] === "0x0") {
        values[i] = "0x";
      }
      if (values[i].length % 2) {
        values[i] = "0x0" + values[i].substring(2);
      }
    }

    if (DEBUG) console.log("blockData values: ", values);

    const rlpEncoded = ethers.utils.RLP.encode(values);
    if (DEBUG) console.log("blockData RLP: ", rlpEncoded);

    const blockHash = ethers.utils.keccak256(rlpEncoded);
    if (DEBUG) console.log("blockData hash: ", blockHash);
```

The block hash is calculated in the last two lines, and you can check if it's right by checking the actual block hash.

It was deployed to Goerli test networks (already on PoS) and the frontend was deployed at https://dice-random.surge.sh/
 
---

### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/scaffold-eth/scaffold-eth dice-game-using-future-difficulty-using-block-header
cd dice-game-using-future-difficulty-using-block-header
git checkout dice-game-using-future-difficulty-using-block-header
yarn install
```
---

### 🔭 Environment 📺

You'll have three terminals up for:

```bash
yarn chain   (hardhat backend)
yarn start   (react app frontend)
yarn deploy  (to compile, deploy, and publish your contracts to the frontend)
```

> 👀 Visit your frontend at http://localhost:3000

> 👩‍💻 Rerun `yarn deploy --reset` whenever you want to deploy new contracts to the frontend.

---






