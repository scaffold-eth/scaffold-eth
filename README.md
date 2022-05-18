# 🏗 Scaffold-ETH - 🔖 Create2 🏭

> a simple Create2 example using OZ's Create2.sol and YourFactory.sol to deploy YourContract.sol

> clone/fork

```bash
git clone -b create2-example https://github.com/scaffold-eth/scaffold-eth.git create2-example
```

> install and start your 👷‍ Hardhat chain:

```bash
cd create2-example
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd create2-example
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd create2-example
yarn deploy
```

Now http://localhost:3000 should show YourFactory?

![image](https://user-images.githubusercontent.com/2653167/169149898-2a63067d-4633-43c9-8775-99a5a5839447.png)



Use the YourFactory interface to deploy a new YourContract.sol with a specific **salt** (and purpose argument to pass to YourContract):

![image](https://user-images.githubusercontent.com/2653167/169150214-289af2e1-7b9d-4330-a775-3a7508ceb954.png)


The frontend will automatically load the latest YourContract interface:

![image](https://user-images.githubusercontent.com/2653167/169150332-683ad3bb-7fa9-4836-a2f7-660edccb643c.png)








# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---
