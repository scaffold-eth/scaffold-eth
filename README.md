# 🏗 scaffold-eth - Public Goods Loogies

> Add blue to your loogies and support Public Goods in Ethereum.


## Pre-requisites

1. Loogies: Watch this [demo](https://www.youtube.com/watch?v=m0bwE5UelEo).

1. [Composable SVG NFT](https://github.com/scaffold-eth/scaffold-eth/tree/composable-svg-nft): It's a way to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

## Introduction

The Loogies deployed on mainnet doesn't follow the composable SVG NFT standard and doesn't have the blue color component.

So this is a way to upgrade your loogies and also support Ethereum public goods.

This demo defines two SVG NFT contracts:
1. **BlueLoogies**: They are the same as loogies except they have fixed `chubbiness` and only a blue color component associated with a public good. These can only be minted by the owner of the contract.

1. **PublicGoodLoogies**: 

   These are minted by breeding a Loogie and a BlueLoogie. The resulting NFT will have the same chubbiness as the loogie, and the color will have the the blue component from BlueLoogie.

### Installation

Clone the repo:
```
git clone -b public-goods-loogies https://github.com/scaffold-eth/scaffold-eth.git public-goods-loogies
cd public-goods-loogies
```

Install dependencies:
```
yarn install
```

Start frontend
```
cd public-goods-loogies
yarn start
```

In a second terminal window, fork ethereum mainnet.
```
yarn fork
```

In a third terminal window, deploy contracts:
```
cd public-goods-loogies
yarn deploy
```

## Demo

1. Go to the **Mint Loogie Tank** tab and mint a tank by clicking the **MINT** button. Notice that each tank has a unique ID.

   <img width="400" src="https://user-images.githubusercontent.com/1689531/135761678-d7f0c82c-9129-49ca-b943-d8d4a0222d9b.png">

1. Now mint some loogies on **Mint Loogies** tab.

   <img width="400" src="https://user-images.githubusercontent.com/1689531/135761696-4fc759bf-17f6-416d-a454-0d5722d0aa7f.png">


1. Send these loogies to any of the minted tanks by entering the tank ID and click **Transfer**.

   <img width="354" src="https://user-images.githubusercontent.com/1689531/135761726-8c2f5ea4-8c0a-4fa8-b08d-d38a7fe2634a.png">

1. Enjoy your loogies in a tank. 😎

   <img width="400" src="https://user-images.githubusercontent.com/1689531/135761763-0bdb225b-ee33-44e5-a800-1f217a83ec37.jpeg">


## Contact

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
