# Tenderly

[Tenderly](https://tenderly.co/) is a platform for monitoring, alerting and trouble-shooting smart contracts. They also have a hardhat plugin and CLI tool that can be helpful for local development!

{% hint style="info" %}
Hardhat Tenderly [announcement blog](https://blog.tenderly.co/level-up-your-smart-contract-productivity-using-hardhat-and-tenderly/) for reference.
{% endhint %}

## Verifying contracts on Tenderly

Scaffold-eth includes the `hardhat-tenderly` plugin. When deploying to any of the following networks:

* kovan
* goerli
* mainnet
* rinkeby
* ropsten
* matic
* mumbai
* xDai
* POA

You can verify contracts as part of a deployment script like so:

```text
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
```

**Once verified, they will then be available to view on Tenderly!**

![TenderlyRun](https://user-images.githubusercontent.com/2653167/110502199-38c98200-80b8-11eb-8d79-a98bb1f39617.png)

## **Exporting local Transactions**

One of Tenderly's best features for builders is the ability to [upload local transactions](https://dashboard.tenderly.co/tx/main/0xb8f28a9cace2bdf6d10809b477c9c83e81ce1a1b2f75f35ddd19690bbc6612aa/local-transactions) so that you can use all of Tenderly's tools for analysis and debugging. You will need to create a [tenderly account](https://tenderly.co/) if you haven't already.

Exporting local transactions can be done using the [Tenderly CLI](https://github.com/tenderly/tenderly-cli). Installing the Tenderly CLI:

```text
brew tap tenderly/tenderly
brew install tenderly
```

{% hint style="info" %}
_See alternative installation steps_ [_here_](https://github.com/tenderly/tenderly-cli#installation)
{% endhint %}

You need to log in and configure for your local chain \(including any forking information\) - this can be done from any directory, but it probably makes sense to do under `/packages/hardhat` to ensure that local contracts are also uploaded with the local transaction \(see more below!\)

```text
cd packages/hardhat
tenderly login
tenderly export init
```

You can then take transaction hashes from your local chain and run the following from the `packages/hardhat` directory:

```text
tenderly export <transactionHash>
```

Which will upload them to tenderly.co/dashboard!

Tenderly also allows users to debug smart contracts deployed to a local fork of some network \(see `yarn fork`\). To let Tenderly know that we are dealing with a fork, run the following command:

```text
tenderly export init
```

CLI will ask you for your network's name and whether you are forking a public network. After choosing the right fork, your exporting will look something like this:

```text
tenderly export <transactionHash> --export-network <networkName>
```

Note that `tenderly.yaml` file stores information about all networks that you initialized for exporting transactions. There can be multiple of them in a single file. You only need the `--export-network` if you have more than one network in your tenderly.yaml config!

### **A quick note on local contracts**

If your local contracts are persisted in a place that Tenderly can find them, then they will also be uploaded as part of the local transaction `export`, which is one of the freshest features! We are using hardhat-deploy, which stores the contracts & meta-information in a `deployments` folder, so this should work out of the box.

Another pitfall when dealing with a local network \(fork or not\) is that you will not see the transaction hash if it fails. This happens because the hardhat detects an error while `eth_estimateGas` is executed. To prevent such behaviour, you can skip this estimation by passing a `gasLimit` override when making a call - an example of this is demonstrated in the `FunctionForm.jsx` file of the Contract component:

```text
let overrides = {}
// Uncomment the next line if you want to skip the gas estimation for each transaction
// overrides.gasLimit = hexlify(1200000);
const returned = await tx(contractFunction(...args, overrides));
```

**One gotcha** - Tenderly does not \(currently\) support yarn workspaces, so any imported solidity contracts need to be local to `packages/hardhat` for your contracts to be exported. You can achieve this by using [`nohoist`](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) - this has been done for `hardhat` so that we can export `console.sol` - see the top-level `package.json` to see how!

```text
"workspaces": {
  "packages": [
    "packages/*"
  ],
  "nohoist": [
    "**/hardhat",
    "**/hardhat/**"
  ]
}
```

