# Helpers

## Transactor

The transactor returns a `tx()` function to make running and tracking transactions as simple and standardized as possible. We will bring in [BlockNative's Notify](https://www.blocknative.com/notify) library to track our testnet and mainnet transactions.

```text
const tx = Transactor(props.injectedProvider, props.gasPrice);
```

Then you can use the `tx()` function to send funds and write to your smart contracts:

```text
tx({
  to: readContracts[contractName].address,
  value: parseEther("0.001"),
});
```

```text
tx(writeContracts["SmartContractWallet"].updateOwner(newOwner));
```

```text
/* notice how you pass a call back for tx updates too */
const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
  console.log("📡 Transaction Update:", update);
  if (update && (update.status === "confirmed" || update.status === 1)) {
    console.log(" 🍾 Transaction " + update.hash + " finished!");
    console.log(
      " ⛽️ " +
        update.gasUsed +
        "/" +
        (update.gasLimit || update.gas) +
        " @ " +
        parseFloat(update.gasPrice) / 1000000000 +
        " gwei",
    );
  }
});
console.log("awaiting metamask/web3 confirm result...", result);
console.log(await result);
```

{% hint style="danger" %}
**Warning**: You will need to update the configuration for `react-app/src/helpers/Transactor.js` to use _your_ [BlockNative dappId](https://www.blocknative.com/notify)
{% endhint %}



