# 🏗 Scaffold-ETH - ABI Uploader

🧪 Interact with Solidity contracts - call methods visually

Given a constract's address and ABI, generates a dynamic form that allows the user to interact with the contract and call its methods

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git abi-uploader
cd abi-uploader
git checkout abi-uploader
```

> install and start your 👷‍ front-end:

```bash
yarn install
yarn start
```

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

The application supports two modes of operation.

First, an interactive mode where the user can enter the contract's address and ABI. The second mode is the URL parameters mode where the contract's address and ABI are passed as URL parameters.

## Interactive Mode:

In this mode the user can input the contract's address and ABI. See the image below

<img width="862" alt="ABI-Uploader-Interactive-Input" src="https://user-images.githubusercontent.com/17074344/142741685-3fe47a91-063b-41ef-8865-ae887b7c3600.png">

Use the network selector at the top of the page to change the target network

<img width="280" alt="ABI-Uploader-Interactive-Input-NetworkSelector" src="https://user-images.githubusercontent.com/17074344/142741692-d4d0db8a-7c47-4553-929c-77534816f51e.png">

If a valid address and ABI are entered, the application will build a form that contains the contract's functions. Please see the image below for a sample output.

<img width="1206" alt="ABI-Uploader-Interactve-Output" src="https://user-images.githubusercontent.com/17074344/142741696-c9e0e85a-0635-47ee-b8da-45989c31e9ff.png">

## URL Parameters Mode:

In this mode, the URL will contain the contract's address and ABI. The URL should follow the pattern below:

```
/cantract/CONTRACT_ADDRESS/CONTRACT_ABI
```

This mode allows the user to create a URL that can be passed to other users. Once opened, the user will have a form ready to interact with the contract.

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
