# ⚠️⚠️⚠️⚠️⚠️ Repository has been moved [HERE](https://github.com/scaffold-eth/scaffold-eth-examples/tree/signatorio) ⚠️⚠️⚠️⚠️⚠️

# ✍️ signator.io

> A simple app that lets you sign a message with an Ethereum account & generate shareable proof-of-signature links
> Please contact azf20 with questions

---

# Live app

Check it out at [signator.io](https://signator.io)

# 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone -b signatorio https://github.com/austintgriffith/scaffold-eth.git signatorio

cd signatorio
```

```bash

yarn install

```

```bash

yarn start

```

📱 Open http://localhost:3000 to see the app

📝 Sign new messages from the home page `/` (`Signator.jsx` in `packages/react-app/src`)

## Signing a message

- This is the default option
- Signatorio uses "[personal_sign](https://github.com/ethereum/go-ethereum/pull/2940)" for safe message signing ([Metamask have a good history of Ethereum signing methods](https://docs.metamask.io/guide/signing-data.html#signing-data-with-metamask)).
- Write the message you want to sign, with an option to pre-pend the current time (see "Advanced").
- Hash the message if you would prefer to sign a hash (we hash the message with keccak256 -> `ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message))`)
- Connect your account (Metamask or WalletConnect are both supported)
- Sign the message! (We directly invoke `personal_sign` to ensure consistency across wallets)

## Signing typed data

- Signatorio lets users sign typed data (see "Advanced"), in line with [EIP-712: Ethereum typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712)
- Typed data requires specified types, and a message ([ethers.js documentation is helpful](https://docs.ethers.io/v5/api/signer/#Signer-signTypedData))
- If you don't specify a domain with a chainId, we will populate a domain with `chainId: 1` (otherwise Metamask signing fails)
- The component has some simple checks for whether the entered data is a valid JSON, whether it has the required fields, and whether it is able to generate a hash for EIP-712 signing
- Once you are ready to sign, click sign! We use `ethers.utils._signTypedData()`, and you should see nicely formatted typedData when you sign in your wallet
- We use [`json-url`](https://www.npmjs.com/package/json-url) to compress the typedData into a string we can pass as a URL parameter as `typedData`

## Creating a message to sign later

- You can 'Create' without connecting your account, which will populate the message in a shareable URL to be signed later

## Verifying a signature

- If you have a message, a signature and address, you can 'Verify' whether the address signed the message by entering all three!

📱 You can view a message at `/view`, this requires at least a message or typedData to be a url search parameter (`SignatorViewer.js` in `packages/react-app/src`)

## Sharing

- If the signature is successful, we pass the message, signature and signer address as URL parameters and link to the `/view` page. This makes the link & the app immediately shareable with others!
- We offer a few sharing options: copy the URL, link to Tweet using [intent](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent), or showing a QR code

## Verifying signatures

- `SignatorViewer` uses React Router `useLocation` to parse the URL parameters, to identify the message or typedData, the signature and the signing addresses
- We can verify whether the signatures match the corresponding signing addresses using `ethers.utils.verifyMessage( messageToCheck , sig )` -> if the returned address matches the signing address from the URL parameters.
- However Signatorio also supports smart contract wallets (e.g. Argent), via the [EIP-1271](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1271.md). We can check if an address is a contract, and if it is we can use the `isValidSignature` method to determine whether the signature was valid.
- There is also some error handling at this step to identify bad data (i.e. addresses that aren't addresses, missing data, invalid & mismatched addresses & signatures)

## Multiple Signatures

- On the view page, if you connect an account you can sign the message yourself!
- This appends another signature and signing address to the URL search parameters (we are using comma-separation to represent the arrays of signatures and addresses)
- These are also parsed on page load, checking the signatures
- You can delete signatures, which will remove the corresponding Address and Signature from the URL parameters
