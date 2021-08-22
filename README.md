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

![image](https://user-images.githubusercontent.com/2653167/130370221-8f3c55c4-fe74-4e1a-b472-e2d4f1fa7428.png)


(Setup *two* browsers with different addresses and add them both as `OWNERS` with a `THRESHOLD` of **2**.)

---

> Deploy the safe in one browser and paste it into the second browser:

![image](https://user-images.githubusercontent.com/2653167/130370279-34b5424f-f08a-4f76-8880-793c57d1b14b.png)

---

> Send some Rinkeby to your Safe by copying the address and using the 'wallet icon' in the top right:

![image](https://user-images.githubusercontent.com/2653167/130370297-0425ede2-846c-4d5e-b71a-4c3a6790ce77.png)

![image](https://user-images.githubusercontent.com/2653167/130370307-34763ae1-4b2a-466b-89cd-08b5751c72ba.png)

---

> Propose a transaction that sends funds vitalik.eth:

![image](https://user-images.githubusercontent.com/2653167/130370336-89288eeb-be94-49e1-8e39-eaf608002e40.png)


---

> The second browser can then sign the second signature:

![image](https://user-images.githubusercontent.com/2653167/130370374-0dc87367-ebff-4e4c-9820-c54ed1a9df95.png)


---

> After the threshold of signatures is met, anyone can execute the transacation:

![image](https://user-images.githubusercontent.com/2653167/130370390-5d083f06-178f-409f-9706-42498aed8cec.png)

---

> Check the multisig balance to make sure the funds were sent:

![image](https://user-images.githubusercontent.com/2653167/130370436-47eb5ef2-9e57-4539-af29-a4ee277214e7.png)


---



## Support

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
