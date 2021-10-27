# 🏗 scaffold-eth - 🎫 Buyer Mints NFT

> (Counterfactual NFT minting example...)

Deployer pays around (0.283719 ETH ~$500 at todays gas and price) for the initial contract but then NFTs are only minted once a buyer wants them. (The buyer of the NFT pays the gas to mint. ~$55)

# 🏃‍♀️ Quick Start
Required: [Git](https://git-scm.com/downloads), [Node](https://nodejs.org/dist/latest-v12.x/), [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) and [Hardhat](https://hardhat.org/getting-started/#installation).

> clone/fork 🏗 scaffold-eth and get setup:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git buyer-mints-nft

cd buyer-mints-nft

git checkout buyer-mints-nft

yarn
```

> upload the default art to IPFS:

```bash

yarn upload

```

> install and start your 👷‍ Hardhat chain in another terminal:

```bash
cd buyer-mints-nft

yarn chain
```

> in a third terminal window, deploy all the things and start your 📱 frontend:

```bash
cd buyer-mints-nft

yarn deploy

yarn start
```
📱 Open http://localhost:3000 to see the app

---

> ✏️ You can edit the artwork manifest `artwork.js` with all of your art, then re-upload it to IPFS:

> in another terminal window:


```bash
cd buyer-mints-nft

yarn upload

yarn deploy

```

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

🔏 Edit your smart contract `YourCollectible.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`


🔑 Create wallet links to your app with `yarn wallet` and `yarn fundedwallet`

⬇️ Installing a new package to your frontend? You need to `cd packages/react-app` and then `yarn add PACKAGE`

# 📡 Deploy NFT smart contract!

🛰 Ready to deploy to a testnet?
> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

![nft6](https://user-images.githubusercontent.com/526558/124387061-7a0f1e80-dcb3-11eb-9f4c-19229f43adec.png)

🔐 Generate a deploy account with `yarn generate`

![nft7](https://user-images.githubusercontent.com/526558/124387064-7d0a0f00-dcb3-11eb-9d0c-195f93547fb9.png)


👛 View your deployer address using `yarn account` (You'll need to fund this account. Hint: use an [instant wallet](https://instantwallet.io) to fund your account via QR code)

![nft8](https://user-images.githubusercontent.com/526558/124387068-8004ff80-dcb3-11eb-9d0f-43fba2b3b791.png)

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

![nft9](https://user-images.githubusercontent.com/526558/124387095-9743ed00-dcb3-11eb-8ea5-afc25d7fef80.png)

You should see the correct network in the frontend:

![nft10](https://user-images.githubusercontent.com/526558/124387099-9a3edd80-dcb3-11eb-9a57-54a7d370589a.png)

## ⚔️ Side Quests

#### 🐟 Open Sea

# ⚔️ Side Quests
## 🐟 Open Sea
> Add your contract to OpenSea ( create -> submit NFTs -> "or add an existing contract" )

(It can take a while before they show up, but here is an example:)
https://testnets.opensea.io/assets/0xc2839329166d3d004aaedb94dde4173651babccf/1
## 🔍 Etherscan Contract Verification
> run yarn flatten > flat.txt (You will need to clean up extra junk at the top and bottom of flat.txt. Sorry, rookie stuff here.)

---


#### 🔍 Etherscan Contract Verification

![nft12](https://user-images.githubusercontent.com/526558/124387153-c8bcb880-dcb3-11eb-8191-e53f87129b88.png)

## 🔶 Infura
> You will need to get a key from infura.io and paste it into constants.js in packages/react-app/src:

![nft13](https://user-images.githubusercontent.com/526558/124387174-d83c0180-dcb3-11eb-989e-d58ba15d26db.png)

# 🛳 Ship the app!
> ⚙️ build and upload your frontend and share the url with your friends...

```
# build it:

yarn build

# upload it:

yarn surge

yarn s3

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)
