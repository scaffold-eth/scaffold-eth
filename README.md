# 🏗 scaffold-eth - Public Goods Staking

> Stake erc20 tokens on different public good projects and get voting rights.

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


1. Clone the repo first
```sh
git clone -b public-goods-staking https://github.com/scaffold-eth/scaffold-eth-examples.git public-goods-staking
cd public-goods-staking
```

2. Install dependencies
```bash
yarn install
```


3. Deploy Contracts
```sh
yarn deploy (default deployment network is rinkeby)
```

4. Start React frontend
```bash
yarn start
```

## Introduction

The staking works on the logic of Weighted average depending on the price of the public good project governance token hence this repositiory assumes that the projects users can stake in have a token and it is a [retroactive erc20 token](https://github.com/scaffold-eth/scaffold-eth-examples/tree/erc20-retroactive-funding), there can be other factors to determine weightage but probably the price was the most logical one.

## Points to remember 
- The main [contract](https://github.com/scaffold-eth/scaffold-eth/blob/public-goods-staking/packages/hardhat/contracts/WeightageSplit.sol) basically is a flattened version, so it has 2 contracts, [PublicGoodToken](https://github.com/scaffold-eth/scaffold-eth/blob/public-goods-staking/packages/hardhat/contracts/WeightageSplit.sol#L761) & [Weightage](https://github.com/scaffold-eth/scaffold-eth/blob/public-goods-staking/packages/hardhat/contracts/WeightageSplit.sol#L931)

- The voting rights i.e the public goods project tokens the user get's on staking is the instance of the PublicGoodToken.

- While deploying the contracts currently in the [deployment script](https://github.com/scaffold-eth/scaffold-eth/blob/public-goods-staking/packages/hardhat/deploy/00_deploy_your_contract.js), we assume 2 public good tokens, you can update it based on your convinience.

- The initial price when you first navigate into UI is 1, so you need to fund project token's uniswap v3 pool with eth and sell your tokens in order to update price check the readme [here](https://github.com/scaffold-eth/scaffold-eth-examples/blob/erc20-retroactive-funding/README.md).


## UI Ineraction

<img width="1648" alt="main dashboard" src="https://user-images.githubusercontent.com/26670962/156911594-39d3d1e5-552b-4426-b8b9-b97dd601aad1.png">
The UI Dashboard so first you can update the price of the public goods tokens if you want, select the projects you want to stake in.

<br/>
<br/>
<br/>
<br/>

<img width="1655" alt="token detail" src="https://user-images.githubusercontent.com/26670962/156911763-7b984fbe-15de-4961-b0d9-e921078cf070.png">
The project token detail page where you can do two operations, fund the project token uniswap v3 pool with eth and swap your tokens for eth to update price.



## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
