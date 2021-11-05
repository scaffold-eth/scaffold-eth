<<<<<<< HEAD
# 🏗 scaffold-eth - ⏳ Simple Stream

> a simple ETH stream where the beneficiary reports work via links when they withdraw

> anyone can deposit funds into the stream and provide guidance too

---

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)
=======
# 🏗 Scaffold-ETH

> everything you need to build on Ethereum! 🚀

🧪 Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)


# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)
>>>>>>> c416428e26177656d6d9a0fb5475137dda6b0c86

> clone/fork 🏗 scaffold-eth:

```bash
<<<<<<< HEAD
git clone https://github.com/austintgriffith/scaffold-eth.git simple-stream

cd simple-stream

git checkout simple-stream
=======
git clone https://github.com/austintgriffith/scaffold-eth.git
>>>>>>> c416428e26177656d6d9a0fb5475137dda6b0c86
```

> install and start your 👷‍ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy

```
---

💼 Edit your **toAddress**, **cap**, **frequency**, and other stream parameters in `deploy.js` in `packages/hardhat/scripts`

---

🔏 Edit your smart contract `SimpleStream.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

😯 The UI is mostly in `ExampleUI.jsx` in `packages/react-app/src/views`

📱 Open http://localhost:3000 to see the app

---


![image](https://user-images.githubusercontent.com/2653167/117220266-1ad08300-adc4-11eb-9f14-cd794b018299.png)


---

> Set the stream **toAddress** in `deploy.js` to your address in the frontend:

![image](https://user-images.githubusercontent.com/2653167/117186936-9c122080-ad98-11eb-9fd6-5e951c3c39d9.png)

Normally you will want to configure your **frequency** to be much longer, but it starts at *two minutes* for local testing.

> ⚠️ Make sure you have `deploy.js` edited so it is streaming to **your** frontend account:

![image](https://user-images.githubusercontent.com/2653167/117215801-fec8e380-adbb-11eb-89f8-bca3477652c1.png)

---

Notice in the 'deploy.js' we automatically send **2 ETH** to the contract:

![image](https://user-images.githubusercontent.com/2653167/117216414-f45b1980-adbc-11eb-8d39-9257057f2d31.png)

That means it has enough to pay out **0.5 ETH** 4 times over an **8 minute period**:

![image](https://user-images.githubusercontent.com/2653167/117217614-e3aba300-adbe-11eb-85f2-de92f3dd4ebc.png)


---

The stream will start *empty* and flow at a rate of **0.5 ETH** every **two minutes**:


![faucetstream mov](https://user-images.githubusercontent.com/2653167/117219039-ad235780-adc1-11eb-9f16-828fb00076fb.gif)

> ⚠️ Since your local node only mines a block when you send a transaction, you might want to send yourself funds from the faucet to see the stream fill up:

---

> Withdraw from your stream by posting a github link and an amount:

![streamwithdraw mov](https://user-images.githubusercontent.com/2653167/117219080-bdd3cd80-adc1-11eb-9cb9-5fa2d1005337.gif)

---

A work log will form, tracking your progress:

![image](https://user-images.githubusercontent.com/2653167/117219794-3b4c0d80-adc3-11eb-86b4-83961ceeddf2.png)


---

An initial deposit occurs in the `deploy.js` but you can also depoit using the frontend:

![image](https://user-images.githubusercontent.com/2653167/117219949-8a923e00-adc3-11eb-8455-e1d4bc5bc829.png)


> ⚠️ You can give yourself $1,000,000 in local ETH using the faucet wallet icon (bottom left)


---
---
---
---

## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

---

