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

> Use the faucet wallet to send your local account some funds in order to interact with the contract:

![image](https://user-images.githubusercontent.com/2653167/99156785-fd2a2880-2680-11eb-8665-f8415cc77d5d.png)

> Once you run the above steps you can then interact with the contract after clicking on "Example UI" and do all kinds of operations with SMILE Bonding Curve Contract.

<img width="341" alt="Screenshot 2021-01-04 at 8 13 23 AM" src="https://user-images.githubusercontent.com/26670962/103496962-191e9f00-4e66-11eb-9c0e-bd5f4bb04478.png">


> The subgraph has also been updated with the bonding curve contract so you can easily set it up seeing the instructions and interact with it with the help of the playground.

<img width="658" alt="Screenshot 2021-01-04 at 8 14 01 AM" src="https://user-images.githubusercontent.com/26670962/103496797-84b43c80-4e65-11eb-8332-79570da748c9.png">


## What is a Bonding Curve ?
![download](https://user-images.githubusercontent.com/26670962/102856353-4e7dc280-444c-11eb-891b-b1e414d9e4a5.png)

A Bonding curve is a mathematical curve that defines a relationship between price and token supply, basically as a the supply of a token increases the it's price increases as well hece the price of nth token will be less than n+1th token and so on.

# How it works ?
So basically it works like this during the deployment there is a Mock Dai contract that is deployed as well in addition to YourContract.sol and while the owner locks some mock dai into the contract to set the reserve amount which also demonstrates the use of **approve and call** i.e approving YourContract for spending mock dai and minting in the same block, then anyone can call the mint function lock up some eth and they get some SMILE (😃) Tokens minted based on a formula discussed below, and in order to get your mock dai amount back you need to call burn() and burn the SMILE (😃) tokens and based on the price at that point you get that amount of eth back.

# Price Sensitivity
As mentioned below Purchase Return is basically the number of 😃 Tokens you get when you lock in your Mock DAI Tokens, now this and Sale Return depend on mainly 3 variables
- **ReserveTokensReceived** The Amount of Mock DAI you decide to lock in.
- **ReserveTokenBalance** The Mock DAI Tokens already locked before (for testing purposes when no 😃 Tokens have been minted yet we assume the ReserveTokenBalance to be 1 wei, in a mainnet scenario as soon as the contract is deployed we transfer a small amount i.e 1 wei worth of reserve token to the contract).
- **ReserveRatio** Currently it is set at 10 % but let's see how different reserve ratio's affect the price.
<br />

![qYnG26I](https://user-images.githubusercontent.com/26670962/103397769-bd030480-4b5f-11eb-9815-8b03d8d20e82.png)

The diagram above shows some examples of bonding curves with different Reserve Ratios. In the bottom-left curve with a 10% Reserve Ratio, the price curve grow more aggressively with increasing supply. A Reserve Ratio higher than 10% would flatten towards the linear top-right shape as it approaches 50%.


## Mathmatical Formula

- **Reserve Ratio** When deploying we need to pass in a reserve ratio which currently is 100000(10 %) for high price sensitivity but can range from 0 - 100, higher reserve ratio between the Reserve Token balance and the SMILE (😃) Token will result in lower price sensitivity, meaning that each buy and sell will have a less than proportionate effect on the SMILE (😃) Token’s price movement.
Though it is calculated as Reserve Ratio = Reserve Token Balance / (SMILE Token Supply x SMILE Token Price)
<br />

- **Purchase Return**  The Amount of SMILE (😃) Token’s you get after you stake mock dai it is calculated as Purchase Return = SMILE Token Supply * ((1 + ReserveTokensReceived / ReserveTokenBalance) ^ (ReserveRatio) - 1)
<br />

- **Sale Return** The Amount of Mock DAI you get based on the amount of SMILE (😃) token's you choose to burn and the current price at that point it is calculated as Sale Return = ReserveTokenBalance * (1 - (1 - SMILE Token Received / SMILE Token Supply) ^ (1 / (ReserveRatio)))**
