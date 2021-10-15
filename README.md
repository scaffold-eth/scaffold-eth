# 🏗 scaffold-eth - Fancy Loogie - Loogie Mashup SVG NFT

![loogie-with-topknot-mustache-contactlenses](https://user-images.githubusercontent.com/466652/137544014-15962686-365b-438d-8895-68a31aab16d1.png)

> Demonstration showing how SVG NFTs can be composed on top of each other.


## Prerequisites

This branch is an extension of [loogie-svg-nft](https://github.com/scaffold-eth/scaffold-eth/tree/loogies-svg-nft) branch (watch its [demo](https://www.youtube.com/watch?v=m0bwE5UelEo) to understand more about it) and [composable-svg-nft](https://github.com/scaffold-eth/scaffold-eth/tree/composable-svg-nft) branch.


## Getting Started

### Installation

Clone the repo:
```
git clone -b loogie-mashup https://github.com/scaffold-eth/scaffold-eth.git loogie-mashup
cd loogie-mashup
```

Install dependencies:
```
yarn install
```

Start frontend
```
cd loogie-mashup
yarn start
```

In a second terminal window, start a local blockchain
```
yarn chain
```

In a third terminal window, deploy contracts:
```
cd loogie-mashup
yarn deploy
```


## Introduction

This branch shows how to set up an SVG NFT contract so that other NFTs can use it in their SVG code. This leads to an easy composition of SVG NFTs.

Take a look at `Loogies.sol` at `packages/hardhat/contracts`. It describes an SVG NFT that is defined by two parameters: `color` and `chubbiness` randomly generated at mint. It exposes a function:
```
function renderTokenById(uint256 id) public view returns (string memory)
```

It returns the relevant SVG that be embedded in other SVG code for rendering.

Then, you can mint a FancyLoogie from a Loogie and then send another NFTs (Bow, Mustache and ContactLenses for now) to that Loogie, to be rendered as one SVG.

Take a look at `FancyLoogie.sol` at `packages/hardhat/contracts`. Its `renderTokenById` function calls the method `renderTokenById` from the other contracts  to include the SVG in its own SVG code.

## Demo

1. Go to the **Mint Loogies** tab and mint a Loogie clicking the **MINT** button.
2. Right to the minted Loogie you have the option to upgrade to a FancyLoogie. Click on `Approve`, to be able to mint a new fancy loogie using this loogie as the source. With the approval, you are approving the fancy loogie contract to transfer this loogie.

![loogie](https://user-images.githubusercontent.com/466652/137542729-c5bf606a-4e98-4222-907c-708c5428138e.png)

3. After you Approve to spend the Loogie, you have to click on the `Upgrade` button.
![loogie-upgrade](https://user-images.githubusercontent.com/466652/137543625-feb83455-1bc5-402e-bc5c-f77e5fc7150e.png)

4. Go to the last **FancyLoogies** tab and you will see your new FancyLoogie.
5. Then you can go the the **Mint Bow**, **Mint Mustache** or **Mint Contact Lenses** to mint some new stuff and transfer it to the FancyLoogie.

![fancyloogie](https://user-images.githubusercontent.com/466652/137544512-c32cdae9-8557-4aa8-88c2-bd8ad51e0614.png)


## Contact

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
