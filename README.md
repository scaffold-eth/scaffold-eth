# 🏯 Simple Marketplace w/ Royalties

![image](https://scaffold-eth-readme-images.s3.amazonaws.com/Screen+Shot+2022-04-29+at+9.31.11+AM.png)

This Marketplace template features the following:
  - `createListing`
  - `buy`
  - `bid`
  - `setNFTCollectionRoyalty`

  ### Collection Royalties
  Royalties can be setup by a collection owner after they deploy their NFt contract. There is no way to determine a contract deployer using Solidity and the only way using web3 concepts would be to index all blockchain events looking for specific opcodes. Marketplaces like Rarible and OS can get around this by building their own indexer or by using the Etherscan api. To use Etherscan API, on the frontend you would look for the sender of the first txt in a contracts transaction history, this would be the deployer wallet or contract.

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app
