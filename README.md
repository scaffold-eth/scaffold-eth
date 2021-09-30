# 🏗 Scaffold-ETH - Circom Starter Kit

> everything you need to build on Ethereum! 🚀

🧪 Quickly experiment with Circom and Solidity using a frontend that adapts to your circuits and smart contracts!

# Circuits

Check out `packages/hardhat/circuits/init` to see the example circuit! inside `circuit.circom` you'll see some code that probably looks a little unfamiliar. This is circom! A language used to describe zero knowledge circuits.

Read through the [circom docs](https://docs.circom.io/) and [github repo](https://github.com/iden3/circom) to learn more about it!

Our `init` circuit takes a private input signal `x` and a public input signal `hash`. The circuit will verify that `x` hashes into `hash` using the mimic hash function (a snark friendly hashing function) without revealing the true value of `x`!

`input.json` contains our input signals and will be used to test the circuit when we compile it.

When we create a new circuit we will keep this same file structure:

```
packages
├── hardhat
│   ├── circuits
|   │   ├── init
|   |   |   ├── circuit.circom
|   |   |   └── input.json
|   │   └── <NEW_CIRCUIT>
|   |       ├── circuit.circom
|   |       └── input.json
|   └── powersOfTau28_hez_final_15.ptau
├── react-app
├── services
└── subgraph
```

You've probably noticed `powersOfTau28_hez_final_15.ptau`, this file is needed to compile out circuits. See [hardhat-circom](https://github.com/projectsophon/hardhat-circom) and [snarkjs](https://github.com/iden3/snarkjs) for more details. You may need to replace this file if you will be compiling fairly large circuits.

# Compile

We'll use the `yarn circom` command to compile our circuits.

A smart contract verifier will be created and published into our `packages/hardhat/contracts` directory.


Everything else we will need to generate our zero knowledge proofs will then be published into `packages/react-app/public/circuits` after `yarn deploy`ing, these are our `r1cs`, `wasm`, and `zkey` files (another copy of these files will remain in `packages/hardhat/client`, but we want to use them in the frontend).

# Frontend

After `yarn deploy`ing and `yarn start`ing we should have our frontend up and running!

You should see a few input fields, a "prove" button, and a "verify" button. Looking pretty sparse. Let's change that and click the "prove" button.

You may need to scroll down but you should see something interesting. That's our zero knowledge proof!

Right now you're in the "Proof Data" tab, click over into the "Solidity Calldata" tab and you will see an array of inputs that will be passed to our smart contract when we call the verify function. Click on the "Verify with smart contract" button to do just that!

If everything went right you will see a big ol' green check mark. Our proof has been verified!

We can do this in the "Proof Data" tab as well, but this will verify inside the browser instead of using our fancy smart contract.

Try playing with the input fields to generate an invalid proof!

You may also want to scroll down to see the contract's verify function. It takes 4 arguments. To get a better feel for how the function works try copy pasting each element from the solidity calldata array into the argument fields.

# `ZkpInterface` component

The frontend is powered by the `ZkpInterface` component. It needs to be fed a few properties in order to function properly.

- `inputFields`: An object containing the circuit's default input signals, you can reuse the `input.json` from earlier.
- `zkey`: The circuit's zkey file.
- `wasm`: The circuit's wasm file.
- `vkey`: (optional) A verification key used to verify the the generated proof. If this is not provided the interface will generate one for you.
- `scVerifyFunc`: The verification function from our smart contract verifier.

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
