# 🏗 scaffold-eth - 🔔 🔕 Ghosted Token

> A token that dynamically switches the tokenURI when toggled in the smart contract

( It will display the correct state on OpenSea and other platforms. )

---

## 👨‍🏫 Before you start this tutorial

[please complete the simple-nft-example tutorial](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git ghosted-token

cd ghosted-token

git checkout ghosted-token
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd ghosted-token
yarn chain

```

> in a third terminal window:

```bash
cd ghosted-token
yarn deploy

```

📱 Open http://localhost:3000 to see the app

---

> ✏️ Edit the mint script `mint.js` in `packages/hardhat/scripts` and update the `toAddress` to your frontend address (wallet address in the top right or localhost:3000).

> in a terminal window run the **mint** script:

```bash

yarn mint

```


Your token should display correctly in the frontend and evenutally on Rinkeby:

![image](https://user-images.githubusercontent.com/2653167/122653983-b1070100-d105-11eb-955d-5abc5221dbbf.png)

![image](https://user-images.githubusercontent.com/2653167/122653961-8d43bb00-d105-11eb-9edf-ff996a75b2ff.png)


> Toggle the token with the `TOGGLE` button. (You need to be the `owner` of the smart contract)

![image](https://user-images.githubusercontent.com/2653167/122654171-c6305f80-d106-11eb-9757-c6be7e6c9f7a.png)


> If you are on Rinkeby or Mainnet, you need to "Refresh metadata" on OpenSea

![image](https://user-images.githubusercontent.com/2653167/122654028-ce3bcf80-d105-11eb-97d7-f3ac9236e0da.png)


Your coin will eventually display as the "ghosted" version:

![image](https://user-images.githubusercontent.com/2653167/122654182-d3e5e500-d106-11eb-8598-fc793f5ae11a.png)

![image](https://user-images.githubusercontent.com/2653167/122654043-ead80780-d105-11eb-8c5b-405205f7aa8c.png)

> The trick is to swap the tokenURI in `YourCollectible.sol` in `packages/hardhat/contracts`

![image](https://user-images.githubusercontent.com/2653167/122654515-43f56a80-d109-11eb-8309-20cbebedb895.png)

