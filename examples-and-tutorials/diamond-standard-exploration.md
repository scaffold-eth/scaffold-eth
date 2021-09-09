---
description: "Diamond standard in \U0001F3D7 scaffold-eth?"
---

# 💎 Diamond Standard exploration

## Tutorial Info

**Author:** [Viraz Malhotra](https://github.com/viraj124)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/diamond-standard](https://github.com/austintgriffith/scaffold-eth/tree/diamond-standard)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, Contract Deployment, Upgradability

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
cd scaffold-eth
yarn chain
```

> in a third terminal window:

```text
cd scaffold-eth
yarn deploy
```

[![](https://camo.githubusercontent.com/6482a1d9e5feb383b02b27fbdea94b30ec643e8438386983e55d43b4b698fca0/68747470733a2f2f692e696d6775722e636f6d2f6353304b4854612e706e67)](https://camo.githubusercontent.com/6482a1d9e5feb383b02b27fbdea94b30ec643e8438386983e55d43b4b698fca0/68747470733a2f2f692e696d6775722e636f6d2f6353304b4854612e706e67)  


> You can interact with the initial version of the DeFi Facet which demonstrates 2x leverage through v1 Aave Uniswap Market.

[![](https://camo.githubusercontent.com/587e09edaf79e22911049ce164240cb930cc5ef6c95d251187c2086f14023838/68747470733a2f2f692e696d6775722e636f6d2f3264466f307a332e706e67)](https://camo.githubusercontent.com/587e09edaf79e22911049ce164240cb930cc5ef6c95d251187c2086f14023838/68747470733a2f2f692e696d6775722e636f6d2f3264466f307a332e706e67)  


> A sample defi facet zap transaction on ropsten.

#### What is Diamond Standard ?

Basically it enables people to write contracts with virtually no size limit in a modular and gas-efficient way.

Diamonds can be upgraded on the fly without having to redeploy existing functionality.

Now in a real scenario a diamond has many faces known as facets so just like that facets here are contracts that you interact with, upgrade etc through the diamond contract.

Diamond Cut is a style guide used to shape diamonds just like that to add, remove, modify any facet. We have a Diamond Cut Facet used to do the same so you can upgrade facets without any hassle.

Before diving into the UI and contracts, I will recommend to go through the [EIP](https://eips.ethereum.org/EIPS/eip-2535) to have a complete understanding of the same.

**Facets**

For demonstration purposes, the current Facet linked with the UI is a DeFi which uses [Aave Uniswap Market](https://docs.aave.com/developers/v/1.0/deployed-contracts/uniswap-market) to leverage 2x by just depositing ETH, and it can be upgraded by redeploying it again\(go through deploy.js in detail\) after changes and choosing the right upgrade action in UI.

The upgrades are done currently by directly calling the Diamond Cut Facet.

The leverage logic is as follows:

1. swap half of eth to stable coin
2. add liquidity to uniswap
3. deposit a-uni tokens to aave
4. safe borrow stable coin
5. swap half of stable coin to eth
6. add liquidity again to uniswap in same pool
7. deposit a-uni token again to aave

