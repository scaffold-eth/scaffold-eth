# 🏗 scaffold-eth

> is everything you need to get started building decentralized applications powered by smart contracts

---

## quickstart

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git your-next-dapp

cd your-next-dapp
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash

yarn chain

```

> in a third terminal window:

```bash

yarn deploy

```

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📱 Open http://localhost:3000 to see the app

After app has started you should see this: 

![image](https://user-images.githubusercontent.com/28860442/103863539-4039d280-50eb-11eb-804c-e1652d90c510.png)


So, for generating an unpredictable random number (dice rolling etc.) we need to enter a commit hash and block number.

Let's first of all enter any our secret input into getHash method:

Enter any secret and click to32Bytes [ `#` button ]

![image](https://user-images.githubusercontent.com/28860442/103863599-5cd60a80-50eb-11eb-9c8e-dda087ee6b9b.png)

and then click `send`. It will generate a hash - which will be your *reveal*.
We need to save it somewhere, because no-one will know it except us.

Then take that hash and insert it into `getHash` input again - after clicking `send` button we will get our commit hash:

![image](https://user-images.githubusercontent.com/28860442/103863852-c3f3bf00-50eb-11eb-9c68-545ab79be7b2.png)

Here below your input we have our `commit` hash. Now we can commit - the hash we got and block_number:

![image](https://user-images.githubusercontent.com/28860442/103863968-fbfb0200-50eb-11eb-96cc-81ef63bd1958.png)

For safety reasons we need to enter a block_number greater than current block number - cause we use local chain, your block number starts with 1, so if you insert 1 you should have an error stating block_number should be greater than current block number.

After you clicked `send` button now we may reveal with the hash we saved before. Contract will first of all check that our reveal hash is correct, by hashing it and comparing with commit hash before. After that it will hash blockHash and revealHash together to generate random number:

![image](https://user-images.githubusercontent.com/28860442/103864435-c7d41100-50ec-11eb-9609-8ba4256877ab.png)

After you reveal hash, you can see that random number generated in console:

![image](https://user-images.githubusercontent.com/28860442/103864622-20a3a980-50ed-11eb-98a2-efc4de4c38ac.png)

You can get that random number also after it emitted from your contract.
