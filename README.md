# 🏛️ Simple DAO with Re-Entrancy Example

> Quickly spin up a DAO smart contract where you choose the initial group of members. Members are set on deploy in the contract constructor. 

## DAO Specifics

Create and vote on a DAO proposal. The proposal struct includes a 'details' field where a IPFS hash can be placed or a simple description of the proposal. Once created, members of the PowDAO can vote on the proposal once. If a proposal is passed, the amount of crypto requested will be set aside as an allowance for the proposer to claim.

Add or kick members via a similar proposal protocol. In each proposal, there are flags which indicate the state of a particular proposal. If when processing the proposal the processProposal function sees a flag in flags[4] or flags[5], then the function knows this is a member proposal not a regular proposal. 

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