# 🏗 scaffold-eth - 📈 Bonding Curve

> Discover how you can get started with [Bonding Curve](https://yos.io/2018/11/10/bonding-curves/)

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
        <li><a>Introduction</a></li>
      </ul>
    </li>
    <li><a>Branch UI Walkthrough</a></li>
    <li><a>Contact</a></li>
  </ol>
</details>

## About The Branch

This branch is entitled to showcase how you can get started integrating/using [Bonding Curve](https://yos.io/2018/11/10/bonding-curves/) which makes use of the [Bancor's Bonding Curve Formula](https://yos.io/2018/11/10/bonding-curves/#mathematical-formula).


## Getting Started


### Installation

Let's start our environment for tinkering and exploring how NFT auction would work.

1. Clone the repo first
```sh
git clone -b bonding-curve https://github.com/austintgriffith/scaffold-eth.git bonding-curve
cd bonding-curve
```

2. Install dependencies
```bash
yarn install
```

3. Spin up local chain
```sh
yarn chain
```

4. Deploy Contracts
```sh
yarn deploy
```

5. Start React frontend
```bash
yarn start
```

## Introduction
### What is a Bonding Curve ?

![download](https://user-images.githubusercontent.com/26670962/102856353-4e7dc280-444c-11eb-891b-b1e414d9e4a5.png)

A Bonding curve is a mathematical curve that defines a relationship between price and token supply, basically as a the supply of a token increases the it's price increases as well hece the price of nth token will be less than n+1th token and so on.

So in a nutshell
```sh
token price = (supply)^2
```

### Mechanism
During the deployment when the [Smile Contract](https://github.com/austintgriffith/scaffold-eth/blob/bonding-curve/packages/hardhat/contracts/Smile.sol) get's deployed there is small ```0.0001 eth``` to set the [reserve amount](https://github.com/austintgriffith/scaffold-eth/blob/bonding-curve/packages/hardhat/contracts/Smile.sol#L14) which is required as per the Bancor Formula.

Further on as user lock in eth they get 😃 Tokens minted and the price increases with the supply and vice-versa if the user burns the token.

### Price Sensitivity
As mentioned below Purchase Return is basically the number of 😃 Tokens you get when you lock in your ETH, now this and Sale Return depend on mainly on [reserve ratio](https://github.com/austintgriffith/scaffold-eth/blob/bonding-curve/packages/hardhat/contracts/curves/BancorBondingCurve.sol#L17)

which mainly in mathmatical terms is:
```sh
Reserve Ratio = Reserve Token Balance / (Bonding Curve/Continuous Token Supply x Bonding Curve/Continuous Token Price)
```

<br />

![qYnG26I](https://user-images.githubusercontent.com/26670962/103397769-bd030480-4b5f-11eb-9815-8b03d8d20e82.png)

The diagram above shows some examples of bonding curves with different Reserve Ratios. In the bottom-left curve with a 10% Reserve Ratio, the price curve grow more aggressively with increasing supply. A Reserve Ratio higher than 10% would flatten towards the linear top-right shape as it approaches 50%.

Currently the reserve ratio is set to [30 %](https://github.com/austintgriffith/scaffold-eth/blob/bonding-curve/packages/hardhat/contracts/Smile.sol#L13) 


### Mathmatical Formula


- **Purchase Return**  The Amount of SMILE (😃) Token’s you get after you lock in eth is calculated as:
```sh
Purchase Return = SMILE Token Supply * ((1 + ReserveTokensReceived / ReserveTokenBalance) ^ (ReserveRatio) - 1)
```
<br />

- **Sale Return** The locked in eth you get back based on the amount of SMILE (😃) token's you choose to burn and the current price at that point it is calculated as:
```sh
Sale Return = ReserveTokenBalance * (1 - (1 - SMILE Token Received / SMILE Token Supply) ^ (1 / (ReserveRatio)))**
```




## Branch UI Walkthrough

Firstly, get us some funds using local faucet.

<img width="1651" alt="mint" src="https://user-images.githubusercontent.com/26670962/131658776-b2365a6e-13d5-4426-9832-aaadb9dce88d.png">

Mint the 😃 tokens by selecting the amount of eth you want to lock-in.

<img width="1638" alt="burn" src="https://user-images.githubusercontent.com/26670962/131658890-a2a0eab4-0cb5-40e8-a876-0534a22da3d0.png">

Burn a specific no of 😃 tokens

<img width="1649" alt="transfer" src="https://user-images.githubusercontent.com/26670962/131659022-06a6a4ae-40ef-4b7a-ae2a-1b6d523ee8b7.png">

Transfer your 😃 tokens to someone else


## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
