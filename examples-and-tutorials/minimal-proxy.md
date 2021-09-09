---
description: >-
  A clever workaround where you can deploy the same contract thousands of times
  with minimal deployment costs
---

# 👨‍👦Minimal Proxy

## Tutorial Info

**Author:** [Viraz Malhotra](https://github.com/viraj124)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/minimal\_proxy](https://github.com/austintgriffith/scaffold-eth/tree/minimal_proxy)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, Contract Deployment

## 🏃‍♀️ Quick Start

```text
git clone https://github.com/austintgriffith/scaffold-eth.git

cd scaffold-eth
```

```text
yarn install
```

```text
yarn start
```

> in a second terminal window:

```text
yarn chain
```

> in a third terminal window:

```text
yarn deploy
```

[![image](https://user-images.githubusercontent.com/26670962/105990031-e9129680-60c7-11eb-98bc-4ba4cbe1bcf2.png)](https://user-images.githubusercontent.com/26670962/105990031-e9129680-60c7-11eb-98bc-4ba4cbe1bcf2.png)

> If you don't have a proxy created you can simply do it by a click of a button in a secured manne!.

[![image](https://user-images.githubusercontent.com/26670962/105990296-47d81000-60c8-11eb-961d-172f613c1941.png)](https://user-images.githubusercontent.com/26670962/105990296-47d81000-60c8-11eb-961d-172f613c1941.png)

> Once created you can fund your proxy with Mock DAI and of course eth and any erc20 asset in a mainstream scenario.

#### What the hell is Minimal Proxy ?

Say you need to deploy a wallet for each user your dApp onboards in a secure way such that say a particular user can only have control of their own wallet.

Deploying large contracts can be quite expensive, there’s a clever workaround through which you can deploy the same contract thousands of times with minimal deployment costs: It’s called [EIP 1167](https://eips.ethereum.org/EIPS/eip-1167), but let’s just call it Minimal Proxy.

If you are interested to know somewhat technical details watch this as I go a bit more technical.

#### How does it work?

Minimal means minimal. That is, all the proxy contract will do is delegate all calls to the implementation – nothing more, nothing less. Make sure you do not confuse EIP 1167 minimal proxy contracts with the proxy pattern used for contract upgrades.

EIP 1167 has nothing to do with upgradeability nor tries to replace it.

The working of a minimal proxy is as follows sequentially

* **Recieve Encoded Transaction Data** with CALLDATACOPY opcode to copy the tx data into memory.
* **Forwards the received data to Implementation Contract** i.e the contract with which the user wants to interact with using [DELEGATECALL](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7.md).
* **Retrieve the result of the external call** with the help of RETURNDATACOPY opcode.
* **Return data to the caller or revert the transaction** with the help of JUMPI, RETURN, REVERT opcodes.

#### How to interact with a external contract?

So let's say you want to interact with [compound finance](https://compound.finance/) contracts to open a new position or any other contract via your proxy contract it's not striaghtforward that you call `function execute(address _target, bytes memory _data)` in your proxy as the owner and pass the external contract's address as the \_target address your transaction will fail if you do that since when you interact with any external contract via proxy the storage context will always be that of the proxy contract.

The best way to do it to have a connector contract in between without any storage, so the how this would work is : proxy owner -&gt; proxy -&gt; connector contract -&gt; external contract

Here is an [example](https://github.com/viraj124/Compound-Finance-Connector/blob/master/Compound%20Connector%20Contract.sol) of a very simple and minimal connector contract I created a long time ago which interact with [compound's](https://compound.finance/) contracts.

#### Proxy Deployment and Interaction

The [Proxy Factory](https://ropsten.etherscan.io/address/0xa5d428357f4340139b5e811f42f765fa119cfe20) and [Proxy Implementation Contract](https://ropsten.etherscan.io/address/0xcd1affda0ba8abdd5e70776da75ec538361861db) are deployed on Ropsten, and here is the [minimal proxy](https://ropsten.etherscan.io/address/0x6111be994e49611bc1ac109659db20e98fbde261#code) for a user that was created by calling deploy as you can see it points to the minimal proxy address on etherscan and now once you get yourself one created by deploy\(\) you can make your own connector contract and use delegate call.

