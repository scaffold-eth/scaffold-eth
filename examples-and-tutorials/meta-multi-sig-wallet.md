---
description: An off-chain signature-based multi-sig wallet
---

# 💵 Meta-Multi-Sig Wallet

## Tutorial Info

**Author:** [Amogh Jahagirdar](https://github.com/0xamogh)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig](https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig)  
**Intended audience:** Intermediate  
**Topics:** Scaffold-eth basics, multi-sig wallets

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```text
git clone https://github.com/austintgriffith/scaffold-eth.git meta-multi-sig

cd meta-multi-sig

git checkout meta-multi-sig
```

```text
yarn install
```

```text
yarn start
```

> in a second terminal window:

```text
cd scaffold-eth
yarn chain
```

🔏 Edit your smart contract `MetaMultiSigWallet.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

📱 Open [http://localhost:3000](http://localhost:3000/) to see the app

> in a third terminal window:

```text
yarn backend
```

🔧 Configure your deployment in `packages/hardhat/scripts/deploy.js`

> Edit the chainid, your owner addresses, and the number of signatures required:

[![image](https://user-images.githubusercontent.com/2653167/99156751-bfc59b00-2680-11eb-8d9d-e33777173209.png)](https://user-images.githubusercontent.com/2653167/99156751-bfc59b00-2680-11eb-8d9d-e33777173209.png)

> in a fourth terminal deploy with your frontend address as one of the owners:

```text
yarn deploy
```

> Use the faucet wallet to send your multi-sig contract some funds:

[![image](https://user-images.githubusercontent.com/31567169/118389510-53315600-b63b-11eb-9daf-f0aaa479a23e.png)](https://user-images.githubusercontent.com/31567169/118389510-53315600-b63b-11eb-9daf-f0aaa479a23e.png)

> To add new owners, use the "Owners" tab:

[![image](https://user-images.githubusercontent.com/31567169/118389556-896ed580-b63b-11eb-8ed6-c1e690778c8e.png)](https://user-images.githubusercontent.com/31567169/118389556-896ed580-b63b-11eb-8ed6-c1e690778c8e.png)

This will take you to a populated transaction create page:

[![image](https://user-images.githubusercontent.com/31567169/118389576-9986b500-b63b-11eb-8411-c227b148992a.png)](https://user-images.githubusercontent.com/31567169/118389576-9986b500-b63b-11eb-8411-c227b148992a.png)

> Create & sign the new transaction:

[![image](https://user-images.githubusercontent.com/31567169/118389603-ae634880-b63b-11eb-968f-ca78c2456ddb.png)](https://user-images.githubusercontent.com/31567169/118389603-ae634880-b63b-11eb-968f-ca78c2456ddb.png)

You will see the new transaction in the pool \(this is all off-chain\):

[![image](https://user-images.githubusercontent.com/31567169/118389616-bd49fb00-b63b-11eb-82f7-f65ca2ee7e80.png)](https://user-images.githubusercontent.com/31567169/118389616-bd49fb00-b63b-11eb-82f7-f65ca2ee7e80.png)

Click on the ellipsses button \[...\] to read the details of the transaction

[![image](https://user-images.githubusercontent.com/31567169/118389642-d6eb4280-b63b-11eb-9676-da7e7afc5614.png)](https://user-images.githubusercontent.com/31567169/118389642-d6eb4280-b63b-11eb-9676-da7e7afc5614.png)

> Give your account some gas at the faucet and execute the transaction

The transction will appear as "executed" on the front page:

[![image](https://user-images.githubusercontent.com/31567169/118389655-e8cce580-b63b-11eb-8428-913c6f39e48f.png)](https://user-images.githubusercontent.com/31567169/118389655-e8cce580-b63b-11eb-8428-913c6f39e48f.png)

> Create a transaction to send some funds to your frontend account:

[![image](https://user-images.githubusercontent.com/31567169/118389693-0ef28580-b63c-11eb-95d9-c5f397bf5972.png)](https://user-images.githubusercontent.com/31567169/118389693-0ef28580-b63c-11eb-95d9-c5f397bf5972.png)

This time we will need a second signature:

[![image](https://user-images.githubusercontent.com/31567169/118389716-3cd7ca00-b63c-11eb-959e-d46ffe31e62e.png)](https://user-images.githubusercontent.com/31567169/118389716-3cd7ca00-b63c-11eb-959e-d46ffe31e62e.png)

> Sign the transacton with enough owners: [![image](https://user-images.githubusercontent.com/31567169/118389773-90e2ae80-b63c-11eb-9658-e9c411542f33.png)](https://user-images.githubusercontent.com/31567169/118389773-90e2ae80-b63c-11eb-9658-e9c411542f33.png)

\(You'll notice you don't need ⛽️gas to sign transactions.\)

> Execute the transction to transfer the funds:

[![image](https://user-images.githubusercontent.com/31567169/118389808-bff92000-b63c-11eb-9107-9af5b77d4e20.png)](https://user-images.githubusercontent.com/31567169/118389808-bff92000-b63c-11eb-9107-9af5b77d4e20.png)

\(You might need to trigger a new block by sending yourself some faucet funds or something. HartHat blocks only get mined when there is a transaction.\)

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

🔏 Edit your contracts form, `MetaMultiSigWallet.sol` in `packages/hardhat/contracts`

📝 Edit your frontend in `packages/react-app/src/views`

### ⚔️ Side Quests

**🐟 Create custom signer roles for your Wallet**

You may not want every signer to create new transfers, only allow them to sign existing transactions or a mega-admin role who will be able to veto any transaction.

**😎 Integrate this MultiSig wallet into other branches like nifty-ink**

Make a MultiSig wallet to store your precious doodle-NFTs!?

### 📡 Deploy the wallet!

🛰 Ready to deploy to a testnet?

> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

[![image](https://user-images.githubusercontent.com/2653167/109538427-4d38c980-7a7d-11eb-878b-b59b6d316014.png)](https://user-images.githubusercontent.com/2653167/109538427-4d38c980-7a7d-11eb-878b-b59b6d316014.png)

🔐 Generate a deploy account with `yarn generate`

[![image](https://user-images.githubusercontent.com/2653167/109537873-a2c0a680-7a7c-11eb-95de-729dbf3399a3.png)](https://user-images.githubusercontent.com/2653167/109537873-a2c0a680-7a7c-11eb-95de-729dbf3399a3.png)

👛 View your deployer address using `yarn account` \(You'll need to fund this account. Hint: use an [instant wallet](https://instantwallet.io/) to fund your account via QR code\)

[![image](https://user-images.githubusercontent.com/2653167/109537339-ff6f9180-7a7b-11eb-85b0-46cd72311d12.png)](https://user-images.githubusercontent.com/2653167/109537339-ff6f9180-7a7b-11eb-85b0-46cd72311d12.png)

👨‍🎤 Deploy your wallet:

```text
yarn deploy
```

> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to wherever you deployed your contract:

[![image](https://user-images.githubusercontent.com/2653167/109539175-3e9ee200-7a7e-11eb-8d26-3b107a276461.png)](https://user-images.githubusercontent.com/2653167/109539175-3e9ee200-7a7e-11eb-8d26-3b107a276461.png)

You should see the correct network in the frontend:

[![image](https://user-images.githubusercontent.com/2653167/109539305-655d1880-7a7e-11eb-9385-c169645dc2b5.png)](https://user-images.githubusercontent.com/2653167/109539305-655d1880-7a7e-11eb-9385-c169645dc2b5.png)

> Also change the poolServerUrl constant to your deployed backend \(via yarn backend\)

[![image](https://user-images.githubusercontent.com/31567169/116589184-6f3fb280-a92d-11eb-8fff-d1e32b8359ff.png)](https://user-images.githubusercontent.com/31567169/116589184-6f3fb280-a92d-11eb-8fff-d1e32b8359ff.png)

Alternatively you can use the pool server url in the above screenshot

**🔶 Infura**

> You will need to get a key from [infura.io](https://infura.io/) and paste it into `constants.js` in `packages/react-app/src`:

[![image](https://user-images.githubusercontent.com/2653167/109541146-b5d57580-7a80-11eb-9f9e-04ea33f5f45a.png)](https://user-images.githubusercontent.com/2653167/109541146-b5d57580-7a80-11eb-9f9e-04ea33f5f45a.png)

### 🛳 Ship the app!

> ⚙️ build and upload your frontend and share the url with your friends...

```text
# build it:

yarn build

# upload it:

yarn surge

OR

yarn s3

OR

yarn ipfs
```

[![image](https://user-images.githubusercontent.com/2653167/109540985-7575f780-7a80-11eb-9ebd-39079cc2eb55.png)](https://user-images.githubusercontent.com/2653167/109540985-7575f780-7a80-11eb-9ebd-39079cc2eb55.png)

> 👩‍❤️‍👨 Share your public url with friends, add signers and send some tasty ETH to a few lucky ones 😉!!

