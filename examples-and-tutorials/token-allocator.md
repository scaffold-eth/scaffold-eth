---
description: >-
  Allocator.sol distributes tokens to addresses on a ratio defined by
  Governor.sol
---

# 🐊 Token Allocator

## Tutorial Info

**Author:** [Austin Griffith](https://github.com/austintgriffith)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/new-allocator](https://github.com/austintgriffith/scaffold-eth/tree/new-allocator)  
**Intended audience:** Intermediate  
**Topics:** Scaffold-eth, ERC-20 token

## 🏃‍♀️ Quick Start

### Token Allocator Example

> Allocator.sol to distribute tokens/ETH at a predefined ratio to a number of addresses.

> Allows the community to send funds to a neutral token distributor.

## 🐊 Deploying an Allocator:

```text
git clone https://github.com/austintgriffith/scaffold-eth.git new-allocator

cd new-allocator

git checkout new-allocator

yarn install
```

**edit `packages/hardhat/scripts/deployAllocator.js` to change the Governor address**

create a deployer mnemonic:

```text

yarn generate

```

\(Fund this address by running `yarn account` and sending ETH to it.\)

then deploy your allocator:

```text

yarn deployAllocator

```

## 🏃‍♀️ Longer form 🏗 scaffold-eth instructions for working with the app/gov:

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```text
git clone https://github.com/austintgriffith/scaffold-eth.git new-allocator

cd new-allocator

git checkout new-allocator
```

```text
yarn install
```

```text
yarn start
```

If you want to bring up a local chain and work there, edit `hardhat.config.js` and `app.jsxhttps://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example to use` localhost`instead of`mainnet\`.

> in a second terminal window:

```text
cd scaffold-eth
yarn chain
```

> in a third terminal window:

```text
cd scaffold-eth
yarn deploy
```

**App:**

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

📱 Open [http://localhost:3000](http://localhost:3000/) to see the app

**Contracts:**

🔏 Edit the Allocator contract `Allocator.sol` in `packages/hardhat/contracts`

🔏 Edit the ExampleToken contract `ExampleToken.sol` in `packages/hardhat/contracts`

**Frontend:**

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📝 Edit your frontend `Allocations.jsx` in `packages/react-app/src/views`

📝 Edit your frontend `Distributions.jsx` in `packages/react-app/src/views`

**How To:**

Edit your token allocations in the deploy script `deploy.js` in `packages/hardhat/scripts`

[![image](https://user-images.githubusercontent.com/2653167/102407903-112bb780-3faa-11eb-9843-4fa70a8cb153.png)](https://user-images.githubusercontent.com/2653167/102407903-112bb780-3faa-11eb-9843-4fa70a8cb153.png)

Then redeploy your contracts:

```text
yarn deploy
```

Your Allocations should be displayed in the frontend: [![image](https://user-images.githubusercontent.com/2653167/102407974-2dc7ef80-3faa-11eb-86d0-2b2393a2f8c4.png)](https://user-images.githubusercontent.com/2653167/102407974-2dc7ef80-3faa-11eb-86d0-2b2393a2f8c4.png)

Use the **Debug** tab to check the ExampleToken balance of the Allocator address: [![image](https://user-images.githubusercontent.com/2653167/102408139-69fb5000-3faa-11eb-8828-1d9b64bd23b0.png)](https://user-images.githubusercontent.com/2653167/102408139-69fb5000-3faa-11eb-8828-1d9b64bd23b0.png)

Use the from in the **Distributions** tab to distribute the token: [![image](https://user-images.githubusercontent.com/2653167/102408265-957e3a80-3faa-11eb-91f7-a88b61644130.png)](https://user-images.githubusercontent.com/2653167/102408265-957e3a80-3faa-11eb-91f7-a88b61644130.png)

Distributions can be called by anyone and they will happen at the defined ratio: [![image](https://user-images.githubusercontent.com/2653167/102408368-b2b30900-3faa-11eb-81f4-b13bae578caa.png)](https://user-images.githubusercontent.com/2653167/102408368-b2b30900-3faa-11eb-81f4-b13bae578caa.png)

Use address\(0\) to distribute ETH: [![image](https://user-images.githubusercontent.com/2653167/102408471-db3b0300-3faa-11eb-914e-25ecc5d1ad58.png)](https://user-images.githubusercontent.com/2653167/102408471-db3b0300-3faa-11eb-914e-25ecc5d1ad58.png)

