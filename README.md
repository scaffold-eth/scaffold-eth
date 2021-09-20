# 🏛️ Simple DAO with Re-Entrancy Example

> Quickly spin up a DAO smart contract where you choose the initial group of members.

![PowDAO Dashboard](https://adaptiveclaim.s3.amazonaws.com/Screenshot+2021-09-20+114944.png)

## 📘 DAO Specifics

Quickly initiate a DAO by sending an array of address in the constructor of this contract on deploy. DAO proposals can be created by anyone, but only voted on by members. Members can create proposals to add or kick members. Members cannot withdraw their deposited funds once they are deposited. All deposited funds will be used for the good of the DAO.

Public Goods...
This type of DAO can be used by sports teams to pay for field time, equipment, travel, etc. Another use case is for public contruction or maintenance projects. 
A neighborhood/ town/ governoment can deposit a bunch of funds which can be democratically voted on and invoices can be submitted by the contractors.  

## ⭐ Bonus

A re-entrancy proxy contract has been created to verify the security of the PowDAO contract withdraw function. This contract can be found in `packages/hardhat/contracts`. To mimic a re-entrancy attack, uncomment the file in the deploy script `packages\hardhat\deploy\00_deploy_your_contract.js` and uncomment the 2 function calls in the contract itself ('powdao.getPayoutUnsafe(address(this));'). On deploy, this 'attacking' smart contract will create a proposal and if the proposal is approved by DAO members the proposer can withdraw the funds. To create a re-entrancy attack when you are withdrawing your funds, use the 'getPayoutUnsafe' function versus 'getPayout' which does not have the re-entrancy vulnerability. 

Re-entrancy is caused by repeatedly calling the a fallback function in the proxy contracts receive function. This will create a loop which will be executed until it runs out of gas making repeated function calls. Try for yourself!

[Info on Re-Entrancy Attack](https://quantstamp.com/blog/what-is-a-re-entrancy-attack)

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