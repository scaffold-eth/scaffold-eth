# 🏗 scaffold-eth / NFTY INK

> TL;DR: **fork this repo** for an Ethereum dev stack focused on _fast product iteration_

Chapter 1: 🛠 [Programming Decentralized Money](https://medium.com/@austin_48503/programming-decentralized-money-300bacec3a4f)

Chapter 2: 🏵 The Token

Chapter 3: ⚖️ [Minimum Viable Decentralized Exchange](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90)


Chapter 0: 🧫 (research ) [Building on Ethereum in 2020](https://medium.com/@austin_48503/building-on-ethereum-in-2020-dca52eda5f00)

Chapter 7: 🗳 [Personal Token Voting](https://medium.com/@austin_48503/personal-token-voting-73b44a598d8e)

Chapter X: 🎨 NFTY Ink

---

## Introduction to NFTY INK

NFTY Ink lets you sign your name or draw whatever you want, immortalise that Ink on Ethereum and IPFS, and then Mint Inks as NFTs. Create and Collect all the Inks! Built with:
- [Scaffold ETH](https://github.com/austintgriffith/scaffold-eth)
- [React Canvas Draw](https://github.com/embiem/react-canvas-draw) for the drawing
- [IPFS](https://ipfs.io/) for storing the drawing and meta-information

---

## ⏱ Quickstart:

First, you'll need [NodeJS>=10](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads) installed.

💾 Clone/fork repo and then install:

```bash
git clone -b nfty-ink-dev https://github.com/austintgriffith/scaffold-eth.git nfty-dapp

cd nfty-dapp

yarn install
```

> ⌚️ This will take some time. How about a quick tour of the file structure with your favorite code editor?

> 💡 Sometimes the install throws errors like "node-gyp", try the next step even if you see problems.

---

```bash
yarn start
```

📝 This starts the front-end at http://localhost:3000

---

⛓ Start your local blockchain powered by 👷‍♀️[Buidler](https://buidler.dev/tutorial/):

```bash
yarn run chain
```

**Note**: You'll need to run this command in a new terminal window

> 🛠 [Use this eth.build](https://eth.build/build#1a21b864c6bcdb901070b64965fae825cdfc11b1915d74f058f00b114a8c129a) to double-check your local chain and account balances

---

⚙️ Compile your contracts:

```bash
yarn run compile
```

🚢 Deploy your contracts to the frontend:

```bash
yarn run deploy
```

🔍 _Watch_ for changes then compile, deploy, and hot reload the frontend:

```bash
yarn run watch
```

✨ Start our server for uploading to IPFS:

```bash
yarn run server
```



> TODO
- Add tests (🔬Test your contracts by editing `myTest.js` in `packages/buidler/contracts`)
```bash
yarn run test
```
