# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 Challenge 2: 🎲 Dice Game 

> 🤖 Blurb about randomness on the blockchain...

> 💬  Dice game is a D16 dice, roll a 0, 1, or 2 to win the pot.  Initial pot is 10% of the contract's balance.  Every roll 40% goes to the pot, 60% goes to the dice game contract address, blah blah

---

### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/scaffold-eth/scaffold-eth-challenges.git challenge-3-dice-game
cd challenge-3-dice-game
git checkout challenge-3-dice-game
yarn install
```
---

### Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

`yarn chain` (hardhat backend)

`yarn start` (react app frontend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

> 👀 Visit your frontend at http://localhost:3000

> 👩‍💻 Rerun `yarn deploy --reset` whenever you want to deploy new contracts to the frontend.

---

### Checkpoint 2: 🎲 Dice Game

> 🔍 Inspect the code in the `DiceGame.sol` contract in `packages/hardhat/contracts`

> 💸 Grab some funds from the faucet and try rolling the dice a few times.  Watch the balance of the DiceGame contract using the 

#### 🥅 Goals

- [ ] Follow the solidity code to find out how the contract is attempting to create a random number.
- [ ] Using blockhash provides a sudo random number.  Is it possible to predict what that number would be for any given roll?

> ✏️  You will not be changing any code in the DiceGame.sol contract in this challenge.  You will write your own contract to predict the outcome, then only roll the dice when it is favourable.

---

### Checkpoint 3: 🔑 Rigged Contract

> 👩‍💻 Edit the `RiggedRoll.sol` contract to include a `riggedRoll()` function. This function will predict the randomness of a roll, and if the outcome will be a winner, call `rollTheDice()` on the DiceGame contract.

