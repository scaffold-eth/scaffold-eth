# 🏗 scaffold-eth / Nifty Ink

NFT artwork created and sold on xDAI using meta transactions, burner wallets, and bridged to Ethereum.

```
git clone -b nifty-ink-dev https://github.com/austintgriffith/scaffold-eth.git nifty-ink
```

### Running nifty.ink on xDai / Mainnet
_This will run the nifty.ink frontend on the production smart contracts on xDai / Mainnet._

Create a .env file with the following variables in `packages/react-app`
```
REACT_APP_NETWORK_NAME=xdai
REACT_APP_NETWORK_COLOR=#f6c343
REACT_APP_USE_GSN=true
REACT_APP_GRAPHQL_ENDPOINT=https://api.thegraph.com/subgraphs/name/azf20/nifty-ink
REACT_APP_GRAPHQL_ENDPOINT_MAINNET=https://api.thegraph.com/subgraphs/name/azf20/nifty-ink-main
```
Unzip `contracts_xdai_mainnet` in `packages/react-app/src` -> this should create a new `contracts` folder
Web3 Provider Engine patch:
- https://github.com/MetaMask/web3-provider-engine/blob/c8d9a8e46703ab417aeeeba583694057f38cfdf7/index.js#L30
Set true -> false

Get the react front-end up and running - http://localhost:3000
```
cd nifty-ink

yarn install

yarn start
```

### Running nifty.ink locally
It is not currently possible to easily run cross-chain nifty.ink locally. Below are instructions for running the xDai portion of nifty.ink on a local chain ("sidechain") running on port=8456.
- The app will still look tokens on the mainchain, but it will refer to mainnet and bridge functionality will not be usable (there is a setup to test the bridge using Kovan <> Sokol)
- The instructions below do not use the GSN setup we have in the production app

Create a .env file with the following variables in `packages/react-app`
```
REACT_APP_NETWORK_COLOR=#f6c343
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:8000/subgraphs/name/azf20/nifty-ink
REACT_APP_GRAPHQL_ENDPOINT_MAINNET=https://api.thegraph.com/subgraphs/name/azf20/nifty-ink-main
```
Unzip `contracts_xdai_mainnet` in `packages/react-app/src` -> this should create a new `contracts` folder

*Terminal A:* Get the react front-end up and running - http://localhost:3000
```
cd nifty-ink

yarn install

yarn start
```
*Terminal B:* Run the local chain
```
cd nifty-ink
yarn run sidechain
```
*Terminal C:* Generate a deployment account
```
cd nifty-ink
yarn run generate
```
Take the address generated, and send it some funds using the faucet in the react-app (this is necessary to deploy the contracts). If you lose this terminal, you can find the address (and the mnemonic!) in `/packages/buidler`
Then deploy the contracts:
```
yarn run sidechaindeploy
```
You will need the contract deployment addresses to update the subgraph configuration:
Go to `packages/niftygraph/subgraph.yaml` and update the addresses for the three datasources to match the addresses from your deployment


*Terminal D:* Run a local graph node <- Requires docker
```
cd nifty-ink/docker/graph-node
docker-compose up
```

*Terminal E:* Create and deploy the subgraph on your local graph node
NOTE: if you update the Nifty smart contracts, you will need to update the ABIs in `/packages/niftygraph/abis`
```
cd nifty-ink/packages/niftygraph
yarn codegen
yarn build
yarn create-local
yarn deploy-local
```
Your local environment is up and running, get inking!

_We welcome and are eternally grateful for features and pull requests!_

-----------------------------------------------

### Contract architecture:
- NiftyRegistry - keeps track of all the other Contracts
- NiftyInk - creation of artworks
- NiftyToken - NFT Contract
- NiftyMediator - Passing Tokens across the Tokenbridge
- NiftyMain - MainChain NFT Contract (can only mint on the basis of Tokenbridge messages)
- Liker - generic "Likes" contract

Imported contracts:
- AMBMediator - generic AMB functionality
- SignatureChecker - verifying signatures (IERC1271 compatibility)

Note that some of the contracts in this repo are not the on-chain contracts, those which have been changed have their originals in /v1-contracts (the primary change is to emit an event on setting the price of an ink or a token)

### Actions:
|Action|Description|Signature supported?|GSN supported?|Payable?|
|---|---|---|---|---|
|Create|Creates an ink & mints the first token copy to the artist|y|y|n|
|Mint|Creates a copy to the specified address|y|y|n|
|Set ink price|Set the price for non-artists to buy tokens|y|y|n|
|Set token price|Set the price for an individual token|n|n|n|
|Buy Ink|Buy a new token copy at the artist-specified price|n|n|y|
|Buy Token|Buy a specific token at the token-owner specified price|n|n|y|
|Send|Send an individual token to an address|n|n|n|
|Upgrade|Transfer an individual token from xDai to mainnet, paying the relayPrice if applicable|y|n|y|
|Like|"Like" an individual ink|y|y|n|

### The upgrade path
nifty.ink lets users upgrade their xDai ink NFTs to the Ethereum mainnet. This is a one-way door! Once you upgrade you cannot bring your inks back to xDai. The xDai token is locked in the Mediator contract, and a new matching token is minted on Mainnet on the basis of the tokenbridge relay
When you upgrade, you have to pay a fee - this is to cover the costs of minting a token on mainnet, and is controlled by a [price Oracle bot](https://blockscout.com/poa/xdai/address/0xa2197a282967dAc145e85D15e7960Aa30b86b771/transactions).

### Housekeeping
- we are running a GSN2 relay on xDai at relay.tokenizationofeverything.com (manager address at `0xb54a1c00c937db7ac538edbb4d3350da1bf4d812`)
- we need to keep the xDai GSN Paymaster topped up at `0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC`
Ensure the mainnet bridge ETH topped up: [0x87533bfd390c6d11afd8df1a8c095657e0eeed0d](https://etherscan.io/address/0x87533bfd390c6d11afd8df1a8c095657e0eeed0d)
We have a GSN relay running at relay.tokenizationofeverything.com

### Sources
- [Scaffold ETH](https://github.com/austintgriffith/scaffold-eth)
- [React Canvas Draw](https://github.com/embiem/react-canvas-draw) for the drawing
- [IPFS](https://ipfs.io/) for storing the drawing and meta-information
- [xDai](https://www.xdaichain.com/) for the sidechain
- [Tokenbridge](tokenbridge.net) for the bridge to mainnet
- [TheGraph](https://thegraph.com) for the subgraph
- [antd](https://ant.design/) for the design library
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) for the boilerplate contracts
- [OpenGSN](http://opengsn.org/) for the metatransactions

-------------------------------------------------------------
