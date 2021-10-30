# 🏗 Scaffold-ETH - Blind Auction with Commit/Reveal

In a blind auction, all bid amounts that are submitted are unknown until after the auction has ended. The winner is the person with the highest bid when all of the bids are revealed. How can we implement blind bidding on a public ledger? 🤔

We'll use the commit/reveal pattern to conceal the bid information during the bidding period. After the auction is over, we'll reveal our bid. The seller can then pick the highest bid! Read more about commit/reveal on this [Scaffold-ETH branch](https://github.com/scaffold-eth/scaffold-eth/tree/commit-reveal-with-frontend) 🚀


# The Contracts
The NFTs auctioned off in this example are just a super simple on-chain generated SVG, check out YourCollectible.sol.

The auction contract, BlindAuction.sol, is where all of the work is performed. Let's walk through the key parts:
```
struct Bid {
    bytes32 blindBid;
    bool revealed;
}

mapping(uint256 => mapping(address => Bid)) public bids;
```
The Bid struct is what we'll use to keep track of user bids, along with the mapping. Notice the type on blindBid is bytes32. When a bid is placed (commited) it will need to be in the form of a hash value. We'll need that hash value later to verify the revealed bid.

```
struct Auction {
    address nft;
    uint256 tokenId;
    uint256 startTime;
    uint256 endTime;
    uint256 highestBid;
    address payable bidder;
    bool settled;
}
```
The Auction struct is pretty straightforward. The highestBid and bidder are stored here, which is public, but that information doesn't get populated until bids start getting revealed anyway.

## Creating a Bid
The createBid function takes in a tokenId (that should match the current item being auctioned off) and a blindBid. The blindBid should be generated using `solidityKeccak256` function built into ethers utils. The hashed data should contain the bid amount, along with some data that will make it unique across all bidders. We'll use the bidders address along with their bid amount here. Note that the commit portion does not actually require ETH to be sent. So you could say this is a non-binding bid.

## Revealing a Bid
After the auction has ended, the same hashed value must be sent along with the actual ETH amount in order to reveal a bid. If the revealed bid is the highest bid so far, the contract will keep the ETH. If there was a previous high bidder, their ETH is returned.

## Settling the Auction
Once the seller is happy with highest, they can settle the auction. This will transfer the NFT to the high bidders address, and transfer the ETH to the seller.

# The UI

> install and start your 👷‍ Hardhat chain:

```bash
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
yarn start
```

💼  You'll want to make sure to edit the deployment scripts so the contracts are transferred to your wallet address on deploy, otherwise you won't be able to mint an NFT and start an auction.

> in a third terminal window, 🛰 deploy your contract:

```bash
yarn deploy
```

📱 Open http://localhost:3000 to see the app

To start an auction, head over to the 'Admin' tab so you can mint a 🔥 NFT. Press Mint, and wait a few seconds for it to show up in the list.

![image](https://user-images.githubusercontent.com/23554636/138988783-cddee30b-9b3d-4aff-bc8c-42d33f8ec5eb.png)

Approve the transfer and start the auction. This will approve the BlindAuction contract to transfer the NFT from your address to the BlindAuction contract.

Hop over to the Auction tab, and you should see the auction has started! 🧑‍⚖️

![image](https://user-images.githubusercontent.com/23554636/138987591-17085a4c-84e7-41f6-a28d-b197dfd0ce32.png)

Now try commiting a bid! You should open an incognito window too so you can simulate multiple people commiting bids. Just make sure you remember what amount you committed! You need to re-enter that same amount during the reveal phase.

After the auction is over, you should be able to reveal your bid. If you are the owner of the contract, you'll also see a button to settle.

![image](https://user-images.githubusercontent.com/23554636/138987921-b95691c5-3a01-4023-b81a-523064668ab9.png)

Go ahead and reveal your bids, you should see the reveal events pop in as you do. Settle the auction when you've revealed all of the bids.

![image](https://user-images.githubusercontent.com/23554636/138988186-4af5f6fa-d797-4d38-a2df-5d6a57a70b7b.png)

You should see the high bid amount ETH tranferred to your account, and in the Admin tab of the address that was the winner, you should see the NFT! 💥💥💥

During the reveal phase, you can play around and test out the commit/reveal requirements. Try revealing a bid amount higher than what you committed, or try revealing without committing a bid.
