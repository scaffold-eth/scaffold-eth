# 🏗 scaffold-eth - ⏳ Simple Stream

> a simple ETH stream where the beneficiary reports work via links when they withdraw

> anyone can deposit funds into the stream and provide guidance too

---

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/austintgriffith/scaffold-eth.git

cd scaffold-eth
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd scaffold-eth
yarn chain

```

> in a third terminal window:

```bash
cd scaffold-eth
yarn deploy

```

🔏 Edit your smart contract `SimpleStream.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

😯 The UI is mostly in `ExampleUI.jsx` in `packages/react-app/src/views`

💼 Edit your toAddress, cap, and other stream parameters in `deploy.js` in `packages/hardhat/scripts`

> Set the stream **to Address** in `deploy.js` to your address in the frontend.

![image](https://user-images.githubusercontent.com/2653167/116141391-d6433a00-a695-11eb-8c07-02edf6454b98.png)

📱 Open http://localhost:3000 to see the app

> When someone deposits into the stream, they can also provide a string of guidance:

![image](https://user-images.githubusercontent.com/2653167/116141935-8dd84c00-a696-11eb-8dd9-dd55f18746ee.png)

> ⚠️ THE UI IS INCOMPLETE, you can't put in a reason yet:

![image](https://user-images.githubusercontent.com/2653167/116142444-27076280-a697-11eb-8c30-3bd6c8c4ccb0.png)


---


## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
