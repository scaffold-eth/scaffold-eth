# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 Challenge 2: 🎲 Dice Game 

 🤖 Blurb about randomness on the blockchain...

 💬  Dice game is a D16 dice, roll a 0, 1, or 2 to win the pot.  Initial prize is 10% of the contract's balance.  Every roll 40% goes to the prize, 60% goes to the dice game contract address, blah blah

 🧨 A value of .002 Eth is sent to the DiceGame contract when the dice are rolled.  40% of that will be added to the current prize, while the remaining 60% will be used to fund future prizes.  Once a prize is won, the new prize amount is set to 10% of the total balance of the DiceGame contract. 

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

 🔍 Inspect the code in the `DiceGame.sol` contract in `packages/hardhat/contracts`

 🔒  You will not be changing any code in the DiceGame.sol contract in this challenge.  You will write your own contract to predict the outcome, then only roll the dice when it is favourable.

 💸 Grab some funds from the faucet and roll the dice a few times.  Watch the balance of the DiceGame contract in the Debug tab.  It increases on a failed roll and decreases by the prize amount on a successful roll. 

![image](https://user-images.githubusercontent.com/12072395/168866845-bfc07d54-4722-44a8-ae07-544e001ceeaa.png)


#### 🥅 Goals

- [ ] Track the solidity code to find out how the DiceGame contract is creating a random number.
- [ ] Using blockhash provides a sudo random number.  Is it possible to predict what that number will be for any given roll?

---

### Checkpoint 3: 🔑 Rigged Contract

To deploy your RiggedRoll contract, uncomment the appropriate lines in the `01_deploy_riggedRoll.js` file in `packages/hardhat/deploy`

Edit the `RiggedRoll.sol` contract to include a `riggedRoll()` function. This function will predict the randomness of a roll, and if the outcome will be a winner, call `rollTheDice()` on the DiceGame contract.

 🃏 Predict the outcome by generating your roll number in the exact way as the DiceGame contract.

> 📣 Reminder!  Calling rollTheDice() will fail unless you send a message value of at least .002 Eth! [Here is one example of how to send value with a function call.](https://ethereum.stackexchange.com/questions/6665/call-contract-and-send-value-from-solidity)

#### ⚔️ Side Quest

- [ ] Look for the code to uncomment in `App.jsx` to show a riggedRoll button on the main tab for easier testing.
- [ ] Does your riggedRoll function only call rollTheDice() when it's going to be a winning roll?  What happens when it does call rollTheDice()?

> ⚠️ Oh no!  Getting an error when calling your riggedRoll function, but you should have rolled a winner?  You will need to fund the RiggedRoll contract!  

Start by creating a `receive()` function in your contract to allow it to receive Eth.  Then fund your contract in the Debug tab using the wallet icon next to your RiggedRoll address.

### Checkpoint 4: 💵 Where's my money?!?

You have beaten the game, but where is your money?  Since the RiggedRoll contract is the one calling `rollTheDice()`, that is where the prize money is being sent.  

📥 Create a `withdraw(address _addr, uint256 _amount)` function to allow you to send Eth from RiggedRoll to another address.

#### 🥅 Goals

- [ ] Can you send value from the riggedRoll contract to another address?
- [ ] Is anyone able to call the withdraw function?  What would be the downside to that?


#### ⚔️ Side Quest

- [ ] Lock the withdraw function so it can only be called by the owner.

> ⚠️ But wait, I am not the owner!  You will want to set your front end address as the owner in `01_deploy_riggedRoll.js`.  This will allow your front end address to call the withdraw function.




