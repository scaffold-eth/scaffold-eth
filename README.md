# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 🎲 Dice Game using block.difficulty

Ethereum PoS introduce randoness usign block.difficulty. Look at https://eips.ethereum.org/EIPS/eip-4399 for more information.

This build resolves the Dice Game Challenge (https://github.com/scaffold-eth/scaffold-eth-challenges/tree/challenge-3-dice-game) using block.difficulty for the random dice value and try to attack it using the same strategy that when using block.number.

It was deployed to Ropsten test networks (already on PoS) and the frontend was deployed at https://dice-ropsten.surge.sh/

The same attack is feasible here. The block.difficulty value is the same on the RiggedRoll contract and on the DiceGame one, so you can predict if you will win or not, and only make the call to the DiceGame contract when you are expecting to win.
 
---

### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/scaffold-eth/scaffold-eth dice-game-using-difficulty
cd dice-game-using-difficulty
git checkout dice-game-using-difficulty
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






