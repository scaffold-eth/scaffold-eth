# 🏗 scaffold-eth - 🔔 🔕 Ghosted Token

> A token that dynamic switches the tokenURI when toggled in the smart contract

( It will display the correct state on OpenSea and other platforms. )

---

## 👨‍🏫 Before you start this tutorial

[please complete the simple-nft-example tutorial](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git simple-nft-example

cd simple-nft-example

git checkout simple-nft-example
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd simple-nft-example
yarn chain

```

> in a third terminal window:

```bash
cd simple-nft-example
yarn deploy

```

📱 Open http://localhost:3000 to see the app

---

> ✏️ Edit the mint script `mint.js` in `packages/hardhat/scripts` and update the `toAddress` to your frontend address (wallet address in the top right or localhost:3000).

> in a terminal window run the **mint** script:

```bash

yarn mint

```

The owner of the token contract should be able to toggle any token on and off and it should show up in OpenSea!
