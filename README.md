# 🏛️ Simple DAO with Re-Entrancy Example

> Quickly spin up a DAO smart contract where you choose the initial group of members. Members are set on deploy in the contract constructor. 

## DAO Specifics

Quickly initiate a DAO by sending an array of address in the constructor of this contract on deploy. DAO proposals can be created by anyone, but only voted on by members. Members can create proposals to add or kick members. Members cannot withdraw their deposited funds once they are deposited. All deposited funds will be used for the good of the DAO.

Public Goods...
This type of DAO can be used by sports teams to pay for field time, equipment, travel, etc. Another use case is for public contruction or maintenance projects. 
A neighborhood/ town/ governoment can deposit a bunch of funds which can be democratically voted on and invoices can be submitted by the contractors.  

## Bonus

A re-entrancy proxy contract has been created to verify the security of the PowDAo contract functions. 

## 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git simple-proposal-DAO-re-entrancy-ex

cd simple-proposal-DAO-re-entrancy-ex

git checkout simple-proposal-DAO-re-entrancy-ex
```

> install and start your 👷‍ Hardhat chain:

```bash
cd simple-proposal-DAO-re-entrancy-ex
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd simple-proposal-DAO-re-entrancy-ex
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd simple-proposal-DAO-re-entrancy-ex
yarn deploy
```

🔏 Edit your smart contract `PowDAO.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app