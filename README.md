# 🏗 scaffold-eth - Composable SVF NFT

> Demonstration showing how SVG NFTs can be composed on top of each other.


## Prerequisites

This branch is an extension of [loogie-svg-nft](https://github.com/scaffold-eth/scaffold-eth/tree/loogies-svg-nft) branch. Watch its [demo](https://www.youtube.com/watch?v=m0bwE5UelEo) to understand more about it.


## Getting Started

### Installation

Clone the repo:
```
git clone -b composable-svg-nft https://github.com/scaffold-eth/scaffold-eth.git composable-svg-nft
cd composable-svg-nft
```

Install dependencies:
```
yarn install
```

Start frontend
```
cd composable-svg-nft
yarn start
```

In a second terminal window, start a local blockchain
```
yarn chain
```

In a third terminal window, deploy contracts:
```
cd composable-svg-nft
yarn deploy
```

## Introduction

This branch shows how to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

Take a look at `Loogies.sol` at `packages/hardhat/contracts`. It describes an SVG NFT that is defined by two parameters: `color` and `chubbiness` randomly generated at mint. It exposes a function:
```
function renderTokenById(uint256 id) public view returns (string memory) {
```

It returns a minimal SVG code that be embedded in other SVG codes for rendering.

To see how, take a look at `LoogieTank.sol` at `packages/hardhat/contracts`. Its `renderTokenById` function calls `Loogies` contracts `renderTokenById` to include the SVG code in its own SVG.

Without this function, `LoogieTank` would have to do additional processing to extract teh SVG code.

## Demo

1. Go to the **Mint Loogie Tank** tab and mint some tank by clicking the **MINT** button. Notice that each tank has a unique ID.

1. Now mint some loogies on **Mint Loogies** tab.

1. Send these loogies to any of the minted tanks by entering the tank ID and click **Transfer**.

1. Enjoy your loogies in a tank. 😎


## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
