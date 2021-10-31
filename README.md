# 🏗 Scaffold-ETH: The Merkler

The Merkler is a scaffold-eth demo branch that lets you drop ETH or ERC20 tokens to an arbitrary list of addresses for a fixed cost. Inspired by the [Uniswap Merkle Distributor](https://github.com/Uniswap/merkle-distributor/blob/master/contracts/MerkleDistributor.sol) and [astrodrop.xyz](https://astrodrop.xyz/) by zefram.eth.

This example covers:

- Generating Merkle trees and proofs
- Minimal proxy deployments
- Efficient storage with packed arrays
- Frontend CSV parsing
- Uploading JSON files to IPFS with Pinata

# 🏄‍♂️ Quick Start

Prerequisites:
[Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone -b merkler https://github.com/austintgriffith/scaffold-eth.git merkler
```

Get a (free) [Pinata account](https://app.pinata.cloud/pinmanager), and create `.env` in `/packages/react-app`:

```
REACT_APP_PINATA_API_KEY=key_goes_here
REACT_APP_PINATA_SECRET=secret_goes_here
```

> install and start your forked 👷‍ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn fork
```

> in a second terminal window, start your 📱 frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```

> You can now drop ETH or ERC20 tokens to an arbitrary list of accounts on your local fork of mainnet :)

# About the Merkler

If you want to send value to a large number of addresses, gas costs & limits make sending to the addresses one-by-one or in batches not a viable option. A common solution is to use a Merkle tree to create an airdrop to a list of tokens that is stored off-chain, but which can be validated on-chain.

From the Merkle Tree [Wikipedia entry](https://en.wikipedia.org/wiki/Merkle_tree):

> In cryptography and computer science, a hash tree or Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes. Hash trees allow efficient and secure verification of the contents of large data structures

If you store the root of a Merkle tree in a smart contract, that contract can then verify that a claim is part of that tree, based on the claim and a corresponding Merkle proof.

The Merkler is an end-to-end demonstration that lets you define, deploy and then claim Merkle drops.

## The Contracts

There are two contracts, the Merkler, and the MerkleDeployer.

### Merkler.sol

The Merkler is similar to the [Uniswap Merkle Distributor](https://github.com/Uniswap/merkle-distributor/blob/master/contracts/MerkleDistributor.sol).

Lifecycle of a Merkler:

- Initialize: the contract is initialized with the required metadata
- Redeem: users can claim by providing entries &
- Withdraw: after a given deadline, a specified user can withdraw any remaining ETH or tokens

Merkler metadata, provided at initialization:

- `assetType`: ETH or ERC20
- `token`: address for the ERC20 token (if initialized an ERC20 Merkler)
- `treeFile`: ipfs hash of the JSON data
- `root`: root of the Merkle tree
- `dropper`: the address which can claim any remaining tokens after the deadline
- `deadline`: the deadline, after which the dropped can claim any remaining ETH or tokens

The Merkler assumes that a list exists with the following structure:

```
[
  [0, 0xaddress, amount],
  [1, 0xaddress, amount],
  [2, 0xaddress, amount]
  etc...
]
```

The first entry in each row is assumed to be a unique integer. Each entry can be claimed once only by calling `redeem(uint256 index, address account, uint256 amount, bytes32[] calldata proof)`, where the proof is generated offchain using the Merkle Tree.

Calling redeem...

- Checks that the existing claim hasn't already been made
- Verifies the Merkle proof - this is easily done using [OpenZeppelin MerkleProof](https://docs.openzeppelin.com/contracts/4.x/api/utils#MerkleProof)
- Sends the corresponding tokens to the specified account

Whether a given entry has been claimed is tracked in a highly gas efficient way, by using a uint256 to uint256 mapping (this was taken from the Uniswap Merkle Distributor implementation).

The "lookup" is the "index" from the claim, and is stored in a bitmap, which means that the 256 claims (0-255) can be stored in `claimedBitMap[0]`, the next 256 in `claimedBitMap[1]` etc. _This is pretty cool_:

```
// This is a packed array of booleans.
mapping(uint256 => uint256) public claimedBitMap;

function isClaimed(uint256 index) public view returns (bool) {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    uint256 claimedWord = claimedBitMap[claimedWordIndex];
    uint256 mask = (1 << claimedBitIndex);
    return claimedWord & mask == mask;
}

function _setClaimed(uint256 index) private {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    claimedBitMap[claimedWordIndex] = claimedBitMap[claimedWordIndex] | (1 << claimedBitIndex);
}
```

Once the deadline is passed, the "dropper" address can claim any remaining ETH or tokens.

One challenge with the Merkler is that there is no way to verify on-chain whether the amount in the initial deposit is enough to cover all the claims in the Merkle Tree. That validation must be done on the front-end.

### MerkleDeployer.sol

The MerkleDeployer deploys Merklers and initializes them. This uses [OpenZeppelin Clones](https://docs.openzeppelin.com/contracts/4.x/api/proxy#Clones), which is an implementation of the [EIP-1167](https://eips.ethereum.org/EIPS/eip-1167) standard. Under this standard a new contract is deployed which delegates all calls to a specified `implementation` contract, which is very gas efficient for deployment. In the case of the MerkleDeployer, the reference implementation is a pre-deployed Merkler contract.

> This pattern is why the Merkler does not have a "constructor", instead using a single user "initializer". It is very important that it is single use, so that the Merkler can't be overridden once initialized

When a Merkler is deployed, a lot of information is emitted as part of the `Deployed` event - this will make it easy to keep track of and display in the frontend.

```
event Deployed(address indexed _address, uint256 _type, address indexed _dropper, uint256 _deadline, address indexed _token, uint256 _amount, uint256 _decimals, string _symbol);
```

When a token Merkler is deployed, the Merkle Deployer checks for the token Symbol and decimals, which means that the frontend is not relied upon to fetch these reliably.

### Potential contract enhancements

- Separate ETH and ERC20 Merkler reference contracts to reduce gas costs
- Other gas optimisations to make deployment more efficient
- Add support for dropping NFTs (this may be more complicated, as it may make sense to do this for minting, not distribution of existing tokens)

## The App

"New" lets you define and deploy Merklers.

![image](https://user-images.githubusercontent.com/9612972/139580248-b01855fb-72f9-41c6-9aa8-a4406d0edf44.png)

- Specify whether it is an ETH or ERC20 merkler
- Enter the CSV of `address,amount` pairs (the index will be added automatically). This uses `react-papaparse` to parse CSV strings into a JSON, verifies the data structure and calculates the total amount to drop.
- Optionally update advanced settings (the deadline, the owner). Then approve the ERC20 token (if required)
- Click "Deploy Merkler"

This uploads the JSON to IPFS using the [Pinata SDK](https://docs.pinata.cloud/pinata-node-sdk), calculates the root, and then calls the relevant deploy function on the MerkleDeployer with the metadata.

It then redirects to the resulting Merkler page, where you can view the claim rows and claim them, and withdraw if you are the owner. This page uses the "Deployed" event from the MerkleDeployer for meta-data, as well as fetching the source data from IPFS based on the hash (which powers the table). The claim status is also fetched performantly by using the packed array of booleans stored in the contract.

![image](https://user-images.githubusercontent.com/9612972/139580288-84c2ef00-1057-4046-9432-555e2869d865.png)

Finally, all deployed Merklers can be viewed on the "Merklers" page, with some metadata that can be generated from the "Deployed" events from the MerkleDeployer contract.

![image](https://user-images.githubusercontent.com/9612972/139579966-3cb86646-e346-4ea7-845a-9474a52232c0.png)

> When developing locally with a Hardhat fork of mainnet, the "Snatch" tab is available, which can be used to send ERC20 tokens to a specified account to any other account.

### Potential frontend enhancements

- Filtering the New Merkler events for the event in question, rather than fetching them all
- Better interaction states
- Adding other Merkler metadata (which can be stored on the file uploaded to IPFS) - e.g. title, description

# References

[Uniswap Merkle Distributor](https://github.com/Uniswap/merkle-distributor/blob/master/contracts/MerkleDistributor.sol)
[Astrodrop](https://astrodrop.xyz/) by [zefram.eth](https://twitter.com/boredGenius)
