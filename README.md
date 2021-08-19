# 🤖 Conditional Mint NFT

An ERC721 contract that allows users to mint an NFT once and only once for an existing NFT they own. (IE allow a meebit owner to claim an NFT for their meebit)

>Built with scaffold-eth!

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, 🛰 deploy your contract:
### HEADS UP! 
It's important that before deployment you change the deploy script args to point toward an existing NFT contract on a network, or the example NFT supplied in this branch.

```bash
cd scaffold-eth
yarn deploy
```

✅ Try minting yourself a new NFT with the UI! What happens if you try to mint another one for the same tokenId?

⛎ Try to mint an NFT with a tokenId that isn't yours, does it still mint? 

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app
