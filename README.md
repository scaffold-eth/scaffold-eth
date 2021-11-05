
# 🏗 scaffold-eth - 🎲 Push The Button
> A base template for multiplayer turn-based game on Ethereum...
---

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git push-the-button-dev

cd push-the-button-dev

git checkout push-the-button-dev
```

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd push-the-button-dev
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd push-the-button-dev
yarn deploy

```

📱 Open http://localhost:3000 to see the app

What you are seeing right now is the default “push the button template” from `minesweeper.js`

👛 Open an incognito window and navigate to http://localhost:3000 (You'll notice it has a new wallet address).


⛽️ Grab some gas for each account using the faucet:

![image](https://user-images.githubusercontent.com/31567169/110157380-87012b80-7e01-11eb-88a3-4d6652368c87.png)


🎟 Stake the ETH from each account:

![image](https://user-images.githubusercontent.com/31567169/110157434-98e2ce80-7e01-11eb-8b42-b37af72b7766.png)
---
You'll see the Pool Value, Player Count and the Participants list update

Start a round by pressing Start Game, you'll see something like this 👇🏽

![image](https://user-images.githubusercontent.com/31567169/110158029-52da3a80-7e02-11eb-9132-8108d5f5998f.png)


The game here on is pretty straightforward
- The goal is to generate the largest number by sheer luck
- The account whose turn it is to play is allowed to click the "Spin the Roulette wheel" button
- Once he clicks the button, a random number is generated via the commit-reveal scheme
- The winning number is updated if this number is the largest yet. 
- There is 30 second deadline before he loses his turn
- If he loses his turn, anybody but him can "Skip Turn" for him
- When everyone is done playing, the winner is declared and everyone can withdraw their winnings
---


🕵🏻‍♂️ Inspect the `Debug Contracts` tab to figure out what address is the `owner` of `YourCollectible`?

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

---

🔏 Edit your game variables and working fro, `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `PushTheButton.jsx` in `packages/react-app/src/views`


---

## 📡 Deploy the game!

🛰 Ready to deploy to a testnet?

> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

![image](https://user-images.githubusercontent.com/2653167/109538427-4d38c980-7a7d-11eb-878b-b59b6d316014.png)

🔐 Generate a deploy account with `yarn generate`

![image](https://user-images.githubusercontent.com/2653167/109537873-a2c0a680-7a7c-11eb-95de-729dbf3399a3.png)


👛 View your deployer address using `yarn account` (You'll need to fund this account. Hint: use an [instant wallet](https://instantwallet.io) to fund your account via QR code)

![image](https://user-images.githubusercontent.com/2653167/109537339-ff6f9180-7a7b-11eb-85b0-46cd72311d12.png)

👨‍🎤 Deploy your game:

```bash
yarn deploy
```
---

> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to wherever you deployed your contract:

![image](https://user-images.githubusercontent.com/2653167/109539175-3e9ee200-7a7e-11eb-8d26-3b107a276461.png)

You should see the correct network in the frontend:

![image](https://user-images.githubusercontent.com/2653167/109539305-655d1880-7a7e-11eb-9385-c169645dc2b5.png)

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)


## ⚔️ Side Quests

#### 🐟 Integrate L2 solutions for ETH
While playing a game, the ETH network often feels slow, integrate a L2 solution like MATIC (this one’s already done for you, try others)

#### 💰 Redesign the rewards system 
Currently the user gets heavily penalised if he misses a turn, be more kind to your players or they might not come back 😢

Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!

#### 🔶 Infura

> You will need to get a key from [infura.io](https://infura.io) and paste it into `constants.js` in `packages/react-app/src`:

![image](https://user-images.githubusercontent.com/2653167/109541146-b5d57580-7a80-11eb-9f9e-04ea33f5f45a.png)

---

## 🛳 Ship the app!

> ⚙️ build and upload your frontend and share the url with your friends...

```bash

# build it:

yarn build

# upload it:

yarn surge

OR

yarn s3

OR

yarn ipfs
```

![image](https://user-images.githubusercontent.com/2653167/109540985-7575f780-7a80-11eb-9ebd-39079cc2eb55.png)

> 👩‍❤️‍👨 Share your public url with a friend and invite them for a game!!
