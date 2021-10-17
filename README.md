# 🏗 scaffold-eth - Composable SVG NFT

> Demonstration showing how SVG NFTs can be composed on top of each other.


## Prerequisites

This branch is an extension of [loogie-svg-nft](https://github.com/scaffold-eth/scaffold-eth/tree/loogies-svg-nft) branch. Watch its [demo](https://www.youtube.com/watch?v=m0bwE5UelEo) to understand more about it.

## Introduction

This branch shows how to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

This demo defines two SVG NFTs:
1. **Loogies**: They look like this:

Each loogie can have a different `color` and `chubbiness` randomly generated at mint.

1. **LoogieTank**: 

Take a look at `Loogies.sol` at `packages/hardhat/contracts`. It exposes a function:
```
function renderTokenById(uint256 id) public view returns (string memory)
```

It returns the relevant SVG that be embedded in other SVG code for rendering.

To see how, take a look at `LoogieTank.sol` at `packages/hardhat/contracts`. Its `renderTokenById` function calls `Loogies` contract's `renderTokenById` to include the SVG in its own SVG code.

Without this function, `LoogieTank` would have to do additional processing to extract the SVG code.

Play with the [live app](https://absent-earthquake.surge.sh/) deployed on rinkeby network.

## SVG Motion
The SVG code is generated on each `tokenURI()` invocation. Thus, you can output different SVG code on each invocation.

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

🌍 You need an RPC key for production deployments/Apps, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js`

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

## Introduction

This branch shows how to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

Take a look at `Loogies.sol` at `packages/hardhat/contracts`. It describes an SVG NFT that is defined by two parameters: `color` and `chubbiness` randomly generated at mint. It exposes a function:
```
function renderTokenById(uint256 id) public view returns (string memory)
```

It returns the relevant SVG that be embedded in other SVG code for rendering.

To see how, take a look at `LoogieTank.sol` at `packages/hardhat/contracts`. Its `renderTokenById` function calls `Loogies` contracts `renderTokenById` to include the SVG in its own SVG code.

Without this function, `LoogieTank` would have to do additional processing to extract the SVG code.

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
