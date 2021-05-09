# ✍️ signator.io

> A simple app that lets you sign a message with an Ethereum account & generate shareable proof-of-signature links
> Please contact azf20 with questions

---

# Live app

Check it out at [signatorio.surge.sh](https://signatorio.surge.sh)

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

- Define the message you want to sign
- Optionally prepend the date or blocknumber
- Hash the message if you would prefer to sign a hash
- Connect your account (Metamask or WalletConnect are both supported)
- Sign the message!

📱 You can view a message at `/view`, this requires the message to be a url search parameter (`SignatorViewer.js` in `packages/react-app/src`)

## Signing
- We require a connected account, rather than generating a burner wallet, given the use-case of this app
- We are using `personal_sign` ([Metamask have a good history of Ethereum signing methods](https://docs.metamask.io/guide/signing-data.html#signing-data-with-metamask))
- If the user selects "Hash message", we hash the message with keccak256 -> `ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message))`. In order to get consistent hashing across provider, we `arrayify` this hash -> `ethers.utils.arrayify(_message)` before signing
- We use the `ethers.js` provider `signMessage(message)` method, unless the injectedProvider is via WalletConnect, in which case we directly invoke `personal_sign`

## Sharing
- If the signature is successful, we pass the message, signature and signer address as URL parameters and link to the `/view` page. This makes the link & the app immediately shareable with others!
- We offer a few sharing options: copy the URL, link to Tweet using [intent](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent), or showing a QR code

## Verifying signatures
- `SignatorViewer` uses React Router `useLocation` to parse the URL parameters, to identify the message, the signature and the signing addresses
- We can verify whether the signatures match the corresponding signing addresses using `ethers.utils.verifyMessage( messageToCheck , sig )` -> if the returned address matches the signing address.
- However Signatorio also supports smart contract wallets (e.g. Argent), via the [EIP-1271](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1271.md). We can check if an address is a contract, and if it is we can use the `isValidSignature` method to determine whether the signature was valid.
- There is also some error handling at this step to identify bad data (i.e. addresses that aren't addresses, missing data, invalid & mismatched addresses & signatures)

## Multiple Signatures
- On the view page, if you connect an account you can sign the message yourself!
- This appends another signature and signing address to the URL search parameters (we are using comma-separation to represent the arrays of signatures and addresses)
- These are also parsed on page load, checking the signatures
