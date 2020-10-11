# 🏗 scaffold-eth / Nifty Ink

### Running nifty.ink on xDai / Mainnet
```
git clone -b nifty-ink-dev https://github.com/austintgriffith/scaffold-eth.git nifty-ink
```

Create a .env file with the following variables in `packages/react-app`
```
REACT_APP_NETWORK_NAME=xdai
REACT_APP_NETWORK_COLOR=#f6c343
REACT_APP_USE_GSN=true
REACT_APP_GRAPHQL_ENDPOINT=https://api.thegraph.com/subgraphs/name/azf20/nifty-ink
REACT_APP_GRAPHQL_ENDPOINT_MAINNET=https://api.thegraph.com/subgraphs/name/azf20/nifty-ink-main
```
Unzip `contracts_xdai_mainnet` in `packages/react-app/src`

Get the react front-end up and running - http://localhost:3000
```
cd nifty-ink

yarn install

yarn start
```

### Running nifty.ink locally
It is not currently possible to easily run cross-chain nifty.ink locally. Below are instructions for running the xDai portion of nifty.ink on a local chain ("sidechain") running on port=8456.
- The app will still look for the main chain, but it will refer to mainnet and bridge functionality will not be usable (there is a setup to test the bridge using Kovan <> Sokol)
- The instructions below do not use the GSN setup we have in the production app


```
git clone -b nifty-ink-dev https://github.com/austintgriffith/scaffold-eth.git nifty-ink
```

Create a .env file with the following variables in `packages/react-app`
```
REACT_APP_NETWORK_COLOR=#f6c343
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:8000/subgraphs/name/azf20/nifty-ink
REACT_APP_GRAPHQL_ENDPOINT_MAINNET=https://api.thegraph.com/subgraphs/name/azf20/nifty-ink-main
```
Unzip `contracts_xdai_mainnet` in `packages/react-app/src`

Terminal A: Get the react front-end up and running - http://localhost:3000
```
cd nifty-ink

yarn install

yarn start
```
Terminal B: Run the local chain
```
cd nifty-ink
yarn run sidechain
```
Terminal C: Generate a deployment account
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


Terminal D: Run a local graph node <- Requires docker
```
cd nifty-ink/docker/graph-node
docker-compose up
```

Terminal E: Create and deploy the subgraph on your local graph node
NOTE: if you update the Nifty smart contracts, you will need to update the ABIs in `/packages/niftygraph/abis`
```
cd nifty-ink/packages/niftygraph
yarn codegen
yarn build
yarn create-local
yarn deploy-local
```

-------------------------------------------------------------

Old docs...
```
bash

git clone -b nifty-ink-dev https://github.com/austintgriffith/scaffold-eth.git nifty-ink

cd nifty-ink

## double check you are on the nifty-ink-dev branch. if not:
##git checkout nifty-ink-dev

yarn install
#(ignore warnings that look like errors node-gyp)

#start fronend
yarn start

#start local main chain
yarn run chain

#start local side chain (8546)
yarn run sidechain

#start gsn on side chain (8546)
yarn run gsn

#generate a deployer if you don't have one:
yarn run generate

#get your deployers address, balance, and nonce on various networks:
yarn run account

#(use the frontend <Faucet/> to fund your deployer from both local chains)
# or use rinkeby.instantwallet.io and kovan.instantwallet.io to send funds to the qr in yarn run account

# compile and deploy to your local chains and publish to the frontend
yarn run newlocaldeploy

##
## Note that the local deployment does not support cross-chain upgrades (no local AMB implementation)
##

##
## ☢️ Right now we are switching between "@opengsn/gsn": "^0.9.0" and "@opengsn/gsn": "2.0.0-alpha.3-patch.2"
##
## (0.9.0 for local dev env and 2.0.0-alpha.3-patch.2 for production Kovan/xDAI)
##

```
TODO mainnet bridge ETH topped up: [0x87533bfd390c6d11afd8df1a8c095657e0eeed0d](https://etherscan.io/address/0x87533bfd390c6d11afd8df1a8c095657e0eeed0d)

yarn run newdeploykovan

Update: await NiftyMain.setMediatorContractOnOtherSide("NiftyMediator.sol Address from Kovan Deploy Goes Here")

yarn run newdeploysokol

Call NiftyMediator.setMediatorContractOnOtherSide("NiftyMain.sol Address from Sokol Deploy Goes Here")

Contract architecture:
NiftyRegistry - keeps track of all the other Contracts
NiftyInk - creation of artworks
NiftyToken - NFT Contract
NiftyMediator - Passing Tokens across the Tokenbridge
NiftyMain - MainChain NFT Contract (can only mint on the basis of Tokenbridge messages)
Liker - generic "Likes" contract

Imported contracts:
AMBMediator - generic AMB functionality
SignatureChecker - verifying signatures (IERC1271 compatibility)

GSN Infrastructure:
- we are running a GSN2 relay on xDai at relay.tokenizationofeverything.com (manager address at 0xb54a1c00c937db7ac538edbb4d3350da1bf4d812)
- we need to keep the xDai GSN Paymaster topped up at 0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC

Actions:
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

## Introduction to NFTY INK

NFTY Ink lets you sign your name or draw whatever you want, immortalise that Ink on Ethereum and IPFS, and then Mint Inks as NFTs. Create and Collect all the Inks! Built with:
- [Scaffold ETH](https://github.com/austintgriffith/scaffold-eth)
- [React Canvas Draw](https://github.com/embiem/react-canvas-draw) for the drawing
- [IPFS](https://ipfs.io/) for storing the drawing and meta-information

---

## ⏱ Quickstart:

First, you'll need [NodeJS>=10](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads) installed.

💾 Clone/fork repo and then install:

```bash
git clone -b nfty-ink-dev https://github.com/austintgriffith/scaffold-eth.git nfty-dapp

cd nfty-dapp

yarn install
```

> ⌚️ This will take some time. How about a quick tour of the file structure with your favorite code editor?

> 💡 Sometimes the install throws errors like "node-gyp", try the next step even if you see problems.

---

```bash
yarn start
```

📝 This starts the front-end at http://localhost:3000

---

⛓ Start your local blockchain powered by 👷‍♀️[Buidler](https://buidler.dev/tutorial/):

```bash
yarn run chain
```

**Note**: You'll need to run this command in a new terminal window

> 🛠 [Use this eth.build](https://eth.build/build#1a21b864c6bcdb901070b64965fae825cdfc11b1915d74f058f00b114a8c129a) to double-check your local chain and account balances

---

⚙️ Compile your contracts:

```bash
yarn run compile
```

🚢 Deploy your contracts to the frontend:

```bash
yarn run deploy
```

🔍 _Watch_ for changes then compile, deploy, and hot reload the frontend:

```bash
yarn run watch
```

✨ Start our server for uploading to IPFS:

```bash
yarn run server
```



> TODO
- Add tests (🔬Test your contracts by editing `myTest.js` in `packages/buidler/contracts`)
```bash
yarn run test
```
