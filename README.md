# 🏗 Roboto SVG NFT

Roboto SVG is a SVG composable and interactive NFT. 

Wear your Roboto with antennas, ears and glasses. 

Keep the battery charged!

https://roboto-svg.com/

![roboto](https://user-images.githubusercontent.com/466652/149665271-b8e5f36e-82f9-4524-871c-92949e87c3e2.png)


# 🏄‍♂️ Quick Start

## Prerequisites

This branch is an extension of [fancy-loogies](https://github.com/scaffold-eth/scaffold-eth/tree/fancy-loogies) branch (watch its [demo](https://youtu.be/mMMPTuHRm7M?t=2228) to understand more about it).

[Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

## Getting Started

### Installation

### Manual setup

> clone/fork 🏗 scaffold-eth fancy-loogies branch:

```
git clone -b roboto https://github.com/scaffold-eth/scaffold-eth.git roboto
```

> install and start your 👷‍ Hardhat chain:

```bash
cd roboto
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd roboto
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd roboto
yarn deploy
```

🌍 You need an RPC key for production deployments/Apps, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js`

🔏 Edit your smart contracts `packages/hardhat/contracts`.

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app


## Introduction

This branch shows how to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

Take a look at `Roboto.sol` at `packages/hardhat/contracts`. It describes an SVG NFT that is defined by two parameters: `eyeColor` and `earColor` randomly generated at mint and a third one, a random boolean `gold`. 

It exposes a function:
```
function renderTokenById(uint256 id) public view returns (string memory)
```

It returns the relevant SVG that be embedded in other SVG code for rendering.

You can send another NFTs (Antennas, Ears and Glasses) to a Roboto, to be rendered as one SVG.

Take a look at `Roboto.sol` at `packages/hardhat/contracts` to the `onERC721Received` function. It get called when the Roboto receive a NFT (see `_safeTransfer` function at `ERC721.sol` from `OpenZeppelin`).

The Roboto contract have two functions related to the battery. The first one is `batteryStatus` and the last one is `recharge`. The recharge function send 1 battery token (see `RobotoBattery.sol`, it's a ERC20 token) to the Roboto contract and then set the `batteryRecharged` mapping to the current block number. To allow to send 1 battery token from the user account, you need that the user make an approval for this token to the Roboto contract address.

### Automated with Gitpod

To deploy this project to Gitpod, click this button:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://github.com/scaffold-eth/scaffold-eth/tree/fancy-loogies)

# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

📚 Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

# 🛠 Buidl

Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!

  
 - 🚤  [Follow the full Ethereum Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c)


 - 🎟  [Create your first NFT](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)
 - 🥩  [Build a staking smart contract](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)
 - 🏵  [Deploy a token and vendor](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)
 - 🎫  [Extend the NFT example to make a "buyer mints" marketplace](https://github.com/austintgriffith/scaffold-eth/tree/buyer-mints-nft)
 - 🎲  [Learn about commit/reveal](https://github.com/austintgriffith/scaffold-eth/tree/commit-reveal-with-frontend)
 - ✍️  [Learn how ecrecover works](https://github.com/austintgriffith/scaffold-eth/tree/signature-recover)
 - 👩‍👩‍👧‍👧  [Build a multi-sig that uses off-chain signatures](https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig)
 - ⏳  [Extend the multi-sig to stream ETH](https://github.com/austintgriffith/scaffold-eth/tree/streaming-meta-multi-sig)
 - ⚖️  [Learn how a simple DEX works](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90)
 - 🦍  [Ape into learning!](https://github.com/austintgriffith/scaffold-eth/tree/aave-ape)

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
