# 🏗 Scaffold-ETH - 🎟 Simple NFT Example

> Build, mint, and send around your own ERC721!

# 🏃‍♀️ Quick Start
Required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) and [Git](https://git-scm.com/downloads)

```
git clone https://github.com/austintgriffith/scaffold-eth.git simple-nft-example
```
```
cd offchain_dynamic_nft
git checkout offchain_dynamic_nft
yarn install
yarn start
```

> in a second terminal window:

```
cd offchain_dynamic_nft
yarn chain
```

> in a third terminal window:

```
cd offchain_dynamic_nft
yarn deploy
```

📱 Open http://localhost:3000 to see the app

> ✏️ Edit the mint script mint.js in packages/hardhat/scripts and update the toAddress to your frontend address (wallet address in the top right or localhost:3000).

![nft1](https://user-images.githubusercontent.com/526558/124386962-37e5dd00-dcb3-11eb-911e-0afce760d7ee.png)


👀 You should see your collectibles show up if you minted to the correct address:

![nft3](https://user-images.githubusercontent.com/526558/124386983-48965300-dcb3-11eb-88a7-e88ad6307976.png)

⛽️ Grab some gas for each account using the faucet https://faucet.rinkeby.io/.  In this fork, we use Alchemy as node provider and as a powerful blockchain data on-ramp so that we can access blockchain info and morph our wordcloud!  As a result, we will need to deploy on a testnet.  

# 📡 Deploy NFT smart contract!

🛰 Ready to deploy to a testnet?
> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

![nft6](https://user-images.githubusercontent.com/526558/124387061-7a0f1e80-dcb3-11eb-9f4c-19229f43adec.png)

🔐 Generate a deploy account with `yarn generate`

![nft7](https://user-images.githubusercontent.com/526558/124387064-7d0a0f00-dcb3-11eb-9d0c-195f93547fb9.png)

👛 View your deployer address using `yarn account` (You'll need to fund this account. Hint: use an instant wallet to fund your account via QR code)

![nft8](https://user-images.githubusercontent.com/526558/124387068-8004ff80-dcb3-11eb-9d0f-43fba2b3b791.png)

👨‍🎤 Deploy your NFT smart contract:
```
yarn deploy
```
> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to wherever you deployed your contract:

![nft9](https://user-images.githubusercontent.com/526558/124387095-9743ed00-dcb3-11eb-8ea5-afc25d7fef80.png)

You should see the correct network in the frontend:

![nft10](https://user-images.githubusercontent.com/526558/124387099-9a3edd80-dcb3-11eb-9a57-54a7d370589a.png)

```
Make sure your target network is present in the hardhat networks config, then either update the default network in `hardhat.config.js` to your network of choice or run:
```
yarn deploy --network NETWORK_OF_CHOICE
```

## 🔶 Alchemy!
> You will need to get a key from alchemy.io and paste it into constants.js in packages/react-app/src:

![nft13](https://user-images.githubusercontent.com/526558/124387174-d83c0180-dcb3-11eb-989e-d58ba15d26db.png)
```

```
------------

# Documentation

For a more in-depth explanation, documentation, quick start guide, tutorials, tips and many more resources, visit our documentation site: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
