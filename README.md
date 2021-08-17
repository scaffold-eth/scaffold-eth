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

This branch is entitled to showcase how you can get started integrating/using [Gnosis Safe](https://gnosis-safe.io/) which makes use of the [Gnosis Safe SDK](https://github.com/gnosis/safe-core-sdk) to create and interact with the safe to execute multi-sig transactions.


## Getting Started


### Installation

Let's start our environment for tinkering and exploring how NFT auction would work.

1. Clone the repo first
```sh
git clone -b gnosis-starter-kit https://github.com/austintgriffith/scaffold-eth.git gnosis
cd gnosis
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

This branch has no dependency on any smart contract the safe deployment is taken care by the SDK so in order to deploy un-comment the code [here](https://github.com/austintgriffith/scaffold-eth/blob/gnosis-starter-kit/packages/react-app/src/views/GnosisStarterView.jsx#L35-L39) and make sure you set the thresold and owner params on line 38 and make sure you update the safe address [here](https://github.com/austintgriffith/scaffold-eth/blob/gnosis-starter-kit/packages/react-app/src/views/GnosisStarterView.jsx#L29) after deployment

### Note

- The Branch currently is tested on the Rinkeby network so make sure to connect your rinkeby wallet

- Make sure after deployment you fund your safe with eth.




## Branch UI Walkthrough

<img width="1344" alt="initiate" src="https://user-images.githubusercontent.com/26670962/129724607-c9499f60-5833-474c-9ba0-855837ff00d1.png">

Initiate and propose the transaction

<img width="1344" alt="sign" src="https://user-images.githubusercontent.com/26670962/129724745-ecb0989d-ba9f-41ee-b4bc-734feabbc580.png">

The second owner signs the proposed transaction

<img width="1344" alt="execute" src="https://user-images.githubusercontent.com/26670962/129724819-a14ae80c-9fa8-437c-a2db-0401e5c33bbf.png">

The transaction now can be executed with the thresold being reached


## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
