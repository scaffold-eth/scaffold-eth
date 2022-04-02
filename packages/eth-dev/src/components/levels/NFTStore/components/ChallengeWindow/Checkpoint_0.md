# Checkpoint 0: 📦 Install 📚

Want a fresh cloud environment? Click this to open a gitpod workspace, then skip to Checkpoint 1 after the tasks are complete.

Required:

* [Git](https://git-scm.com/downloads)
* [Node](https://nodejs.org/dist/latest-v16.x/)  (🧨 Use Node v16 or a previous version as v17 may cause errors 🧨)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

(⚠️ Don't install the linux package `yarn` make sure you install yarn with `npm i -g yarn` or even `sudo npm i -g yarn`!)

```sh
git clone https://github.com/scaffold-eth/scaffold-eth-challenges.git challenge-0-simple-nft
```
```sh
cd challenge-0-simple-nft
git checkout challenge-0-simple-nft
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```sh
cd challenge-0-simple-nft
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```sh
cd challenge-0-simple-nft
yarn deploy
```

> You can `yarn deploy --reset` to deploy a new contract any time.

📱 Open http://localhost:3000 to see the app
<br/>
<br/>
