# 🏗 scaffold-eth - Public Goods Loogies

> Add blue to your loogies and support Public Goods in Ethereum.


## Pre-requisites

1. Loogies: Watch this [demo](https://www.youtube.com/watch?v=m0bwE5UelEo).

1. [Composable SVG NFT](https://github.com/scaffold-eth/scaffold-eth/tree/composable-svg-nft): It's a way to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

1. You own a loogie on mainnet. If not, you'll have to use account impersonation to make it work on mainnet fork. Watch this [video](https://youtu.be/xcBT4Jmi5TM?t=449) to learn about account impersonation.

## Introduction

The Loogies deployed on mainnet doesn't follow the composable SVG NFT standard and doesn't have the blue color component.

So this is a way to upgrade your loogies and also support Ethereum public goods.

This demo defines two SVG NFT contracts:
1. **BlueLoogies**

   They are the same as loogies except they have fixed `chubbiness` and only a blue color component associated with a public good. These can only be minted by the owner of the contract.

   Each of this loogie is mapped to address of a public good in Ethereum.

1. **PublicGoodLoogies**:

   These are minted by breeding a Loogie and a BlueLoogie. The resulting NFT will have the same chubbiness as the loogie, and the color will have the the blue component from BlueLoogie.

   While minting, the minter will pay a fee that will be forwarded to the public good associated with the input Blue Loogie.

### Installation

>Clone the repo:
```
git clone -b public-goods-loogies https://github.com/scaffold-eth/scaffold-eth.git public-goods-loogies
cd public-goods-loogies
```

>Install dependencies:
```
yarn install
```

>Fork ethereum mainnet.
```
yarn fork
```

>In a second terminal window, start frontend
```
cd public-goods-loogies
yarn start
```

>Go to `packages/hardhat/deploy/00_deploy_your_contract.js`, and update line 28 with your address on http://localhost:3000.

>In a third terminal window, deploy contracts:
```
cd public-goods-loogies
yarn deploy
```

## Demo
1. Go to the **Blue Loogies Debug** tab and mint a blue loogie by executing `mintItem` function. Enter any address and press **Send**.

   <img width="400" src="https://user-images.githubusercontent.com/1689531/135761678-d7f0c82c-9129-49ca-b943-d8d4a0222d9b.png">

1. Go to **Blue Loogies** tab, and enter the ID of a loogie you own. Click **Preview**.

   <img width="400" src="https://user-images.githubusercontent.com/1689531/135761696-4fc759bf-17f6-416d-a454-0d5722d0aa7f.png">


1. Click **Buy Public Good Loogie**.

   <img width="354" src="https://user-images.githubusercontent.com/1689531/135761726-8c2f5ea4-8c0a-4fa8-b08d-d38a7fe2634a.png">

1. Go to **PG Loogies** to see the newly minted NFT!

   <img width="400" src="https://user-images.githubusercontent.com/1689531/135761763-0bdb225b-ee33-44e5-a800-1f217a83ec37.jpeg">


## Contact

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
