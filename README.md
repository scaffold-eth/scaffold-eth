# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 Challenge 1: Decentralized Staking App

> 🏦 Build a `Staker.sol` contract that collects **ETH** from numerous addresses using a payable `stake()` function and keeps track of `balances`. After some `deadline` if it has at least some `threshold` of ETH, it sends it to an `ExampleExternalContract` and triggers the `complete()` action sending the full balance. If not enough **ETH** is collected, allow users to `withdraw()`.

> 🎛 Building the frontend to display the information and UI is just as important as writing the contract. The goal is to deploy the contract and the app to allow anyone to stake using your app. Use a `Stake(address,uint256)` event to <List/> all stakes.

> 🏆 The final **deliverable** is deploying a decentralized application to a public blockchain and then `yarn build` and `yarn surge` your app to a public webserver. Share the url in the [Challenge 1 telegram channel](https://t.me/joinchat/E6r91UFt4oMJlt01) to earn a collectible and cred! Part of the challenge is making the **UI/UX** enjoyable and clean! 🤩


🧫 Everything starts by ✏️ Editing `Staker.sol` in `packages/hardhat/contracts`

---
### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git challenge-1-decentralized-staking
cd challenge-1-decentralized-staking
git checkout challenge-1-decentralized-staking
yarn install
```

🔏 Edit your smart contract `Staker.sol` in `packages/hardhat/contracts`

---

### Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

`yarn start` (react app frontend)

`yarn chain` (harthat backend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend.

---

### Checkpoint 2: 🥩 Staking 💵

You'll need to track individual `balances` using a mapping:
```solidity
mapping ( address => uint256 ) public balances;
```

And also track a constant `threshold` at ```1 ether```
```solidity
uint256 public constant threshold = 1 ether;
```

> 👩‍💻 Write your `stake()` function and test it with the `Debug Contracts` tab in the frontend

#### 🥅 Goals

- [ ] Do you see the balance of the `Staker` contract go up when you `stake()`?
- [ ] Is your `balance` correctly tracked?
- [ ] Do you see the events in the `Staker UI` tab?


---

### Checkpoint 3: 🔬 Testing ⏱


Set a `deadline` of ```now + 30 seconds```
```solidity
uint256 public deadline = now + 30 seconds;
```

> 👩‍💻 Write your `execute()` function and test it with the `Debug Contracts` tab

Hint: If the `address(this).balance` of the contract is over the `threshold` by the `deadline`, you will want to call: ```exampleExternalContract.complete{value: address(this).balance}()```

(You'll have 30 seconds after deploying until the deadline is reached)

> 👩‍💻 Create a `timeLeft()` function including ```public view returns (uint256)``` that returns how much time is left.

⚠️ Be careful! if `now >= deadline` you want to ```return 0;```

⏳ The time will only update if a transaction occurs. You can see the time update by getting funds from the faucet just to trigger a new block.

> 👩‍💻 You can call `yarn deploy` any time you want a fresh contract

#### 🥅 Goals
- [ ] Can you see `timeLeft` counting down in the `Staker UI` tab when you trigger a transaction with the faucet?
- [ ] If you `stake()` enough ETH before the `deadline`, does it call `complete()`?
- [ ] If you don't `stake()` enough can you `withdraw(uint256)` your funds?

⚔️ Side Quests
- [ ] Can execute get called more than once, and is that okay?
- [ ] Can you deposit and withdraw freely after the `deadline`, and is that okay?
- [ ] What are other implications of *anyone* being able to withdraw for someone?

🐸 It's a trap!
- [ ] Make sure funds can't get trapped in the contract! Try sending funds after you have exectued!

---

### Checkpoint 4: 🚢 Ship it 🚁

📡 Edit the `defaultNetwork` to `xdai` (or any another EVM chain) in `packages/hardhat/hardhat.config.js`

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

🛰 Use an [instantwallet.io](https://instantwallet.io) to fund your **deployer address** (run `yarn account` to view balances)

 >  🚀 Run `yarn deploy` to deploy to your public network of choice (wherever you can get ⛽️ gas)

 ---

### Checkpoint 5: 🎚 Frontend 🧘‍♀️

 👩‍🎤 Take time to craft your user experience.

 ...

 📡 When you are ready to ship the frontend app...

 📦  Run `yarn build` to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

> 🎖 Show off your app by pasting the url in the [Challenge 1 telegram channel](https://t.me/joinchat/E6r91UFt4oMJlt01)
