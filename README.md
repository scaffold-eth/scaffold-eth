# 🏗 scaffold-eth - 🎫 Buyer Mints NFT

> (Counterfactual NFT minting example...)

Deployer pays around (0.283719 ETH ~$500 at todays gas and price) for the initial contract but then NFTs are only minted once a buyer wants them. (The buyer of the NFT pays the gas to mint. ~$55)

---

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/austintgriffith/scaffold-eth.git buyer-mints-nft

cd buyer-mints-nft

git checkout buyer-mints-nft
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

---

> ✏️ Edit the artwork manifest `artwork.js` with all of your art, then upload it to IPFS:

> in a third terminal window:


```bash
cd simple-nft-example

yarn upload

yarn deploy

```

📱 Open http://localhost:3000 to see the app

---

Your artwork from `artwork.json` (if uploaded and deployed correctly) should show a gallery of possible NFTS to mint:

![image](https://user-images.githubusercontent.com/2653167/110538535-5fe87980-80e1-11eb-83aa-fe2b53f9c277.png)


💦 Use the faucet wallet icon in the bottom left of the frontend to give your address **$1000** in testnet ETH.

🎫 Try to "Mint" an NFT:

![image](https://user-images.githubusercontent.com/2653167/110538992-ec933780-80e1-11eb-9d15-aaa7efea698d.png)


👛 Open an *incognito* window and navigate to http://localhost:3000 (You'll notice it has a new wallet address).

⛽️ Grab some gas for each account using the faucet:

![image](https://user-images.githubusercontent.com/2653167/109543971-35b10f00-7a84-11eb-832e-36d6b66afbe7.png)

🎟 Send an NFT to the *incognito* window just to make sure it works.

---

🕵🏻‍♂️ Inspect the `Debug Contracts` tab to figure out what address is the `owner` of `YourCollectible`?

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

---

🔏 Edit your smart contract `YourCollectible.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`


🔑 Create wallet links to your app with `yarn wallet` and `yarn fundedwallet`

⬇️ Installing a new package to your frontend? You need to `cd packages/react-app` and then `yarn add PACKAGE`

## 📡 Deploy NFT smart contract!

🛰 Ready to deploy to a testnet?

> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

![image](https://user-images.githubusercontent.com/2653167/109538427-4d38c980-7a7d-11eb-878b-b59b6d316014.png)

🔐 Generate a deploy account with `yarn generate`

![image](https://user-images.githubusercontent.com/2653167/109537873-a2c0a680-7a7c-11eb-95de-729dbf3399a3.png)


👛 View your deployer address using `yarn account` (You'll need to fund this account. Hint: use an [instant wallet](https://instantwallet.io) to fund your account via QR code)

![image](https://user-images.githubusercontent.com/2653167/109537339-ff6f9180-7a7b-11eb-85b0-46cd72311d12.png)

📝 Triple check your `artwork.json` file and run:

```bash

yarn upload

```

👨‍🎤 Deploy your NFT smart contract:

```bash

yarn deploy

```
---
---

> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to wherever you deployed your contract:

![image](https://user-images.githubusercontent.com/2653167/109539175-3e9ee200-7a7e-11eb-8d26-3b107a276461.png)

You should see the correct network in the frontend:

![image](https://user-images.githubusercontent.com/2653167/109539305-655d1880-7a7e-11eb-9385-c169645dc2b5.png)

An instant wallet running on xDAI insired by [xdai.io](https://xdai.io).

## ⚔️ Side Quests

#### 🐟 Open Sea

> Add your contract to OpenSea ( create -> submit NFTs -> "or add an existing contract" )

(It can take a while before they show up, but here is an example:)

https://testnets.opensea.io/assets/0xc2839329166d3d004aaedb94dde4173651babccf/1

---


#### 🔍 Etherscan Contract Verification

> run `yarn flatten > flat.txt` (You will need to clean up extra junk at the top and bottom of flat.txt. Sorry, rookie stuff here.)

> copy the contents of `flat.txt` to the block explorer and select compiler `v0.6.7` and `Yes` to `Optimization` (200 runs if anyone asks)

![image](https://user-images.githubusercontent.com/2653167/109540618-f84a8280-7a7f-11eb-9a34-c239f1271247.png)

---

#### 🔶 Infura

> You will need to get a key from [infura.io](https://infura.io) and paste it into `constants.js` in `packages/react-app/src`:

![image](https://user-images.githubusercontent.com/2653167/109541146-b5d57580-7a80-11eb-9f9e-04ea33f5f45a.png)

---

## 🛳 Ship the app!

> ⚙️ build and upload your frontend and share the url with your friends...

```bash

# build it:

yarn build

# upload it:

yarn surge

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

yarn s3

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

yarn ipfs
```

![image](https://user-images.githubusercontent.com/2653167/109540985-7575f780-7a80-11eb-9ebd-39079cc2eb55.png)

> 👩‍❤️‍👨 Share your public url with a friend and ask them to buy a collectible

![buyerpaysgastomint mov](https://user-images.githubusercontent.com/2653167/110540616-f322ae80-80e3-11eb-9009-41e445fdd0ff.gif)
