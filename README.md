# 🖇 Hooks

Commonly used Ethereum hooks:

`usePoller(fn, delay)`: runs a function on app load and then on a custom interval

```js
usePoller(() => {
  //do something cool at start and then every three seconds
}, 3000);
```

<br/>

`useBalance(provider, address, [pollTime])`: poll for the balance of an address from a provider

```js
const localBalance = useBalance(localProvider, address);
```

<br/>

`useBlockNumber(provider,[pollTime])`: get current block number from a provider

```js
const blockNumber = useBlockNumber(props.provider);
```

<br/>

`useContractReader(contract, variableName, [pollTime])`: reads a variable from your contract and keeps it in the state

```js
const title = useContractReader(contract, "title");
const owner = useContractReader(contract, "owner");
```

<br/>

`useEventListener(contract, filter)`: reads all past events from a smart contract matching a filter and keeps them in the state

```js
const filter = contract.filters.UpdateOwner(null, null))
const ownerUpdates = useEventReader(contract, filter);
```

<br/>

`useEventReader(contract, eventName, [provider], [startBlock])`: listens for events from a smart contract and keeps them in the state

```js
const ownerUpdates = useEventListener(contract, "UpdateOwner", props.localProvider, 1);
```

<br/>

`useNonce(provider, address)`: Reads the current nonce of an account

```js
const nonce = useNonce(props.localprovider, address);
```

<br/>

`useTimestamp(provider)`: Reads the timestamp of the most recent block

```js
const timestamp = useTimestamp(props.localprovider);
```

<br/>

`useTokenBalance(contract, address)`: Reads the ERC20 token balance of an account

```js
const tokenBalance = useTokenBalance(contract, addess);
```
