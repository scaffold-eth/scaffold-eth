# Loogie Tank NFT
A 1 of 1 NFT which renders loogies it owns in a fish tank.

## What is a 1 of 1 (or 1/1) NFT contract?
Checkout scaffold-eth's [mvp-nft-1of1](https://github.com/scaffold-eth/scaffold-eth/tree/mvp-nft-1of1). It's an ERC721 contract with only a single tokenId.

## What is a Loogie?
Checkout scaffold-eth's [loogie-svg-nft](https://github.com/scaffold-eth/scaffold-eth/tree/loogies-svg-nft) branch and watch its [demo](https://www.youtube.com/watch?v=m0bwE5UelEo).

[Here](https://github.com/scaffold-eth/scaffold-eth/tree/loogies-svg-nft/packages/hardhat/contracts) is the smart contract code for loogie.

Check it out on [Opensea](https://opensea.io/collection/loogies-v2), and on [etherscan](https://etherscan.io/address/0xe203cdc6011879cde80c6a1dcf322489e4786eb3).

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 this scaffold-eth repo:

```bash
git clone https://github.com/austintgriffith/scaffold-eth LoogieTank
```

> be sure to checkout the right branch of 🏗 scaffold-eth:

```bash
cd LoogieTank 
git checkout loogie-tank
```

> install and fork the mainnet locally:

```bash
yarn install
yarn fork
```

> in a second terminal window, start your 📱 frontend:

```bash
cd LoogieTank
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

Pass your own ethereum address to `args` at line 11 in `packages/hardhat/deploy/00_deploy_your_contract.js`.
```bash
cd LoogieTank
yarn deploy
```

📱 Open http://localhost:3000 to see the app. Make sure you are on local chain on your connected wallet.

> Transfer a loogie to Loogie Tank:

- This will work only if you own a loogie on ethereum mainnet. An interesting side quest it to make it work with account impersonation. Watch this [video](https://www.youtube.com/watch?v=xcBT4Jmi5TM) to learn how to impersonate an account on mainnet fork.
- If you own a Loogie, take its tokenId and transfer it to the deployed LoogieTank contract. On the Mainnet LOOG tab, call `safeTransferFrom` function. Put your address, deployed LoogieTank's address, and Loogie tokenId and click "Send".
<img width="875" alt="Screen Shot 2021-09-29 at 8 50 59 PM" src="https://user-images.githubusercontent.com/1689531/135340999-19fa76de-3363-4065-8f18-5a8748ea0ec9.png">

> Generate the tank SVG:

- Go to "Loogie Tank" tab, and enter `1` for `tokenURI` and click "Send". It will output a string.
<img width="806" alt="Screen Shot 2021-09-29 at 9 08 43 PM" src="https://user-images.githubusercontent.com/1689531/135341087-e803b4e9-314e-487b-b087-fc8906a91085.png">


- Paste it into an editor. Remove the quotations aroud the string, and replace `\"` with `"`. This gives you the SVG of the tank.
- Use any [online SVG render](https://www.freecodeformat.com/svg-editor.php) to render your tank.


> To tinker with this branch:

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📜 Edit your smart contracts in `packages/hardhat/contracts`





# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
