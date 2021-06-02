# 🏗 scaffold-eth - 🎨 Don't Buy Meme Clone (ERC20 Staking + ERC1155 NFTs)

## Project Summary

In this template project we'll demonstrate how to create a (simplified) clone of dontbuymeme (MEME) which works as follows:
- Users acquire the EMEM erc20 token (by default a hefty amount of tokens is minted to the deployer account in this example)
- There's 3 collections or pools, each containing a number of NFTs (ERC1155) that can be minted by spending points
- Points in a collection are acquired by staking EMEM erc20 tokens. The more tokens stake, the more points the user accrues within that collection/pool.
- Each NFT in a collection has a fixed supply and users can use the points they have acquired by staking to mint one or more of the NFTs in that collection as long as there's any left. 

## 🧠 What you'll learn

By going through this template project you'll learn:
- How to create an ERC1155 contract for NFTs. More info on the standard here: https://blog.enjincoin.io/erc-1155-the-final-token-standard-on-ethereum-a83fce9f5714
- How to create a contract that manages staking an ERC20 token into a pool, generating points

## ⚠️ Disclaimers

The smart contracts are loosely based on Don't Buy Meme's which can be found here:
- https://etherscan.io/address/0x1d90d50D5dd04FA7c8BeF89aA5872F0701Be7982#readContract
- https://etherscan.io/address/0xe4605d46fd0b3f8329d936a8b258d69276cba264#readContract

These contracts have been modified a bit to make the sample easier to deploy and run.

⚠️ The contracts and front-end code has not been audited in any form and may contain bugs. Please exercise caution before deploying them to mainnet or in a production environment.

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git dont-clone-meme

cd dont-clone-meme

git checkout dont-clone-meme
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd dont-clone-meme
yarn chain

```

> in a third terminal window:

```bash
cd dont-clone-meme
yarn deploy

```

📱 Open http://localhost:3000 to see the app

---

## 🏃‍♀️ Creating Collections and NFTs

Once you've followed the steps above, you shoul be able to access the app which should already have 3 collections available with 2, 3 and 1 NFTs respectively.

The creation of the 3 collections and the NFTs was done as part of the deploy script that you ran just now. If you open the file you should see the following code:

```
  // Deploys the ERC20 token used to stake in exchange of points in a collection
  const EMEMToken = await deploy("EMEMToken",[ethers.utils.parseEther("1000000")]);
  // Deploys the erc1155 contract for the cardds
  const collectible = await deploy("Collectible",[tokenUri]);
  // Deployes the collections contract that manages erc20 stake, points generation and erc1155 minting
  const collections = await deploy("Collections",[deployer.address, collectible.address, EMEMToken.address]);

  // Set the collectible minter to be the collections contract so it can create and mint the cards
  await collectible.transferMinter(collections.address);
```

First, we deploy the 3 contracts we have in the /packages/hardhat/contracts folder.
- EMEMToken.sol is a boilerplate erc20 token we'll use to stake in a collection
- Collections.sol manages the collections/pools available and the NFTs within each
- Collectible.sol is a simple ERC1155 NFT implementation

Once the contracts are deployed we need to make the Collections contract the `minter` account of the Collectible contract since we'll route the minting of the ERC1155 tokens through the Collectible token, so it's the only account able to create NFTs or mint more copies of an existing NFT.

Now that we have the contracts set up, the last step is actually creating the collections and the tokens within each one. We do that by running:

```
  // Create a few collections
  await collections.createPool(0,Math.floor(Date.now() / 1000),ethers.utils.parseEther("10000"),11574074074000,0,deployer.address, "My first collection");
  await collections.createPool(1,Math.floor(Date.now() / 1000),ethers.utils.parseEther("10000"),11574074074000,0,deployer.address, "Another fine collection");
  await collections.createPool(2,Math.floor(Date.now() / 1000),ethers.utils.parseEther("10000"),11574074074000,0,deployer.address, "Picasso collection");

  // Create a few cards as part of the collections
  await collections.createCard(0,10, ethers.utils.parseEther("1"),0, Math.floor(Date.now() / 1000),{gasLimit:2000000});
  await collections.createCard(0,15, ethers.utils.parseEther("2"),0, Math.floor(Date.now() / 1000),{gasLimit:2000000});
  await collections.createCard(1,5, ethers.utils.parseEther("10"),0, Math.floor(Date.now() / 1000),{gasLimit:2000000});
  await collections.createCard(1,1, ethers.utils.parseEther("1"),0, Math.floor(Date.now() / 1000),{gasLimit:2000000});
  await collections.createCard(1,1, ethers.utils.parseEther("100"),0, Math.floor(Date.now() / 1000),{gasLimit:2000000});
  await collections.createCard(2,2, ethers.utils.parseEther("2"),0, Math.floor(Date.now() / 1000),{gasLimit:2000000});
```

The code above creates 3 collections each with it's own release date, maximum amount of EMEM tokens anyone can stake, how many points a EMEM token yields, who the artist of that collection is and the title.

Then we create a few tokens on each collection with their own max supply, cost in points, eth fee and available date. 

If you wanted to add more collections and/or more NFTs to existing collections, those are the two methods you need to run.


## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

