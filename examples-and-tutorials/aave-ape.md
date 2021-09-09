---
description: A helper contract that lets you go long on the Aave asset of your choice.
---

# 🦍 Aave Ape

## Tutorial Info

**Author:** [Adam Fuller](https://github.com/azf20)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/aave-ape](https://github.com/austintgriffith/scaffold-eth/tree/aave-ape)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, Aave

## 🏃‍♀️ Quick Start

> This branch demonstrates several ways to integrate Aave with scaffold-eth...

Lend is a simple React component, leveraging the Aave subgraph for market data, a custom useAaveData react hook to fetch user data, and aave-js to prepare transactions. [Read more here](https://medium.com/@azfuller20/lend-with-aave-v2-draft-20bacceedade)!

The Aave Ape is a helper contract that lets you go long \("ape"\) the Aave asset of your choice, borrowing a "short" asset on Aave to buy more of the "ape" asset. It also lets you unwind your position with an Aave flashloan. We walk through the mechanics, testing and the simple Ape frontend in [this post](https://medium.com/@azfuller20/aave-ape-with-%EF%B8%8F-scaffold-eth-draft-c687874c079e).

> 🚨 This is experimental code written for educational & learning purposes only, use at your own risk! 🚨

### Quickstart

```text
git clone -b aave-ape https://github.com/austintgriffith/scaffold-eth.git aave-ape

cd aave-ape
```

```text
yarn install
```

#### Local development

```text
yarn start
```

In a second terminal window run:

```text
yarn fork
```

This branch uses a local fork of mainnet, which is easy to do with Hardhat \([see here to learn more](https://hardhat.org/guides/mainnet-forking.html)\). The template configuration uses an Infura node, however this is not a full archive node, so it will only work for an hour or so. To get a long-lasting fork...

* Go to alchemyapi.io and get an API key for mainnet
* Replace the Infura URL with an Alchemy URL with your API key \(i.e. [https://eth-mainnet.alchemyapi.io/v2/](https://eth-mainnet.alchemyapi.io/v2/)&lt;API\_KEY\_HERE&gt;\) into the `fork` script on line 28 of /packages/hardhat/package.json

In a third terminal window run:

```text
yarn test
yarn deploy
```

> This tests then deploys the Aave Ape contract

📱 Open [http://localhost:3000](http://localhost:3000/) to see the app!

#### Running on Kovan

To run the frontend on Kovan, add the following to your .env file in `packages/react-app/`

```text
REACT_APP_PROVIDER=https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad
REACT_APP_NETWORK=kovan
```

To use the already-deployed Aave Ape contract, unzip the `kovan-contracts.zip` folder To deploy your own...

```text
yarn generate
yarn account
```

Send your newly generated account some Kovan ETH, then run...

```text
yarn workspace @scaffold-eth/hardhat hardhat --network kovan run scripts/deploy.js
yarn workspace @scaffold-eth/hardhat hardhat run scripts/publish.js
```

#### Running on Mainnet

To run the frontend on mainnet, add the following to your .env file in `packages/react-app/`

```text
REACT_APP_PROVIDER=https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad
REACT_APP_NETWORK=mainnet
```

**The Ape is not currently deployed on Mainnet**

### The components

🎶 Quick note! The mainnet fork can take a little while to get going - you may need to refresh several times before everything is cached and the app is fast and loading 💨💨💨

#### Lend

This component is a lightweight take on the Aave V2 market. You can view your overall position, key market stats, and your detailed asset position, viewing in native / ETH / USD. You can also make the key Aave transactions \(deposit, withdraw, borrow, repay\).

Data is fetched via a custom `useAaveData()` hook. Data is sourced from Aave subgraphs for market data, and on-chain for user data \(to enable local development\)

#### Ape

This is an experimental contract as part of this branch. The Aave Ape smart contract lets you increase your leverage, based on collateral deposited in Aave. The component walks you through the stages, but...

1. Select the token you want to go Long
2. Select the token you want to Short
3. Delegate credit to the AaveApe contract
4. Call the `ape()` function, or the `superApe()` function to leverage up multiple times in one transaction. This function uses your collateral to borrow the Short asset, swaps that for the Long asset, then deposits that back into Aave.
5. You can unwind your position by calling the `unwindApe()` function \(you need to give the AaveApe contract an allowance on your aToken first, so it can withdraw it\). Unwinding creates a flash loan to repay your owed amount in the Short token, then withdraws your Long token collateral, swaps it for the right amount of Short token, repays the flash loan and deposits any left-over collateral back into Aave

### Other components

#### Swap

This is a minimum viable Uniswap UI \(see more detail [here](https://azfuller20.medium.com/swap-with-uniswap-wip-f15923349b3d)\), using token-lists. All you need to instantiate this is a provider with a signer \(userProvider in scaffold-eth works fine!\)

* You can update the token-list for the Swap component in the "Hints" tab
* Kudos to @ironsoul for the fresh Debounce hook

#### SnatchToken

One of the benefits of using a mainnet fork is that you can impersonate Ethereum accounts you don't own, which is great for getting your hands on tokens! Building on top of an initial component by [@ironsoul](https://twitter.com/ironsoul0), this lets you specify the target, the token you are after and the amount you would like.

* Your target will need enough of the token, as well as some ETH to pay for the gas fee.
* The list of tokens comes from the [1inch tokenlist](https://tokenlists.org/token-list?url=tokens.1inch.eth)

#### Approver

A minimal component for Approving specific accounts to spend your ERC20s, with mainnet tokens selectable from a tokenlist, plus an option to manually enter the ERC20 of your choice.

