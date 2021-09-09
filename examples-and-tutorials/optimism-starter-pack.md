---
description: "A \U0001F3D7 scaffold-eth dev stack for \U0001F534 Optimism"
---

# 🔴 Optimism Starter Pack

## Tutorial Info

**Author:** [Austin Griffith](https://github.com/austintgriffith)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/local-optimism](https://github.com/austintgriffith/scaffold-eth/tree/local-optimism)  
**Intended audience:** Intermediate  
**Topics:** Scaffold-eth, Layer 2, Optimism

## 🏃‍♀️ Quick Start

> [optimism](https://optimism.io/) proof-of-concept

> read the [Medium article here](https://azfuller20.medium.com/optimism-scaffold-eth-draft-b76d3e6849e8)

### quickstart

```text
git clone -b local-optimism https://github.com/austintgriffith/scaffold-eth.git local-optimism

cd local-optimism
```

```text
yarn install
```

```text
yarn start
```

> in a second terminal window:

**This requires Docker**

Initiate the Optimism submodules...

```text
cd local-optimism/docker/optimism-integration
git submodule init
git submodule update
```

Kick off the local chain, l2 & relay infrastructure \(it kind of feels like a space-ship taking off\)

```text
cd local-optimism/docker/optimism-integration
make up
```

#### Deploying contracts!

This branch has several contracts

`YourContract.sol` -&gt; L2 An amended version of the basic YourContract that comes with scaffold-eth

`ERC20.sol` -&gt; L1 An ERC20 contract with a `mint(value)` function that allows any user to mint themselve some tokens

`L1ERC20Gateway.sol` The example Optimism L1 Gateway contracts

`L2DepositedERC20.sol` The example Optimism L2 Deposited ERC20 contract

**Kudos & thanks to the Optimistic Ethereum team whose** [**erc20 example**](https://github.com/ethereum-optimism/optimism-tutorial/tree/deposit-withdrawal) **this benefited from!**

> in a third terminal window, generate a local account:

```text
cd local-optimism
yarn generate
```

Send that account some ETH using the faucet from [http://localhost:3000/](http://localhost:3000/) to fund the deployments

> when the local nodes are up and running, deploy local contracts & attempt to go from L1 -&gt; L2 and back again!

```text
yarn deploy-oe
```

#### Changes to the hardhat setup on this branch...

We import the following into our `hardhat.config.js`:

```text
require('@eth-optimism/plugins/hardhat/compiler');
require('@eth-optimism/plugins/hardhat/ethers');
```

We created a dedicated `oe-deploy.js`, and split out our `deploy()` function in `utils.js` such that it can deploy on the EVM or the OVM.

`oe-deploy.js` instantiates using the specified network \(currently `localhost` or `kovan`\), deploys the above contracts, tying the bridged ERC20s, initialises the `OVM_L2DepositedERC20`, and then if `demo == true`, it demonstrates the L1-&gt;L2-&gt;L1 ERC20 bridging.

We use `const { Watcher } = require('@eth-optimism/watcher')` which monitors the relayed messages between L1 and L2.

Note that we are not able to use hardhat's usual accounts, so we use scaffold-eth's account generation...

#### frontend

There are three tabs:

* ETH bridging to Optimistic Eth \(send yourself some L1 ETH with the faucet!\) & send ETH on L1 & L2
* YourContract on L2
* OldEnglish ERC20 & Bridge contracts \(make sure you approve the Gateway to bridge!\)

#### Working Notes

* Is OE eompatible with hardhat config accounts? I had to instantiate in my deploy script
* Get a silent failure on L2 if I don't reset the nonces in Metamask
* Using OpenZeppelin contracts that import their Address.sol break:

```text
 @openzeppelin/contracts/utils/Address.sol:115:17: ParserError: OVM: SELFBALANCE is not implemented in the OVM. (We have no native ETH -- use deposited WETH instead!)
        require(address(this).balance >= value, "Address: insufficient balance for call");
```

* Get a failure on OZ Safemint \([https://docs.openzeppelin.com/contracts/3.x/api/token/erc721\#ERC721-\_safeMint-address-uint256-bytes-](https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#ERC721-_safeMint-address-uint256-bytes-)\)
* Avoiding silent failures - the initial tx response doesn't give you an indication as to whether a transaction has succeeded or failed, you need to add:

```text
await result.wait()
```

Which will then throw an error. This is different to the EVM, where the initial await transactionResponse will throw.

* Including a {value: amount} field in ovm .sol doesn't seem to throw?
* Time on L2 only updates when there is a transaction from L1 -&gt; L2

