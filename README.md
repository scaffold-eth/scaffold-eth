# 🏗 scaffold-eth

### Challenge 1: Staking App

> Build a `Staker.sol` contract that collects ETH from numerous addresses using a `stake()` function and keeps track of `balances`. After some `deadline` if it has at least some `threshold` ETH, it sends it to a SecondContract and triggers some action. If not enough ETH is collected, allow users to withdraw.

> Building the frontend to display the information and UI is just as important as writing the contract. The goal is to deploy the contract and the app to allow anyone to stake using your app. Use a `Stake(address,uint256)` event to <List/> all stakes.


---
## install

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git staking-app-challenge
cd staking-app-challenge
git checkout staking-app-challenge
yarn install
```

🔏 Edit your smart contract `Staker.sol` in `packages/hardhat/contracts`

## Checkpoint 0: Environment

You'll have three terminals up for:

`yarn start` (react app frontend)

`yarn chain` (harthat backend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

> Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend.

## Checkpoint 1:

You'll need to track individual `balances` using a mapping:
```solidity
mapping ( address => uint256 ) public balances;
```

And also track a constant `threshold` at ```1 ether```
```solidity
uint256 public constant threshold = 1 ether;
```

## Checkpoint 2:

Start tracking and display the balance the user has staked in `App.jsx`:
```js
const balance = useContractReader(readContracts,"Staker", "balance")
console.log("💸 balance:",balance)
```
