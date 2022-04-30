# Starknet NFT example

This dapp will deploy an ERC721 contract (written in cairo) to the starknet goerli alpha testnet.

## Accounts

When running `yarn deploy` the deploy script in `packages/hardhat/deploy/00_deploy_your_contract.js` is executed.

The deploy script has a `CREATE_NEW_ACCOUNT` flag at the top:

```javascript
const CREATE_NEW_ACCOUNT = false;
const FETCH_EXISTING_ACCOUNT = !CREATE_NEW_ACCOUNT;
```

Running the script for the first time, you'll need to create a new account.
Deployments after that can reuse the created account.

Toggle the bool flag and update the variables `const accountAddress` and `const privateKey` accordingly.

## Getting started

```bash
# install dependencies
$ yarn

# 1. terminal
# start local chain
$ yarn chain

# 2. terminal
$ cd ./packages/hardhat

# compile contracts
$ yarn starknet:compile

# deploy contracts
# (maybe you need to first create the folder /packages/hardhat/deployments)
$ yarn deploy

# start app (in top level folder)
$ yarn start
```

## Verify contract

```bash
$ cd starknet-mvp/packages/hardhat

$ sudo npx hardhat starknet-verify --starknet-network alpha-goerli --path ./contracts/ERC721.cairo --address 0x0585feed17184d7990c57febcbb8e185f6607f49a2152c2965da5f01d373a405 --show-stack-traces
```

## Resources

* [starknet](https://starkware.co/starknet/)
* [cairo-lang](https://www.cairo-lang.org/)
* [cairo-lang docs](https://www.cairo-lang.org/docs/)
* [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth)
* [starknet-hardhat-plugin](https://github.com/Shard-Labs/starknet-hardhat-plugin)
* [goerli starknet block explorer](https://goerli.voyager.online/)
