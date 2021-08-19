# 🏗 scaffold-eth - 🦉 Gnosis Safe Starter Kit

> 🧫 Prototype frontend experiences that settle to a [Gnosis Safe](https://gnosis-safe.io/)


### Installation

```sh
git clone -b gnosis-starter-kit https://github.com/austintgriffith/scaffold-eth.git gnosis-starter-kit

cd gnosis-starter-kit

yarn install

yarn start
```

> 👉 Visit your frontend at http://localhost:3000




## Deployment

> 📡 deploy a safe using the frontend or enter an existing safe address:

> ( ⛽️ Grab **Rinkeby** from the [faucet](https://faucet.rinkeby.io/) )

![image](https://user-images.githubusercontent.com/2653167/129985013-b3562b2c-88b5-4180-9bbe-379808eb4267.png)

---

> 📝 Edit `GnosisStarterView.jsx` in `packages/react-app/src/views` to change the deploy parameters.

(Setup *two* browsers with different addresses and add them both as `OWNERS` with a `THRESHOLD` of **2**.)

---

> Deploy the safe in one browser and paste it into the second browser:

![image](https://user-images.githubusercontent.com/2653167/130154685-80aea63b-8e42-40f2-865d-dd8836062345.png)

---

> Send some Rinkeby to your Safe by copying the address and using the 'wallet icon' in the top right:

![image](https://user-images.githubusercontent.com/2653167/130154779-4cac727c-b415-476a-a261-0b4bcbcea443.png)

---

> Grab a random third address (incognito window?) and propose a transaction that sends funds to it:

![image](https://user-images.githubusercontent.com/2653167/130154928-12234200-6520-48f4-9600-c199761c2001.png)





---

🤮 I am unable to continue because the Gnosis Safe SDK just returns a garbage error every time I try to propose any transaction. We should not rely on thier backend. 🤮

---



## Support

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
