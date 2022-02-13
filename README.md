# 🏗 Scaffold-ETH

> NFT contract with built in royalty cache using OpenZeppelin [ERC721Royalty](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Royalty) extension. 

> Marketplace contract with ERC721Rotalty interface to transacting using royalty functionality.

# NFT Royalties with Simple Marketplace 🛍️

# Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

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

🔏 Edit your smart contract `YourCollectible.sol` &  `Marketplace.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 📚 Demonstration

## Steps:

1. Deploy contracts
2. Mint NFT using account A. When minting be sure to enter the `_royaltyNumerator` in the following manner ( for 5.00% enter as 500). Solidity doesnt work well with decimals.
3. Send NFT to account B.
4. List NFT using account B
5. Approve the Marketplace to take the NFT using account B
6. Using account C buy the NFT from account B. (If using ERC20 as payment, must approve.)
7. Notice Royalty sent to account A after transaction between accounts B and C.

