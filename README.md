## Important Notes 🙂

> This smart contract protocol processes a transaction with a percentage of the transaction going to a charity of your choice. The charity will be represented by a wallet address predefined by the DefiSmile.sol smart contract. This example contract shows three separate wallets which addresses and percentages can be configured in the constructor. You can add and remove beneficiaries in the constructor. Just be sure to add a mapping and update sendFundz function.

> Why did I use allowances as opposed to directly sending to the beneficiary? I wanted the contract to be flexible as possible with the potential to add multiple charities/ beneficiaries and be able to customize the percentages. Depending on the size of the tranaction, if the resulting payout to a beneficiary is very small. It may be the case that it costs more gas to get the funds using the transfer call compared to the amount you actually recieve from the transfer. Using allowances allows the funds to accumulate before being transfered to the beneficiary. The only downside is the beneficiary pays gas to get the payout. 

> If you were to optimize this contract for fast payments in small amounts I would recommend the xDai stable chain. This way the tx fees are fractions of a penny and you can transfer very small amounts at a time to the beneficiaries.


# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git defi-smile-donations

cd defi-smile-donations

git checkout defi-smile-donations
```

> install and start your 👷‍ Hardhat chain:

```bash

yarn install

yarn start
```

> in a second terminal window, start your 📱 frontend:

```bash
cd defi-smile-donations
yarn run chain
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd defi-smile-donations
yarn deploy
```

🔏 Edit your smart contract `DefiSmile.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

Go to the second tab called "Defi Smile Dashboard".

Here you can make transactions and see totals in realtime. 

To make a test transaction open an incognito window and go to https://localhost:3000

From here you can grab the burner account address and make a transaction from your main window to the burner account. Or vise versa.

After a successful transaction try to log in as one of the charity accounts to recieve their funds. 

To do this, be sure to change the hardcoded addesses in the smart contract as well as App.jsx file. 

# Continuing Development

- Create an alternate contract package that can be deployed which utilizes a delegate call structure to withdraw payments.
