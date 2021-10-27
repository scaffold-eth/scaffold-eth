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

To start an auction, head over to the 'Admin' tab so you can mint a sweet NFT 🔥
Press Mint, and wait a few seconds for it to show up in the list.


# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

📚 Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

# 🛠 Buidl

Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!


 - 🚤  [Follow the full Ethereum Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c)


 - 🎟  [Create your first NFT](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)
 - 🥩  [Build a staking smart contract](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)
 - 🏵  [Deploy a token and vendor](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)
 - 🎫  [Extend the NFT example to make a "buyer mints" marketplace](https://github.com/austintgriffith/scaffold-eth/tree/buyer-mints-nft)
 - 🎲  [Learn about commit/reveal](https://github.com/austintgriffith/scaffold-eth/tree/commit-reveal-with-frontend)
 - ✍️  [Learn how ecrecover works](https://github.com/austintgriffith/scaffold-eth/tree/signature-recover)
 - 👩‍👩‍👧‍👧  [Build a multi-sig that uses off-chain signatures](https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig)
 - ⏳  [Extend the multi-sig to stream ETH](https://github.com/austintgriffith/scaffold-eth/tree/streaming-meta-multi-sig)
 - ⚖️  [Learn how a simple DEX works](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90)
 - 🦍  [Ape into learning!](https://github.com/austintgriffith/scaffold-eth/tree/aave-ape)

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
