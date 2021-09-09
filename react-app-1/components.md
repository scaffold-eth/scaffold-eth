# Components



![](https://user-images.githubusercontent.com/2653167/110500019-04ed5d00-80b6-11eb-97a4-74068fa90846.png)

Your commonly used React Ethereum components located in `packages/react-app/src/`:

## Address

📬 `<Address />`: A simple display for an Ethereum address that uses a [Blockie](https://www.npmjs.com/package/ethereum-blockies), lets you copy, and links to [Etherescan](https://etherscan.io/).

```text
  <Address value={address} />
  <Address value={address} size="short" />
  <Address value={address} size="long" blockexplorer="https://blockscout.com/poa/xdai/address/"/>
  <Address value={address} ensProvider={mainnetProvider}/>
```

![](https://user-images.githubusercontent.com/2653167/80522487-e375fd80-8949-11ea-84fd-0de3eab5cd03.gif)

## AddressInput

🖋 `<AddressInput />`: An input box you control with useState for an Ethereum address that uses a [Blockie](https://www.npmjs.com/package/ethereum-blockies) and ENS lookup/display.

```text
  const [ address, setAddress ] = useState("")
  <AddressInput
    value={address}
    ensProvider={props.ensProvider}
    onChange={(address)=>{
      setAddress(address)
    }}
  />
```

## Balance

💵 `<Balance />`: Displays the balance of an address in either dollars or decimal.

```text
<Balance
  address={address}
  provider={injectedProvider}
  dollarMultiplier={price}
/>
```

![](https://user-images.githubusercontent.com/2653167/80522919-86c71280-894a-11ea-8f61-70bac7a72106.gif)

## Account

👤 `<Account />`: Allows your users to start with an Ethereum address on page load but upgrade to a more secure, injected provider, using [Web3Modal](https://web3modal.com/). It will track your `address` and `localProvider` in your app's state:

```text
const [address, setAddress] = useState();
const [injectedProvider, setInjectedProvider] = useState();
const price = useExchangePrice(mainnetProvider);
```

```text
<Account
  address={address}
  setAddress={setAddress}
  localProvider={localProvider}
  injectedProvider={injectedProvider}
  setInjectedProvider={setInjectedProvider}
  dollarMultiplier={price}
/>
```

![](https://user-images.githubusercontent.com/2653167/80527048-fdffa500-8950-11ea-9a0f-576be87e4368.gif)

{% hint style="warning" %}
**Notice**: the `<Account />` component will call `setAddress` and `setInjectedProvider` for you.
{% endhint %}

