# 👛 Streaming Meta Multi Sig

## Tutorial Info

**Author:** [Amogh Jahagirdar](https://github.com/0xamogh)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig](https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig)  
**Intended audience:** Intermediate  
**Topics:** Scaffold-eth basics, multi-sig wallets

## 🏃‍♀️ Quick Start

```text
git clone https://github.com/austintgriffith/scaffold-eth.git streaming-meta-multi-sig

cd streaming-meta-multi-sig

git checkout streaming-meta-multi-sig
```

```text
yarn install
```

```text
yarn start
```

> in a second terminal window:

```text
cd scaffold-eth
yarn chain
```

> in a third terminal window:

```text
cd scaffold-eth
yarn deploy
```

🔏 Edit your smart contract `StreamingMetaMultiSigWallet.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

📱 Open [http://localhost:3000](http://localhost:3000/) to see the app

> in a fourth terminal window:

```text
yarn backend
```

🔧 Configure your deployment in `packages/hardhat/scripts/deploy.js`

> Edit the chainid, your owner addresses, and the number of signatures required:

[![image](https://user-images.githubusercontent.com/2653167/99156751-bfc59b00-2680-11eb-8d9d-e33777173209.png)](https://user-images.githubusercontent.com/2653167/99156751-bfc59b00-2680-11eb-8d9d-e33777173209.png)

> Deploy again with your frontend address as one of the owners:

```text
yarn deploy
```

> Use the faucet wallet to send your multi-sig contract some funds:

[![image](https://user-images.githubusercontent.com/2653167/99156785-fd2a2880-2680-11eb-8665-f8415cc77d5d.png)](https://user-images.githubusercontent.com/2653167/99156785-fd2a2880-2680-11eb-8665-f8415cc77d5d.png)

> To add new owners, use the "Owners" tab:

[![image](https://user-images.githubusercontent.com/2653167/99156881-e6380600-2681-11eb-8161-43aeb7618af6.png)](https://user-images.githubusercontent.com/2653167/99156881-e6380600-2681-11eb-8161-43aeb7618af6.png)

This will take you to a populated transaction create page:

[![image](https://user-images.githubusercontent.com/2653167/99156894-010a7a80-2682-11eb-9b19-8d749e678ce0.png)](https://user-images.githubusercontent.com/2653167/99156894-010a7a80-2682-11eb-9b19-8d749e678ce0.png)

> Create & sign the new transaction:

[![image](https://user-images.githubusercontent.com/2653167/99156898-0b2c7900-2682-11eb-96f1-aae5dfb13179.png)](https://user-images.githubusercontent.com/2653167/99156898-0b2c7900-2682-11eb-96f1-aae5dfb13179.png)

You will see the new transaction in the pool \(this is all off-chain\):

[![image](https://user-images.githubusercontent.com/2653167/99156905-2a2b0b00-2682-11eb-8da9-6016cc32aaa8.png)](https://user-images.githubusercontent.com/2653167/99156905-2a2b0b00-2682-11eb-8da9-6016cc32aaa8.png)

> Give your account some gas at the faucet and execute the transaction

The transction will appear as "executed" on the front page:

[![image](https://user-images.githubusercontent.com/2653167/99156918-6199b780-2682-11eb-89d4-7379fe5adb54.png)](https://user-images.githubusercontent.com/2653167/99156918-6199b780-2682-11eb-89d4-7379fe5adb54.png)

> Create a transaction to open a stream to your frontend account:

[![image](https://user-images.githubusercontent.com/2653167/99156945-8db53880-2682-11eb-8477-059094a99723.png)](https://user-images.githubusercontent.com/2653167/99156945-8db53880-2682-11eb-8477-059094a99723.png)

Again, this will take you to a populated transaction form:

[![image](https://user-images.githubusercontent.com/2653167/99156981-a6255300-2682-11eb-9120-090bbbba513f.png)](https://user-images.githubusercontent.com/2653167/99156981-a6255300-2682-11eb-9120-090bbbba513f.png)

This time we will need a second signature:

[![image](https://user-images.githubusercontent.com/2653167/99156994-bc331380-2682-11eb-9492-7e0c83ea0fcc.png)](https://user-images.githubusercontent.com/2653167/99156994-bc331380-2682-11eb-9492-7e0c83ea0fcc.png)

> Sign the transacton with enough owners:

[![image](https://user-images.githubusercontent.com/2653167/99157010-d10fa700-2682-11eb-8f9a-328c561e97ef.png)](https://user-images.githubusercontent.com/2653167/99157010-d10fa700-2682-11eb-8f9a-328c561e97ef.png)

\(You'll notice you don't need ⛽️gas to sign transactions.\)

> Execute the transction to open the stream:

[![image](https://user-images.githubusercontent.com/2653167/99157033-04523600-2683-11eb-8f97-1f6f3ed7b752.png)](https://user-images.githubusercontent.com/2653167/99157033-04523600-2683-11eb-8f97-1f6f3ed7b752.png)

The stream will live update with each new block mined:

[![image](https://user-images.githubusercontent.com/2653167/99157075-5004df80-2683-11eb-8438-40ab8fbd5bf5.png)](https://user-images.githubusercontent.com/2653167/99157075-5004df80-2683-11eb-8438-40ab8fbd5bf5.png)

\(You might need to trigger a new block by sending yourself some faucet funds or something. HartHat blocks only get mined when there is a transaction.\)

> Click the button any time and it will withdraw:

[![image](https://user-images.githubusercontent.com/2653167/99157102-7fb3e780-2683-11eb-8cb5-121a94d78bac.png)](https://user-images.githubusercontent.com/2653167/99157102-7fb3e780-2683-11eb-8cb5-121a94d78bac.png)

