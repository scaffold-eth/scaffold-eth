# MandalaMerge NFT

https://mandalamerge.com

![MandalaMerge](https://user-images.githubusercontent.com/466652/191620379-181d0f75-4a1a-424c-bd4d-8237a510ace2.png)

This is a commemorative Mandala Merge NFT.

The MandalaMerge NFT is an animated SVG saved on-chain.

Each NFT is generated using a future RANDAO as randomness source (available post merge on Ethereum Proof of Stake). It's based on the https://github.com/scaffold-eth/scaffold-eth/tree/dice-game-using-future-difficulty-using-block-header branch (there you can read more about the random generation).

After the user mint a new mandala, he has to wait 10 blocks (about 2 minutes on mainnet) and then he has 256 blocks (about 50 minutes) to claim it.

In this way, the contract uses the mixHash header from the future block to generate an unpredictable NFT.

If the user misses to claim their mandala, it will look like an unfinished one (https://t.co/d1XXm6fzaW). 

 
---

### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/scaffold-eth/scaffold-eth mandala-merge
cd mandala-merge
git checkout mandala-merge
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






