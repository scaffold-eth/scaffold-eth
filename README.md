# 🏗 Scaffold-ETH - Flashbots bundler


🎥 Watch the walkthrough here:

[![preview](https://user-images.githubusercontent.com/2653167/178758732-20de2ab8-31ad-4c15-9c72-7bd0c96ea2e1.jpg)](https://www.youtube.com/watch?v=itPz35FGGJk)

https://www.youtube.com/watch?v=itPz35FGGJk

🧪 Interact with Solidity contracts, bundle transactions with Flashbots

Generate Flashbots bundles and broadcast them directly from the UI!

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git flashbots-bundler
cd flashbots-bundler
git checkout flashbots-bundler
```

> install and start your 👷‍ front-end:

```bash
yarn install
yarn start
```

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

The application has three windows.

📝 First, an interactive mode where the user can enter the contract's address and ABI.

💌 The second window is a UI to send funds to a specific address (can take in ENS addresses).

🤖 The third window is where the user can generate their user-specific flashbots RPC and get bundling! 

## 💻 Interactive Mode:

In this mode the user can input the contract's address and ABI. See the image below

<img width="862" alt="ABI-Uploader-Interactive-Input" src="https://user-images.githubusercontent.com/17074344/142741685-3fe47a91-063b-41ef-8865-ae887b7c3600.png">

Use the network selector at the top of the page to change the target network

If a valid address and ABI are entered, the application will build a UI that contains the contract's functions. Please see the image below for a sample output.

<img width="1206" alt="ABI-Uploader-Interactve-Output" src="https://user-images.githubusercontent.com/17074344/142741696-c9e0e85a-0635-47ee-b8da-45989c31e9ff.png">

## 🤖 Bundlin' with the Bots

Every time the user wants to send private transactions that bypass the mempool, they have to first go to the Flashbots RPC window to generate their own flashbots RPC. They can then use that RPC to now ✨[add `Flashbots` as a custom network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)✨. 

The flashbots RPC 'pretends' that each account has 100 ETH so that transactions happening inside a bundle will not revert.

⛓️ You can queue multiple transactions together! In the example, we first queued up a transaction to send some ETH to the compromised account... 

💧 Then, we queued up a withdraw transaction from the BuidlGuidl stream... 

🎉 Finally, we queued up a second transaction to rescue the ETH, sending it to the recovery target account!

As seen below, since the transaction was executed via. Flashbots bundle, they were all included in the same block, consecutively!

<img width="619" alt="Bundled" src="https://user-images.githubusercontent.com/76530366/178616159-f7583ff0-141b-4489-a787-390cd14e00e7.png">

================================================================================================

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
