# 👻 Lender

## Tutorial Info

**Author:** [Adam Fuller](https://github.com/azf20)  
**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/lender\#quickstart](https://github.com/austintgriffith/scaffold-eth/tree/lender#quickstart)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, Aave, ETH-DAI

> a component for depositing & borrowing assets on Aave

## Quickstart

```text
git clone -b lender https://github.com/austintgriffith/scaffold-eth.git lender-scaffold

cd lender-scaffold
```

```text
yarn install
```

```text
yarn start
```

* In a second terminal window run:

```text
yarn fork
```

This branch uses a local fork of mainnet, which is easy to do with Hardhat \([see here to learn more](https://hardhat.org/guides/mainnet-forking.html)\). The template configuration uses an Infura node, however this is not a full archive node, so it will only work for an hour or so. To get a long-lasting fork...

* Go to alchemyapi.io and get an API key for mainnet
* Replace the Infura URL with an Alchemy URL with your API key \(i.e. [https://eth-mainnet.alchemyapi.io/v2/](https://eth-mainnet.alchemyapi.io/v2/)&lt;API\_KEY\_HERE&gt;\) into the `fork` script on line 28 of /packages/hardhat/package.json

📱 Open [http://localhost:3000](http://localhost:3000/) to see the app

* Send your burner wallet some ETH using the faucet
* Swap some ETH for DAI
* Go to "Lend" and Deposit DAI into Aave
* Borrow whatever assets you want!

Notes:

* The on-chain requests are quite heavy for this branch, so it can sometimes take the mainnet fork a little while to get going - you may need to refresh several times before everything is cached.

