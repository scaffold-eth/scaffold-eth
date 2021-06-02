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

<img width="1439" alt="Screen Shot 2021-06-02 at 2 43 02 PM" src="https://user-images.githubusercontent.com/526558/120527822-2c9c4a80-c3b1-11eb-83d7-2e930310c33e.png">

---

## 🏃‍♀️ Creating Collections and NFTs

Once you've followed the steps above, you shoul be able to access the app which should already have 3 collections available with 2, 3 and 1 NFTs respectively.

The creation of the 3 collections and the NFTs was done as part of the deploy script that you ran just now. If you open the file you should see the following code:

```
  // First, we upload the metadata to IPFS and get the CID
  const file = await ipfs.add(globSource("./erc1155metadata", { recursive: true }))
  console.log(file.cid.toString());
  const tokenUri = "https://ipfs.io/ipfs/"+file.cid.toString()+"/{id}.json"
  
  // Deploys the ERC20 token used to stake in exchange of points in a collection
  const EMEMToken = await deploy("EMEMToken",[ethers.utils.parseEther("1000000")]);
  // Deploys the erc1155 contract for the cardds
  const collectible = await deploy("Collectible",[tokenUri]);
  // Deployes the collections contract that manages erc20 stake, points generation and erc1155 minting
  const collections = await deploy("Collections",[deployer.address, collectible.address, EMEMToken.address]);

  // Set the collectible minter to be the collections contract so it can create and mint the cards
  await collectible.transferMinter(collections.address);
```
First, we upload the NTFs metadata to IPFS (You on't need to understand this yet, we'll touch on this a bit later in this tutorial).

Next, we deploy the 3 contracts we have in the /packages/hardhat/contracts folder.
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

## 📑 A (very short) primer on ERC1155

Before we explore the app and how to stake tokens in order to acquire our precious NFTs, let's see what we are actually getting into.

ERC1155 defines a common interface for Non-Fungible Tokens (NFT) which can be used to represent ownership of digital goods like art pieces, land, in-game items, etc.

We won't go into much detail here as there are already tens of articles explaining how it works, but in order to understand what's happening here there's a few things that are important to know.

### ERC721 vs ERC1155 

The main difference between ERC1155 and ERC721 (the most popular NFT standard) tokens is that ERC1155 allows you have multiple identical copies of a given NFT id. For example, you can mint 10 exact copies of an art piece and an account can hold a balance of 5 of them and trade them in a batch. Whereas with ERC721 this wouldn't be possible and you would have to mint 10 tokens each with it's own id and transfer them individually.

### ERC1155 Metadata 

If you take a close look at the script we ran before where we mint 6 NFTs across 3 collections, you'll notice that at no point we are actually specifying anything in particular about the NFTs (I.E: what image they contain, what properties make each one of them special, if any, etc). That's because ERC1155 (similar to ERC721) specify that all those properties, called Metadata, are to be stored off-chain. If you go back to the first few lines we run on deploy (which I said we would touch on later), this is what we have:

```
  // First, we upload the metadata to IPFS and get the CID
  const file = await ipfs.add(globSource("./erc1155metadata", { recursive: true }))
  console.log(file.cid.toString());
  const tokenUri = "https://ipfs.io/ipfs/"+file.cid.toString()+"/{id}.json"
```

These lines take the content of `/erc1155metadata` and uploads it to IPFS. This foldder contains one json file per NFT with the same id we used to create each NFT.
(1.json corresponds to NFT of id 1). 

Finally, when we deploy the Collectible contract we specify the URI to be `[tokenUri]` which is where the folder with the metadata is stored on IPFS.
So, in summary, https://ipfs.io/ipfs/cidgeneratedonipfs/1.json will contain all the metadata for the NFT of id 1. Here is where we can go crazy on the properties we want our NFTs to have. In this example, to keep it simple, I just included the name, description and image url.

```
1.json
{"description": "It's actually a bison?","external_url": "https://austingriffith.com/portfolio/paintings/","image": "https://austingriffith.com/images/paintings/buffalo.jpg","name": "Buffalo"}
```

## 💰 Staking ERC20 on a Collection

Up until now all we did was to create the skeleton for our NFTs. We have the collections, each collection knows what NFTs they can hold, but there's actually no NFT supply yet. That's because the tokens are actually minted the moment a user exchanges the points they have in a collection for one of the collectibles. That's when the corresponding NFT is actually minted (up to it's designated max supply).

In order to try this out, select one of the 3 collections on the app in order to see the NFTs you can possibly mint from it:

<img width="1434" alt="Screen Shot 2021-06-02 at 2 46 17 PM" src="https://user-images.githubusercontent.com/526558/120527967-5190bd80-c3b1-11eb-9362-99b960785654.png">

When you enter a collection you can see how many EMEM ERC20 tokens you have stakes in that collection and how many points you have generated (according to how many tokens you have staked, for how long and what's the pool's reward rate). 

Go ahead and stake a good number of tokens so you can generate enough points quicky (staking 1000 -1000e18- will do the trick in a few seconds). Remember you first need to approve the Collections contract to spend your EMEM tokens.

Once you do that you can see your points reward go up (there's some front-end calculations involved since the contract doesn't keep track of accrued rewards in real-time). 

<img width="1421" alt="Screen Shot 2021-06-02 at 3 21 33 PM" src="https://user-images.githubusercontent.com/526558/120532853-82bfbc80-c3b6-11eb-96ad-baf8724fd939.png">

## 🗃️ Redeeming an NFT

Now that you have staked your tokens, if you want so you can Unstake them by clicking the corresponding button, which will execute `Collections.exit(pool)` on the corresponding pool.

Once you have enough points to redeem any of the tokens in that collection you should see a "Redeem" button on the item card.

Redeeming an NFT will execute `Collections.redeem(pool,id)` which in turn mints the selected token id of Collectible to the sender.

<img width="1432" alt="Screen Shot 2021-06-02 at 3 21 57 PM" src="https://user-images.githubusercontent.com/526558/120532917-9408c900-c3b6-11eb-8a80-7d6dac0cdc52.png">

## 🎨 Seeing your NFTs

Now that you have acquired some unique, priceless NFTs, you can see them by navigating to `/mycollectibles` which actually shows all the available NFTs in all the collections and how many of each of them you own (vs how many have been minted so far).

## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

