# Minimum Viable NFT

## 📀 A simple and stripped back minimal 1/1 NFT contract

Designed to be as simple and straightforward as possible, especially for the average joe viewing the token on etherscan!

This example of the NFT stores a simple string at the top of the contract and contains a single tokenId (the example lists it as one but it could be whatever). 

## 🤔 But why is this cool?

It reduces the amount of functions for the NFT to only provide what is neccessary for it to comply with the standard, leading to an easier to read contract and a better understanding of what is going on behind the scenes.

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 this scaffold-eth repo:

```bash
git clone https://github.com/MercuricChloride/MvpNft.git 
```

> install and start your 👷‍ Hardhat chain:

```bash
cd MvpNft 
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd MvpNft 
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd MvpNft 
yarn deploy
```

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

Change what string is stored on the contract!

Check out how easy it is to see whats going on behind the scenes in the etherscan contract!

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 🏗 Scaffold-ETH

> everything you need to build on Ethereum! 🚀

🧪 Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)



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


# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🎛 Any web3 dev environment is complex, that's why 🏗 Scaffold-ETH comes with everything you need, already working together:

- Hardhat for your local blockchain, deploying, and testing smart contracts.
- React for building a frontend, using many useful pre-made components and hooks.
- Ant for your UI. (You can easily changed to another library you prefer)
- Surge / S3 / IPFS for publishing your app.
- Tenderly / The Graph / Etherscan / Infura / Blocknative for infrastructure.
- Support for L2 / Sidechains like Optimism and Arbitrum.

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
