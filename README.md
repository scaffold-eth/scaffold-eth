# 🏗 scaffold-eth - Gnosis Safe Starter Kit

> Discover how you can get started with [Gnosis Safe](https://gnosis-safe.io/)

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a>About The Branch</a>
    </li>
    <li>
      <a>Getting Started</a>
      <ul>
        <li><a>Installation</a></li>
        <li><a>Deployment</a></li>
      </ul>
    </li>
    <li><a>Branch UI Walkthrough</a></li>
    <li><a>Contact</a></li>
  </ol>
</details>

## About The Project

This branch showcases how to get started integrating/using [Gnosis Safe](https://gnosis-safe.io/) which makes use of the [Gnosis Safe SDK](https://github.com/gnosis/safe-core-sdk) to create and interact with the safe to execute multi-sig transactions.


## Getting Started


### Installation

1. Clone the repo
```sh
git clone -b gnosis-starter-kit https://github.com/austintgriffith/scaffold-eth.git gnosis-starter-kit
cd gnosis-starter-kit
```

2. Install dependencies
```bash
yarn install
```

3. Start your React frontend and make sure you are connect your rinkeby wallet
```bash
yarn start
```

## Deployment

This branch has no dependency on any smart contract the safe deployment is taken care by the SDK.

> deploy a safe using the frontend or enter an existing safe address:

![image](https://user-images.githubusercontent.com/2653167/129985013-b3562b2c-88b5-4180-9bbe-379808eb4267.png)

Edit `GnosisStarterView.jsx` in `packages/react-app/src/views` to change the deploy parameters.


## Branch UI Walkthrough

<img width="1344" alt="initiate" src="https://user-images.githubusercontent.com/26670962/129724607-c9499f60-5833-474c-9ba0-855837ff00d1.png">

Initiate and propose the transaction

<img width="1344" alt="sign" src="https://user-images.githubusercontent.com/26670962/129724745-ecb0989d-ba9f-41ee-b4bc-734feabbc580.png">

The second owner signs the proposed transaction

<img width="1344" alt="execute" src="https://user-images.githubusercontent.com/26670962/129724819-a14ae80c-9fa8-437c-a2db-0401e5c33bbf.png">

The transaction now can be executed with the thresold being reached


## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
