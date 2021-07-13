# 🏗 Scaffold-ETH - With GSN gassless support

> everything you need to build on Ethereum! 🚀 - using [GSN](https://opengsn.org) for gasless experience ⛽

This branch adds gasless transactions to your contract.

Now the end user doesn't need to have ETH (so the faucet is no longer required!)

Modifications to the standard "scaffold-eth":
- Added GSN support to the contract and its deployment.
- Add GSN support to the UI to wrap the injected provider
- `yarn chain` updated to start the `hardhat node` along with GSN (so there is no change to the way to bring up the project)

   Just wait for "**Relay is active**" before doing `yarn deploy`

- you no longer need to use the faucet - any account can make transactions without gas (only sign the transactions). - Transactions are paid by the paymaster


Limitations:
- Currently, only Metamask is supported (need to add support to any WalletConnect provider)

