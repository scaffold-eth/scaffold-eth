---
description: >-
  Discover how you can build your own NFT auction where the highest bid gets an
  NFT!
---

# 🏷 NFT Auction

## Tutorial Info

**Author:** [Viraz Malhotra](https://github.com/viraj124)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/nft-auction](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, NFTs

## 🏦🏗 scaffold-eth - NFT Auction

> Discover how you can build your own NFT auction where the highest bid gets an NFT

Table of Contents

1. [About The Project](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#about-the-project)
2. [Speed Run](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#speed-run)
3. [Getting Started](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#getting-started)
   * [Prerequisites](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#prerequisites)
   * [Installation](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#installation)
4. [Exploring smart contracts](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#smart-contracts)
5. [Practice](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#practice)
6. [Additional resources](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#additional-resources)
7. [Contact](https://github.com/austintgriffith/scaffold-eth/tree/nft-auction#contact)

### About The Project

This branch uses [buyer-mints-nft](https://github.com/austintgriffith/scaffold-eth/tree/buyer-mints-nft) as a starting point. Please refer to its own README for the context.

We will show you how a simple NFT auction can be built and also will demonstrate how you can spin it up locally as a playground.

### Speed Run

[![ethdenvervideo](https://camo.githubusercontent.com/aeeb3ea931c2cd1a5cbb1c0f983a9ada2408539b0e3f7cae2eb0c1dd046d5cab/68747470733a2f2f696d672e796f75747562652e636f6d2f76692f777331625a3556546f6c772f687164656661756c742e6a7067)](https://youtu.be/ws1bZ5VTolw)

### Getting Started

#### Prerequisites

You have to know what is an ERC721 standard and what is NFT. Please refer to [this](http://erc721.org/) and [this](https://docs.openzeppelin.com/contracts/4.x/erc721) for more information if you are not familiar with these terms.

#### Installation

Let's start our environment for tinkering and exploring how NFT auction would work.

1. Clone the repo first

```text
git clone -b nft-auction https://github.com/austintgriffith/scaffold-eth.git nft-auction
cd nft-auction
```

1. Install dependencies

```text
yarn install
```

1. Start local chain

```text
yarn chain
```

1. Start your React frontend

```text
yarn start
```

1. Deploy your smart contracts to a local blockchain

```text
yarn deploy
```

1. The ui currently depends on a json file so to generate that run

```text
yarn upload
```

### Smart contracts

Let's navigate to `packages/hardhat/contracts` folder and check out what contracts we have there.

We are mostly interested in `Auction.sol` smart contract which contains all the logic for NFT auction.

#### Auction.sol

First of all, note how we are initializing our smart contract using this line.

```text
contract Auction is IERC721Receiver
```

We inherit from [IERC721Receiver](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721Receiver) which is an interface created by OpenZeppelin. Inheriting from this contract will allow us to receive transfer of NFT from another account to our contract.

Inheriting from this contract also requires us to paste the implementation of `onERC721Received` which you can find at the bottom of the contract.

The logic for creating an auction is in `createTokenAuction` function. It takes an address of NFT contract which in our case is an address of `YourCollectible.sol` deployed to our local chain, unique token ID which is going to be sold, minimum bid and duration in seconds.

```text
ERC721(_nft).safeTransferFrom(owner, address(this), _tokenId);
tokenToAuction[_nft][_tokenId] = _auction;
```

As you can see above, creating an auction means temporarily transfer an NFT to the Auction contract and also save information about auction to our Solidity mapping.

Users place bids by calling `bid` function which basically checks that the bid which is going to be made is currently the highest one. Note that we store the entire history of all bids made to allow us to return funds back to users who did not win an auction.

`executeSale` is a function used to complete the auction and identify the winner. It simply checks the last element of all bids placed and transfers NFT to the winner. If no bids were made, NFT is returned back to the initial owner.

`cancelAuction` allows to prematurely cancel the auction and lets the initial owner to get back his NFT.

### Practice

Firstly, let's get us some funds using local faucet and mint any NFT, so we become its owner.

[![image](https://github.com/austintgriffith/scaffold-eth/raw/nft-auction/resources/mint.png)](https://github.com/austintgriffith/scaffold-eth/blob/nft-auction/resources/mint.png)

You can now note that we have an option to Start auction because we are an owner of this newly minted NFT. Let's try to start an auction!

[![image](https://github.com/austintgriffith/scaffold-eth/raw/nft-auction/resources/start_auction.png)](https://github.com/austintgriffith/scaffold-eth/blob/nft-auction/resources/start_auction.png)

The minimal bid that users will be able to place is 0.1 ETH, and the total duration for our auction will be 5 minutes.

[![image](https://github.com/austintgriffith/scaffold-eth/raw/nft-auction/resources/started_auction.png)](https://github.com/austintgriffith/scaffold-eth/blob/nft-auction/resources/started_auction.png)

Auction is now in progress, and we can complete it or cancel it. No bids were made yet so there is no information about them yet. Let's try to put some bid now.

After you submit your bid, the information about auction will be updated if your bid is the highest at this point of time.

[![image](https://github.com/austintgriffith/scaffold-eth/raw/nft-auction/resources/first_bid.png)](https://github.com/austintgriffith/scaffold-eth/blob/nft-auction/resources/first_bid.png)

We placed a bid of 0.2 ETH and now we are the highest bidder. Yay!

Now let's try to open an incognito window and place a higher bid by a different user.

[![image](https://github.com/austintgriffith/scaffold-eth/raw/nft-auction/resources/highest_bid.png)](https://github.com/austintgriffith/scaffold-eth/blob/nft-auction/resources/highest_bid.png)

We placed 0.5 ETH big as a different user and now it's the highest bid. Now let's get back to our first account to complete an auction.

[![image](https://github.com/austintgriffith/scaffold-eth/raw/nft-auction/resources/finished_auction.png)](https://github.com/austintgriffith/scaffold-eth/blob/nft-auction/resources/finished_auction.png)

As you see, after we finished the auction, we are no longer an owner of the NFT. The account which placed 0.5 ETH is now a new owner. This is why we do not have an option to start an auction now.

### Additional resources

* [Dutch auction](https://en.wikipedia.org/wiki/Dutch_auction) - The idea behind auctions used in this contract

### Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

