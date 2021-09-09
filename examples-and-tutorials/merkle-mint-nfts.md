---
description: >-
  Use a Merkle tree of possible artworks and then submit a proof it is valid to
  mint.
---

# 🌲 Merkle Mint NFTs

## Tutorial Info

**Author:** [Austin Griffith](https://github.com/austintgriffith)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, NFTs, Merkle Tree

## 🏃‍♀️ Quick Start

Deployer pays around \(0.283719 ETH ~$500 at todays gas and price\) for the initial contract but then NFTs are only minted once a buyer wants them. \(The buyer of the NFT pays the gas to mint. ~$55\)

Table of Contents

1. [About The Project](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#about-the-project)
2. [Getting Started](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#getting-started)
   * [Prerequisites](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#prerequisites)
   * [Installation](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#installation)
3. [Exploring smart contracts](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#smart-contracts)
4. [Practice](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#practice)
5. [Additional resources](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#additional-resources)
6. [Contact](https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints#contact)

### About The Project

This branch uses the concept of [merkel root](https://www.investopedia.com/terms/m/merkle-root-cryptocurrency.asp#:~:text=A%20Merkle%20root%20is%20a,whole%2C%20undamaged%2C%20and%20unaltered.) to verify on chain NFT minting. So instead of pushing all verfied NFT hashes on-chain which would be quite expensive we generate a merkel root by modifying [these](https://github.com/Uniswap/merkle-distributor/tree/master/src) scripts to make our life easier.

### Getting Started

#### Prerequisites

You have to know what is an ERC721 standard and what is NFT. Please refer to [this](http://erc721.org/) and [this](https://docs.openzeppelin.com/contracts/4.x/erc721) for more information if you are not familiar with these terms.

#### Installation

Let's start our environment for tinkering and exploring how NFT auction would work.

1. Clone the repo first

```text
git clone https://github.com/austintgriffith/scaffold-eth.git buyer-mints-nft
```

1. Install dependencies

```text
yarn install
```

1. Start local chain ina different terminal

```text
yarn chain
```

1. Start your React frontend

```text
yarn start
```

1. Deploy your smart contracts to a local blockchain

```text
yarn deploy
```

### Smart contracts

Let's navigate to `packages/hardhat/contracts` folder and check out what contracts we have there.

We use a couple of contracts in this dApp.

#### MerkleTreeContract.sol

All the logic that verifies minting a particular NFT sits here. When you run `yarn deploy` a merkel root is generated and then passed in this contracts constructor while deploying.

`claim` is the main function which a buyer can call and mint a particular nft.

```text
function claim(uint256 index, string calldata tokenURI, bytes32[] calldata merkleProof)
```

These are the arguments passed while sending the transaction, the merkel prrof and index are generated for each NFT at the time of the proof, navigate through this [file](https://github.com/austintgriffith/scaffold-eth/blob/merkle-root-buyer-mints/packages/hardhat/scripts/deploy.js) for more info.

```text
require(MerkleProof.verify(merkleProof, merkleRoot, node), 'MerkleDistributor: Invalid proof.');
```

This is the line where the proof verification takes place so if any NFT which was not a part of the merkel root generation is minted the transaction will revert.

If the proof validates the NFT is then minted to the buyer.

### Practice

When you navigate to the react app on your browser you'll see the NFT's for which the merkel root was generated

[![image](https://user-images.githubusercontent.com/2653167/110538535-5fe87980-80e1-11eb-83aa-fe2b53f9c277.png)](https://user-images.githubusercontent.com/2653167/110538535-5fe87980-80e1-11eb-83aa-fe2b53f9c277.png)

💦 Use the faucet wallet icon in the bottom left of the frontend to give your address **$1000** in testnet ETH.

🎫 Try to "Mint" an NFT:

[![image](https://user-images.githubusercontent.com/2653167/110538992-ec933780-80e1-11eb-9d15-aaa7efea698d.png)](https://user-images.githubusercontent.com/2653167/110538992-ec933780-80e1-11eb-9d15-aaa7efea698d.png)

and voilà you see your address as the owner after on-chain verification.

### 

