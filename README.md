# 🖇 Hooks

Commonly used Ethereum hooks:

`useOnBlock(provider, fn)`

```js
useOnBlock(
  provider,
  () => {
  //do something cool on each new block
  }
);
```

<br/>

`usePoller(fn, delay, extraWatch)`: runs a function on app load and then on a custom interval

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

`useBlockNumber(provider, [pollTime])`: get current block number from a provider

```js
const blockNumber = useBlockNumber(props.provider);
```

<br/>

`useContractLoader(providerOrSigner, config)`: loads contracts provided in config arg.

```js
const contractsConfig = {
  hardhatContracts: hardhatContractsList,
  externalContracts: externalContractsList
}

const contracts = useContractLoader(provider, contractsConfig);
```

<br/?

`useContractReader(contracts, contractName, functionName, [args], [pollTime])`: reads a variable from your contract and keeps it in the state

```js
const balance = useContractReader(contracts, "MyToken", "balanceOf", ["0xde769Dcc704c7Ec4BC2Dd996dfbb997e89995c5a"]);
const owner = useContractReader(contracts, "MyContract", "owner");
```

<br/>

`useEventListener(contracts, contractName, eventName, provider, startBlock)`: reads all past events from a smart contract and keeps them in the state

```js
const eventLog = useEventListener(contract, "MyContract", "Event", provider, 0);
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
