# 🏗 zkaffold-eth

Write and compile zero knowledge circuits with [circom](https://docs.circom.io/) and [snarkjs](https://github.com/iden3/snarkjs) in the `circom` workspace, develop smart contracts utilizing zero knowledge proofs with scaffold-eth.

## Commands


#### [ 🏃‍♀️ Quick Start ](https://github.com/austintgriffith/scaffold-eth#%EF%B8%8F-quick-start)

#### [ 🔭 Learning Solidity ](https://github.com/austintgriffith/scaffold-eth#-learning-solidity)

#### [ 📡 Deploy ](https://github.com/austintgriffith/scaffold-eth#-deploy)

#### [ 📺 Frontend](https://github.com/austintgriffith/scaffold-eth#-frontend)
- [ 🛰 Providers ](https://github.com/austintgriffith/scaffold-eth#-providers)
- [ 🖇 Hooks ](https://github.com/austintgriffith/scaffold-eth#-hooks)
- [ 📦 Components ](https://github.com/austintgriffith/scaffold-eth#-components)
- [ 🖲 UI Library ](https://github.com/austintgriffith/scaffold-eth#-ui-library)
- [ ⛑ Helpers ](https://github.com/austintgriffith/scaffold-eth#-helpers)
- [ 🎚 Extras ](https://github.com/austintgriffith/scaffold-eth#-extras)
-  <B> [ 🛳 Ship it! ](https://github.com/austintgriffith/scaffold-eth#-ship-it) </B>

#### [ 🚩 Challenges ](https://github.com/austintgriffith/scaffold-eth#-challenges)
- [ 🥩 Staking App](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)
- [ 🏵 Token Vendor ](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)

#### [ 👩‍💻 Examples & Tutorials ](https://github.com/austintgriffith/scaffold-eth#-examples-and-tutorials)
- [ 🎟 Simple NFT ](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)

#### [ Built with 🏗 scaffold-eth ](https://github.com/austintgriffith/scaffold-eth#-built-with--scaffold-eth)
- [ 🎨 Nifty.ink ](https://nifty.ink) ([code](https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev))

#### [🌉 Infrastructure ](https://github.com/austintgriffith/scaffold-eth#-infrastructure)

- [ 🛰 The Graph ](https://github.com/austintgriffith/scaffold-eth#-using-the-graph)
- [ 🔬 Tenderly ](https://github.com/austintgriffith/scaffold-eth#-using-tenderly)
- [ 🌐 Etherscan ](https://github.com/austintgriffith/scaffold-eth#-etherscan)
- [ 🔶 Infura ](https://github.com/austintgriffith/scaffold-eth#-using-infura)
-  🟪 [ Blocknative ](https://github.com/austintgriffith/scaffold-eth#-blocknative)

|-   <B> [ 📠 Legacy Content ](https://github.com/austintgriffith/scaffold-eth#-legacy-content) </B> - | - <B> [ 💬 Support Chat ](https://github.com/austintgriffith/scaffold-eth#-support-chat) </B> -|

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/austintgriffith/scaffold-eth)


---

[![ethdenvervideo](https://user-images.githubusercontent.com/2653167/109873369-e2c58c00-7c2a-11eb-8adf-0ec4b8dcae1e.png)](https://youtu.be/33gnKe7ttCc?t=477)


---
---
---

# 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/austintgriffith/scaffold-eth.git

cd scaffold-eth
```
yarn draft <CIRCUIT_NAME>
```

Creates a new file structure for `<CIRCUIT_NAME>` under `packages/circom/circuits/<CIRCUIT_NAME>` with a `circuit.circom` file and and `inputs` folder.

#### `compcir`
```
yarn compcir <CIRCUIT_NAME>
```

Compiles the `circuit.circom` under `packages/circom/circuits/<CIRCUIT_NAME>` and creates all the necessary files for the zero knowledge circuit. A solidity smart contract verifier will also be created in `packages/hardhat/contracts` as `<CIRCUIT_NAME>Verifier.sol`

#### `verify`
```
yarn verify <CIRCUIT_NAME> <INPUT_NAME>.json
```

Verifies whether a proof generated with the set of inputs found in `packages/circom/circuits/<CIRCUIT_NAME>/inputs/<INPUT_NAME>.json` is valid for the `<CIRCUIT_NAME>` zk circuit.
If no `<INPUT_NAME>.json` is provided the command will default to `input.json`.

#### `call`
```
yarn call <CIRCUIT_NAME> <INPUT_NAME>.json
```

Prints the calldata necessary to call the solidity smart contract verifier `<CIRCUIT_NAME>Verifier.sol` with `<INPUT_NAME>.json` into the terminal.
If no `<INPUT_NAME>.json` is provided the command will default to `input.json`.

## `Hash` Circuit Guide

#### Compile `hash` Circuit

- You will find a default zk-circuit `hash` under `packages/circom/circuits/hash/circuit.circom`. Open this file and try to figure out what is going on inside.

- In your terminal use the `yarn compcir hash` command to compile the `hash` zk-circuit.

- If you're on windows you will need to navigate to `packages/circom/node_modules/snarkjs/build/cli.cjs` and replace the contents of this file with a modified version found [here](https://github.com/calvbore/snarkjs/blob/master/build/cli.cjs) before you run the `compcir` command.

- You should now see the message `[INFO]  snarkJS: OK!` in your terminal after the compilation has completed.

- The contract found in `packages/hardhat/contracts/hashVerifier.sol` should now be updated as well.

#### Verify `hash` Proofs with Various Inputs

- Now navigate to `packages/circom/circuits/hash/inputs/`, you will find the two files `input.json` and `invalid.json`. These files provide the input variables for your zk-circuit. Take a look at them.

- Now run `yarn verify hash`. The `verify` command will default to use a file named `input.json`. You will receive this message: `hash: Verification OK`, along with the proof for the inputs.

- Next run `yarn verify hash input.json`, you will receive the same output as the previous command, now try `yarn verify hash invalid.json`. You will receive this message: `hash: Invalid proof`, along with the proof for the inputs.

#### Verify Proofs with a Solidity Contract

- Open two new terminals in the project root. in the first run `yarn chain`, in the second run `yarn start`. Now go back to your original terminal and run `yarn deploy`.

- After your front end has loaded grab funds from the faucet, find the `setPurpose` function and set the purpose to `Testing ZK Proofs!!`.

- Now, if the purpose has changed without any issues, in your original terminal run `yarn call hash`.

You will receive the data you will need to call the solidity zk-proof verifier. This is the data generated by default for `input.json`:
```
Generated hash_CALLDATA:
["0x21079367847c16de713f5051c84061999ac64e177086f14998144faf764f6303", "0x137f81c06d8947e111b3655dae2ba4070ded029b65f2975cba79d6b706d7b0b1"],[["0x18fb5e37e53ae119f97cdaeaf3bdb5c9d03e0a1b6a22a8ba25609dbd3d3a0ad7", "0x068b3498f67cb30fc2024029cc1d426078a450a3cef843c23734691eadd901a8"],["0x2b73f068229e65631a551706fa531902fc2b65627585e0896f49b8a189dd4fed", "0x007d5ebc3b10fbfee4bb2a8ae416b9e4407a79418947e6e91ed86ea00c98bc08"]],["0x2f2b5e54fdf9598cb9a46d5e2c4ca90059b02e10dce2bd98d915333d4073d70f", "0x0f28e58d95f8b6099a441a5c77beff93a3fa93d6236a73463a588c80c9285310"],["0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8","0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8"]
```
You will see two functions in the front end that take four arrays as inputs each: `verifyProof` and `testVerifyProof`.

`verifyProof` will take your generated proof calldata and return a bool indicating whether or not the proof is valid. Let's test it!

- This time we'll do `yarn call hash input.json` to get used to calling specific inputs. You will need to copy each array individually:

>uint256[2] a

```
["0x21079367847c16de713f5051c84061999ac64e177086f14998144faf764f6303", "0x137f81c06d8947e111b3655dae2ba4070ded029b65f2975cba79d6b706d7b0b1"]
```
>uint256[2][2] b

```
[["0x18fb5e37e53ae119f97cdaeaf3bdb5c9d03e0a1b6a22a8ba25609dbd3d3a0ad7", "0x068b3498f67cb30fc2024029cc1d426078a450a3cef843c23734691eadd901a8"],["0x2b73f068229e65631a551706fa531902fc2b65627585e0896f49b8a189dd4fed", "0x007d5ebc3b10fbfee4bb2a8ae416b9e4407a79418947e6e91ed86ea00c98bc08"]]
```
>uint256[2] c

```
["0x2f2b5e54fdf9598cb9a46d5e2c4ca90059b02e10dce2bd98d915333d4073d70f", "0x0f28e58d95f8b6099a441a5c77beff93a3fa93d6236a73463a588c80c9285310"]
```
>uint256[2] input

```
["0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8","0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8"]
```
`verifyProof` will return a `true` boolean with these inputs (as long as the compilation steps were followed as above, as the circuit was generated deterministically).

Now let's get a `false` return value!

- `yarn call hash invalid.json`

>uint256[2] a

```
["0x0b3d67fa93728d3273f36db464198780d2e04bf213d334baf3a3c1567ffa0fc1", "0x2b80d74fee22cb8d13ad9870d1939ab0e54a19065f88b46a1b1d75f59abfaeab"]
```
>uint256[2][2] b

```
[["0x27d7123af104536e9f3088bcc4eebabd0757f6d9f209dad9dfa7ab228aaf8537", "0x233ffc479116d87ddc01c09839f77fcf7c3ef8543d0fc863e28e668c8030c6b8"],["0x0fb205a3a141851234396c6b943af8e5ad3e39b547cea2246f337e980fd02cec", "0x08c4eda51ccbe6bbf710873cf2ff61ba6660253d1d66dc51f2d6d41f67314567"]]
```
>uint256[2] c

```
["0x1c446751482e590aa6eadda68c49f2b331ec276c1c4f4cf237e2a7f35e9da04d", "0x236afbafc261ea03035f2cda4850f48bf7b3cf9004aaa2930c0c0773c6d61528"]
```
>uint256[2] input

```
["0x1b60fc4b486a8264116a0f412004c7d9c4c11879e80d71f42cadb0f869e58982","0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8"]
```
These inputs will return a `false` boolean as they are an intentionally invalid proof.

Okay, let's put these same inputs in the `testVerifyProof` function.

```
Transaction Error
VM Exception while processing transaction: revert Invalid Proof
```

This is good! Let's navigate to `packages/hardhat/contracts/YourContract.sol` to see what happened.

On line 32 we see this require statement:
```
require(verifyProof(a, b, c, input), "Invalid Proof");
```
This line calls the `verifyProof` function we were playing with before and requires it to return a `true` boolean for the transaction to be accepted.

Now let's use the solidity calldata for our valid proof:

>uint256[2] a

```
["0x21079367847c16de713f5051c84061999ac64e177086f14998144faf764f6303", "0x137f81c06d8947e111b3655dae2ba4070ded029b65f2975cba79d6b706d7b0b1"]
```
>uint256[2][2] b

```
[["0x18fb5e37e53ae119f97cdaeaf3bdb5c9d03e0a1b6a22a8ba25609dbd3d3a0ad7", "0x068b3498f67cb30fc2024029cc1d426078a450a3cef843c23734691eadd901a8"],["0x2b73f068229e65631a551706fa531902fc2b65627585e0896f49b8a189dd4fed", "0x007d5ebc3b10fbfee4bb2a8ae416b9e4407a79418947e6e91ed86ea00c98bc08"]]
```
>uint256[2] c

```
["0x2f2b5e54fdf9598cb9a46d5e2c4ca90059b02e10dce2bd98d915333d4073d70f", "0x0f28e58d95f8b6099a441a5c77beff93a3fa93d6236a73463a588c80c9285310"]
```
>uint256[2] input

```
["0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8","0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8"]
```
YES!! It went though this time. And we modified a state variable of our solidity contract in the process. The contract's `verifiedHash` variable now has a value.

We just proved that we know the input value that hashes to `verifiedHash` without revealing what that value actually is!

(Although, we did not do this securely, like at all)

#### Create your own circuit

Give the `draft` command a try!
```
yarn draft <YOUR_CIRCUIT_NAME>
```
This will create a blank circuit template for you to try out!
