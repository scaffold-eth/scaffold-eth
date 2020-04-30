
# 🏗 scaffold-eth

> TL;DR: **fork this repo** for an Ethereum dev stack focused on *fast product iteration*

---

## ⏱ Quickstart:

First, you'll need [NodeJS>=10](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) and [Git](https://git-scm.com/downloads) installed.

💾 Clone/fork repo and then install:

```
git clone https://github.com/austintgriffith/scaffold-eth.git my-cool-new-dapp

cd my-cool-new-dapp

yarn install
```

> ⌚️ This will take some time. Take a quick tour of the files in your favorite code editor.

---

⚛️ [React](https://reactjs.org/tutorial/tutorial.html) frontend powered by 📱[create-eth-app](https://github.com/PaulRBerg/create-eth-app) using 🔧[Ethers.js](https://docs.ethers.io/ethers.js/html/index.html) and the 🦄[Uniswap](https://uniswap.org/docs/v1) template:
```
yarn start
```

📝 Edit your frontend `App.js` in `packages/react-app/src` and open http://localhost:3000

---

⛓ Start your local blockchain powered by 👷‍♀️[Buidler](https://buidler.dev/tutorial/):
```
yarn run chain
```

📝 Edit your smart contract `SmartContractWallet.sol` in `packages/buidler/contracts`

> 🤡 There is a spelling error in `packages/buidler/contracts/SmartContractWallet.sol`! <br/><br/>🤔 Can you fix "Smort Contract Wallet" and deploy the contract locally?

![image](https://user-images.githubusercontent.com/2653167/80600757-1cfe4580-89ea-11ea-897a-6e8d623403eb.png)


> ☢️ **Warning**: It is very important that you find `SmartContractWallet.sol` in `packages/buidler/contracts` because there are other contract folders and it can get confusing.

---

⚙️ Compile your contracts:
```
yarn run compile
```

🚢 Deploy your contracts to the frontend:
```
yarn run deploy
```

🔍 *Watch* for changes then compile, deploy, and hot reload the frontend:
```
yarn run watch
```

---


🔥 Your dapp hot reloads as you build your smart contracts and frontend together 🔥


---


🔬Test your contracts by editing `myTest.js` in `packages/buidler/contracts`:
```
yarn run test
```

🗝 List your local accounts:
```
yarn run accounts
```

💰 Check account balance:
```
yarn run balance **YOUR-ADDRESS**
```

💸 Send ETH:
```
yarn run send --from 0 --amount 0.5 --to **YOUR-ADDRESS**
```

> 🛠 Try [this eth.build](https://eth.build/build#1a21b864c6bcdb901070b64965fae825cdfc11b1915d74f058f00b114a8c129a) to double-check your local chain and account balances

> 🔧 Configure 👷[Buidler](https://buidler.dev/config/) by editing `buidler.config.js` in `packages/buidler`

---

 ✨ The [BuidlerEVM](https://buidler.dev/buidler-evm/) provides *stack traces* and *console.log* debugging for our contracts ✨

---

## 🏃‍♂️ Speedrun:



TODO



---

## 📱 Frontend:

<br/>

🔏 **Web3 Providers** The frontend has three different providers:

 `mainnetProvider`: (read only) [Infura](https://infura.io/) connection to main [Ethereum](https://ethereum.org/developers/) network (and contracts already deployed like [DAI](https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f#code) or [Uniswap](https://etherscan.io/address/0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667)).

  `localProvider`: local [Buidler](https://buidler.dev/) accounts, used to read from *your* contracts (`.env` file points you at testnet or mainnet)

  `injectedProvider`: your personal [MetaMask](https://metamask.io/download.html), [WalletConnect](https://walletconnect.org/apps) via [Argent](https://www.argent.xyz/), or other injected wallet (generates [burner-provider](https://www.npmjs.com/package/burner-provider) on page load)

---

 🐜 [Ant.design](https://ant.design/components/button/) is the UI library with components like the [grids](https://ant.design/components/grid/), [menus](https://ant.design/components/menu/), [dates](https://ant.design/components/date-picker/), [times](https://ant.design/components/time-picker/), [buttons](https://ant.design/components/button/), etc.

---



🖇 **/ hooks** are your commonly used Ethereum hooks located in `packages/react-app/src/`:

`usePoller(fn, delay)`: runs a function on app load and then on a custom interval

```
usePoller(()=>{
  //do something cool at start and then every three seconds
},3000)
```
<br/>

`useBalance(address,provider,[pollTime])`: poll for the balance of an address from a provider

```
const localBalance = useBalance(address,localProvider)
```
<br/>

`useBlockNumber(provider,[pollTime])`: get current block number from a provider

```
const blockNumber = useBlockNumber(props.provider)
```
<br/>

`useGasPrice([speed])`: gets current "fast" price from [ethgasstation](https://ethgasstation.info)

```
const gasPrice = useGasPrice()
```

<br/>

`useExchangePrice(mainnetProvider,pollTime)`: gets current price of Ethereum on the Uniswap exchange.

```
const price = useExchangePrice(mainnetProvider)
```

<br/>

`useContractLoader(provider)`: loads your smart contract interface

```
const readContracts = useContractLoader(localProvider);
const writeContracts = useContractLoader(injectedProvider);
```

<br/>

`useContractReader(contracts,contractName,variableName,pollTime)`: reads a variable from your contract and keeps it in the state

```
const title = useContractReader(props.readContracts,contractName,"title");
const owner = useContractReader(props.readContracts,contractName,"owner");
```

---


📦 **/ components** are your commonly used Ethereum components located in `packages/react-app/src/`:

<br/>

📬 `<Address />`: A simple display for an Ethereum address that uses a [Blockie](https://www.npmjs.com/package/ethereum-blockies), lets you copy, and links to [Etherescan](https://etherscan.io/).

```
  <Address value={address} />
  <Address value={address} size="short" />
  <Address value={address} size="long" blockexplorer="https://blockscout.com/poa/xdai/address/"/>
  <Address value={address} ensProvider={mainnetProvider}/>
```

![ensaddress](https://user-images.githubusercontent.com/2653167/80522487-e375fd80-8949-11ea-84fd-0de3eab5cd03.gif)

<br/>


<br/>

💵 `<Balance />`: Displays the balance of an address in either dollars or decimal.
```
<Balance
  address={address}
  provider={injectedProvider}
  dollarMultiplier={price}
/>
```

![balance](https://user-images.githubusercontent.com/2653167/80522919-86c71280-894a-11ea-8f61-70bac7a72106.gif)

<br/>

<br/>

👤 `<Account />`: Allows your users to start with an Ethereum address on page load but upgrade to a more secure, injected provider, using [Web3Modal](https://web3modal.com/). It will track your `address` and `localProvider` in your app's state:
```
const [address, setAddress] = useState();
const [injectedProvider, setInjectedProvider] = useState();
const price = useExchangePrice(mainnetProvider)
```
```
<Account
  address={address}
  setAddress={setAddress}
  localProvider={localProvider}
  injectedProvider={injectedProvider}
  setInjectedProvider={setInjectedProvider}
  dollarMultiplier={price}
/>
```
![account](https://user-images.githubusercontent.com/2653167/80527048-fdffa500-8950-11ea-9a0f-576be87e4368.gif)

> 💡 **Notice**: the `<Account />` component will call `setAddress` and `setInjectedProvider` for you.

> ☢️ **Warning**: You will need to update the configuration for `Web3Modal` to use *your* [Infura Id](https://infura.io/login)

<br/>

<br/>

📡 `<Provider />`: You can choose to display the provider connection status to your users with:
```
<Provider name={"mainnet"} provider={mainnetProvider} />
<Provider name={"local"} provider={localProvider} />
<Provider name={"injected"} provider={injectedProvider} />
```

![providere](https://user-images.githubusercontent.com/2653167/80524033-3781e180-894c-11ea-8965-98eb5e2e5e71.gif)

> 💡 **Notice**: you will need to check the network id of your `injectedProvider` compared to your `localProvider` or `mainnetProvider` and alert your users if they are on the wrong network!

<br/>

`Notify`: TODO

<br/>

`Transactor`: TODO

---

## 📄 Smart Contract Wallet:



TODO

---


📚 OpenZeppelin Contracts -- TODO

🗓 Event Parsing -- TODO

🛰 The Graph -- TODO


---

 MY SMART CONTRACT! TODO

> 🛠 Run [this eth.build](https://eth.build/build#32f1ecd6d90518387f2f34c47176bf67fdf55c855bff39f85de08d76696b850f) with your contract address to ask it who its owner is.

---

## 📋 Manifest?

[ *last updated 00/00/0000* ]

| Package | Version |
| ----------- | ----------- |
| TODO | TODO |
| TODO | TODO |


---

## ☑️ TODO:

- [x] ~~TODO~~
- [ ] TODO
- [ ] TODO


---

## 🗺 Step-By-Step Guide?


❇️ **NodeJS**

First, You will also need to [install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NodeJS >=10](https://buidler.dev/tutorial/setting-up-the-environment.html)

TODO - translate medium article over with added stuff - focus on a frentend win first before bringing in the blockchain - table of contents - hooks lib and comps to make less copy paste

TODO

---

TODO

---

TODO

---

TODO
