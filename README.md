# Quadratic diplomacy

Built with [🏗 Scaffold-ETH](https://github.com/austintgriffith/scaffold-eth)

## 🏄‍♂️ Quick start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

#### 1. Clone repository

```bash
git clone https://github.com/carletex/quadratic-diplomacy.git
```

#### 2. Install and start your 👷‍ Hardhat chain:

```bash
cd quadratic-diplomacy
yarn install
yarn chain
```

#### 3. In a second terminal window, start your 📱 frontend:

```bash
cd quadratic-diplomacy
yarn start
```

Copy your local burner wallet address (top right)

#### 4. Deploy your contract:

In `packages/hardhat/deploy/00_deploy_your_contract.js` paste your wallet address:

```js
const TO_ADDRESS = "YOUR_FRONTEND_ADDRESS";
```

In a third terminal window, run:

```bash
cd quadratic-diplomacy
yarn deploy
```

This will deploy the contract and will add some test data (check `00_deploy_your_contract.js`)

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)
