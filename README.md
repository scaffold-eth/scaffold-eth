# 🏗 scaffold-eth - 🎨 Don't Buy Meme Clone (ERC20 Staking + ERC1155 NFTs)

## Project Summary

In this template project we'll demonstrate how to create a (simplified) clone of dontbuymeme (MEME) which works as follows:
- Users acquire the EMEM erc20 token (by default a hefty amount of tokens is minted to the deployer account in this example)
- There's 3 collections or pools, each containing a number of NFTs (ERC1155) that can be minted by spending points
- Points in a collection are acquired by staking EMEM erc20 tokens. The more tokens stake, the more points the user accrues within that collection/pool.
- Each NFT in a collection has a fixed supply and users can use the points they have acquired by staking to mint one or more of the NFTs in that collection as long as there's any left. 

## 🧠 What you'll learn

By going through this template project you'll learn:
- How to create an ERC1155 contract for NFTs. More info on the standard here: https://blog.enjincoin.io/erc-1155-the-final-token-standard-on-ethereum-a83fce9f5714
- How to create a contract that manages staking an ERC20 token into a pool, generating points

## Disclaimers

The smart contracts are loosely based on Don't Buy Meme's which can be found here:
- https://etherscan.io/address/0x1d90d50D5dd04FA7c8BeF89aA5872F0701Be7982#readContract
- https://etherscan.io/address/0xe4605d46fd0b3f8329d936a8b258d69276cba264#readContract

These contracts have been modified a bit to make the sample easier to deploy and run.
⚠️ The contracts and front-end code has not been audited in any form and may contain bugs. Please exercise caution before deploying them to mainnet or in a production environment.

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git dont-clone-meme

cd dont-clone-meme

git checkout dont-clone-meme
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd dont-clone-meme
yarn chain

```

> in a third terminal window:

```bash
cd dont-clone-meme
yarn deploy

```

📱 Open http://localhost:3000 to see the app

---

## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

