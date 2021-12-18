# 🍺 Optimistic Ethereum 40s

> A starter kit for deploying SVG NFTs to Optimism with 🏗 Scaffold-ETH!

Follow this guide to deploy an 8 pack of OΞ 40s on Optimism with a frontend for your friends!

---

![eo40.me title](https://oe40.me/title.png)

---

# 🏄‍♂️ Quick Start

> clone the repo
```
git clone -b sipping-oe https://github.com/scaffold-eth/scaffold-eth sipping-oe
```

> install
```
cd sipping-oe
yarn install
```

This 🏗 scaffold-eth is pointed at the **Optimism** network out of the box. (Instead of localhost like usual.)

We will deploy directly to mainnet Optimism...

> generate a deployer address
```
yarn generate
```

> fund this deployer address with Optimistic Ethereum:
```
yarn account
```
(You can get OE from [the Teleporter](https://portr.xyz/) or [the Gateway](https://gateway.optimism.io/).)


> deploy your contract to Optimism:
```
yarn deploy
```
(Note: You can change your deploy network in `hardhat.config.js` in `packages/hardhat/`.)

(Note: If you change your deploy network, don't forget to change your `targetNetwork` in `App.jsx`!)

> You can run `yarn deploy` multiple times and it will cache deployed contracts and try again for failed ones.

---

💵 Approx Deploy Costs:

(0.0087 OE) **~$34** for the $BUZZ ERC20 Deployment ([example](https://optimistic.etherscan.io/tx/0xb6c601ddaa7a30d196abf9f33aeab4583e2a6d62fa75162346a9e727de95503d))

(0.0413 OE) **~$162** for the OE40 NFT contract ([example](https://optimistic.etherscan.io/tx/0x3fa9328d46a424eb546469de5169e67b2ec55deb43f704495126ae340f3242e6))


(0.0004 OE) **~$2** for a couple finishing transactions

**Total: 0.0508 OE**

---

> Bring up a local version of your frontend:

```
yarn start
```

You can view your frontend at: http://localhost:3000

> Try purchasing, sipping, wrapping, passing:

![image](https://user-images.githubusercontent.com/2653167/146652238-59c4a9e3-8b40-49d3-8926-b757228022e8.png)


---

> Build the static version of your site:

```
yarn build
```

You can upload the assets in the /build/ folder anywhere, but there are also handy scripts to help:

```
yarn surge
```

(See my example deployed to https://exampleoe40s.surge.sh)

OR

```
yarn s3
```

OR

```
yarn ipfs
```

👩‍❤️‍💋‍👩 Share your deployed frontend with your friends and have them mint!!!


🍾 That's it! You've deployed a decentralized application on Optimism!!! 🚀
