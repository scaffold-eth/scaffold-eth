---
description: tokens that represent redirected yield from lending
---

# 🏵 rTokens

## Tutorial Info

**Author:** [Saddam Asmatullayev](https://github.com/sadda11asm)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens)  
**Intended audience:** Intermediate  
**Topics:** Scaffold-eth basics, ERC-20 token, yield farming

## 🏃‍♀️ Quick Start

Table of Contents

1. [About The Project](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#about-the-project)
2. [Getting Started](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#getting-started)
   * [Prerequisites](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#prerequisites)
   * [Installation](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#installation)
3. [Smart contracts](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#usage)
4. [Let's first snatch some DAI!](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#usage)
5. [Let's mint some DAI for rScaffold!](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#usage)
6. [Pay Interest](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#contributing)
7. [Contact](https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens#contact)

### About The Project

rTokens are the tokens exchangeable for their underlying ones \(e.g. rDai -&gt; Dai\). The principle is similar to cTokens. If someone exchanges tokens for rTokens they could be able to earn interest over the time. However, what differentiates rTokens from cTokens is that with rTokens owner could also share the interest with others. Great example of that is [rTrees](https://rtrees.dappy.dev/). Here people could contribute part of their interest to plant the real trees!

### Getting Started

#### Prerequisites

In order to understand how rTokens are working I suggest to read [this](https://medium.com/@victorrortvedt/rdai-basics-a-tutorial-on-programming-interest-with-defi-458baab9477a) article where main functionality of rDai is described with examples. There are some more prerequisites mentioned, such as [ERC20](https://www.investopedia.com/news/what-erc20-and-what-does-it-mean-ethereum/) tokens, [Compound](https://www.gemini.com/cryptopedia/what-is-compound-and-how-does-it-work) and other cool stuff!

Also check [this](https://youtu.be/xcBT4Jmi5TM) if you are still not familiar with mainnet forking principle and see [this](https://github.com/austintgriffith/scaffold-eth/tree/uniswapper) branch to know how can we snatch some money from any other account in mainnet \(but in our local forkable chain\).

Here we will do similar thing 😈

#### Installation

Let's start our environment for tinkering and exploring how honeypots work.

1. Clone the repo first

```text
git clone https://github.com/austintgriffith/scaffold-eth.git defi-rtokens
cd defi-rtokens
git checkout defi-rtokens
```

1. Install dependencies

```text
yarn install
```

1. Start your React frontend

```text
yarn start
```

1. Spin up your local blockchain by forking mainnet! [Hardhat](https://hardhat.org/)

```text
yarn fork
```

1. Deploy your smart contracts to a local blockchain

```text
yarn deploy
```

This is how it looks like in my terminal:

[![image](https://user-images.githubusercontent.com/28860442/107371660-ba0c1400-6b0e-11eb-8e9c-5a4f56068298.png)](https://user-images.githubusercontent.com/28860442/107371660-ba0c1400-6b0e-11eb-8e9c-5a4f56068298.png)

If everything worked fine, you have to have something like this opened in your browser:

[![image](https://user-images.githubusercontent.com/28860442/107372681-deb4bb80-6b0f-11eb-9604-7e676a4e86c7.png)](https://user-images.githubusercontent.com/28860442/107372681-deb4bb80-6b0f-11eb-9604-7e676a4e86c7.png)

Don't pay attention to not deployed contracts - these are just interfaces we use for some reasons.

### Smart contracts

Let's navigate to `packages/hardhat/contracts` folder and check out what contracts we have there.

#### IAllocationStrategy.sol & CompoundAllocationStrategy.sol

`IAllocationStrategy.sol` is the interface for the `CompoundAllocationStrategy.sol` where some logic regarding allocation of interest is included. Here we will delegate all this logic to cDai token. And will pay more attention to sharing the interest between different hats. \(rToken logic\)

#### CErc20Interface.sol

This is the interface for the compond Tokens, e.g. cDai. We will need one of these for our rToken. We could have also used our own cToken, but I chose to use cDai instead to emphasize on rTokens more in the scope of this branch :\)

#### rScaffold.sol

This is the main contract - of our rToken - `rScaffold 🏗`.

The logic and implementation contains all the mentioned use cases of rTokens. We will cover the most important of them and then you can fork the branch and play with other functions and features :\)

### Let's first snatch some DAI!

As you open the app you can see these 3 pretty and useful buttons 😄 : [![image](https://user-images.githubusercontent.com/28860442/107376418-132a7680-6b14-11eb-9db9-d3d33a2e6126.png)](https://user-images.githubusercontent.com/28860442/107376418-132a7680-6b14-11eb-9db9-d3d33a2e6126.png)

The first one that we need is SnatchDAI button. We can snatch some DAI from local copy of whatever the real account exist on planet. Once you chose that one, you can insert it as the value of `accountToImpersonate` in App.jsx and for the `burnerWalletAddress` put your local address of the wallet from upper right corner.

So, don't forget to give you some money for gas from faucet and feel free to click the `snatchDai`! Congratulations, now you have few thousands of DAI on your dai account :\)

### Let's mint some DAI for rScaffold!

In order to mint some Dai to the contract, we need to approve the contract to take some amount from us. For that, we have that button `ApproveDai`. For simplicity and for only educational purpose we approve maximum amount, but the amount is configurable. Again change the value of `accountToImpersonate` in App.jsx and set the value of the `rTokenAddress` to address of our contract: [![image](https://user-images.githubusercontent.com/28860442/107378762-7b7a5780-6b16-11eb-8f09-19daa7fed903.png)](https://user-images.githubusercontent.com/28860442/107378762-7b7a5780-6b16-11eb-8f09-19daa7fed903.png)

Then click `Approve Dai` and we can go minting :\)

If you have read the rToken prerequisite article above, you know that there are some different mint methods we can use. We can separately create a new `hat` and then mint to that default one OR we can `mintWithNewHat` and do those 2 actions once. Let's do the second one and see what happens.

We need to enter an amount of Dai \(100\) and then multiply it by 10^18, Also we enter the addresses for our hat - where the interest would go to and the percentages how this will be divided. E.g. I want to 70% to go to me aand 30% to some other address, which I have as an incognito user: [![image](https://user-images.githubusercontent.com/28860442/107380246-e8422180-6b17-11eb-8020-509efefeeb6d.png)](https://user-images.githubusercontent.com/28860442/107380246-e8422180-6b17-11eb-8020-509efefeeb6d.png)

```text
recipients: ["0x4cdabEeaC618d5D16c3838572D3c7d3DC502A286", "0x174968d71d91020b4C827A89E08C6b42ad663BeE"]
proportions: [70, 30]
```

Then click Send! Warning: Processing of the transaction may take a while, so try again if it will be interrupted due to that. But, in most cases it should successfully convert your 100 Dai to 100rDai and create a new hat with 2 recipients for you!

You can now go and check `balanceOf` function by entering your burnerWallet address. This should show you 100 rDai! [![image](https://user-images.githubusercontent.com/28860442/107381272-e167de80-6b18-11eb-8767-9e4c6b8f38cf.png)](https://user-images.githubusercontent.com/28860442/107381272-e167de80-6b18-11eb-8767-9e4c6b8f38cf.png)

You can also check our new hat if you want - by id \(1\) or address \(your burner wallet address\).

### Pay Interest

The one of the main interesting things is to check the interest.

If we check now the balance, we will see that it is still 100. So what we need to do is to call `payInterest` in order to transfer hat interest to our account. If you do it and see the balance again you should see that some interest is earned already:

[![image](https://user-images.githubusercontent.com/28860442/107382497-22acbe00-6b1a-11eb-84c1-85e70a3f1b72.png)](https://user-images.githubusercontent.com/28860442/107382497-22acbe00-6b1a-11eb-84c1-85e70a3f1b72.png)

Similar with the other account :\)

### Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

