# 🏗 scaffold-eth

> is everything you need to get started building decentralized applications powered by smart contracts

---

## quickstart

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git your-next-dapp

cd your-next-dapp
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash

yarn chain

```

> in a third terminal window:

```bash

yarn deploy

```

## What is a Bonding Curve ?
![download](https://user-images.githubusercontent.com/26670962/102856353-4e7dc280-444c-11eb-891b-b1e414d9e4a5.png)

A Bonding curve is a mathematical curve that defines a relationship between price and token supply, basically as a the supply of a token increases the it's price increases as well hece the price of nth token will be less than n+1th token and so on.

# How it works ?
So basically it works like this during the deployment there is a Mock Dai contract that is deployed as well in addition to YourContract.sol and while the owner locks some mock dai into the contract to set the reserve amount which also demonstrates the use of **approve and call** i.e approving YourContract for spending mock dai and minting in the same block, then anyone can call the mint function lock up some eth and they get some SMILE (😃) Tokens minted based on a formula discussed below, and in order to get your mock dai amount back you need to call burn() and burn the SMILE (😃) tokens and based on the price at that point you get that amount of eth back.

## Mathmatical Formula

- **Reserve Ratio** When deploying we need to pass in a reserve ratio which currently is 100000(10 %) for high price sensitivity but can range from 0 - 100, higher reserve ratio between the Reserve Token balance and the SMILE (😃) Token will result in lower price sensitivity, meaning that each buy and sell will have a less than proportionate effect on the SMILE (😃) Token’s price movement.
Though it is calculated as => **Reserve Ratio = Reserve Token Balance / (SMILE Token Supply x SMILE Token Price)**


- **Purchase Return**  The Amount of SMILE (😃) Token’s you get after you stake mock dai => **PurchaseReturn = SMILE Token Supply * ((1 + ReserveTokensReceived / ReserveTokenBalance) ^ (ReserveRatio) - 1)**


- **Sale Return** The Amount of Mock DAI you get based on the amount of SMILE (😃) token's you choose to burn and the current price at that point  => **SaleReturn = ReserveTokenBalance * (1 - (1 - SMILE Token Received / SMILE Token Supply) ^ (1 / (ReserveRatio)))**
