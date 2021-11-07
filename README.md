# 🏗 scaffold-eth - Retroactive Funding for NFT's

> Fund different NFT based public goods by automatically updating the floor price

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


1. Clone the repo first
```sh
git clone -b nft-retroactive-funding https://github.com/austintgriffith/scaffold-eth.git nft-retroactive-funding
cd nft-retroactive-funding
```

2. Install dependencies
```bash
yarn install
```

3. Spin up local chain
```sh
yarn chain
```

4. Deploy Contracts
```sh
yarn deploy
```

5. Start React frontend
```bash
yarn start
```

## Introduction

There are two types of entities involved to start with the **Whales/Funders** for public goods and the **Holders** of the public goods which are **NFT's.**

- Any Whale can send a specific ETH amount to the contract and specify the NFT Address they want to contribute to and the floor price is calculated automatically by ```ETH Sent / Total Supply of the NFT``` and as whales keep contributing to that particular NFT the floor keeps increasing.

- As the floor price increases due to the contribution by the whales the NFT Holders have the option to burn their NFT off in exchange for the new floor price, and if they decide to do this the floor is then calculated again and there is a slight decrease seen in the floor price.

So that's the overall architecture currently for this build and this process keeps continuing and currently, this supports only ERC721 and the contract is generic to support any ERC721 compliant NFT.



## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!


