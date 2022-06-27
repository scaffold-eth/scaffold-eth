# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 🎲 Dice Game using future block.difficulty

Ethereum PoS introduce randomness usign block.difficulty. Look at https://eips.ethereum.org/EIPS/eip-4399 for more information.

In the build https://github.com/scaffold-eth/scaffold-eth/tree/dice-game-using-difficulty a dice game using block.difficulty as randomness source was developed and then it was attacked using the same strategy from the Dice Game Challenge (https://github.com/scaffold-eth/scaffold-eth-challenges/tree/challenge-3-dice-game).

Now the game have 3 stages:
1. **Bidding Stage:** the players can bid on the numbers. Each bid costs 0.002 ethers (90% go to the prize and 10% to the contract). Duration: 10 blocks
2. **Cooldown Stage:** nobody can bid and the roll can’t be rolled yet. Duration: 5 blocks.
3. **Rolling Stage:** anyone can roll the dice and get a tip for it (set at 10% of the prize now). All the winners get the prize splitted to the winners count. If nobody wins, the prize is kept for the next round. Duration: 5 blocks.

It was deployed to Ropsten test networks (already on PoS) and the frontend was deployed at http://dice-future-ropsten.surge.sh/

Now it is harder to attack the game. You can make a RiggedRoll that only rolls the dice if the number is one that you have played, but you compete with other players trying to roll the dice too, and you only have 5 blocks to roll it.
 
---

### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/scaffold-eth/scaffold-eth dice-game-future-difficulty
cd dice-game-future-difficulty
git checkout dice-game-future-difficulty
yarn install
```
---

### 🔭 Environment 📺

You'll have three terminals up for:

```bash
yarn chain   (hardhat backend)
yarn start   (react app frontend)
yarn deploy  (to compile, deploy, and publish your contracts to the frontend)
```

> 👀 Visit your frontend at http://localhost:3000

> 👩‍💻 Rerun `yarn deploy --reset` whenever you want to deploy new contracts to the frontend.

---






