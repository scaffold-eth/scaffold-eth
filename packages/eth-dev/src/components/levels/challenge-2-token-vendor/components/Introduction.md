> 🤖 Smart contracts are kind of like "always on" *vending machines* that **anyone** can access. Let's make a decentralized, digital currency. Then, let's build an unstoppable vending machine that will buy and sell the currency. We'll learn about the "approve" pattern for ERC20s and how contract to contract interactions work.

<br/>

> 🏵 Create `YourToken.sol` smart contract that inherits the **ERC20** token standard from OpenZeppelin. Set your token to `_mint()` **1000** (\* 10 \*\* 18) tokens to the `msg.sender`. Then create a `Vendor.sol` contract that sells your token using a payable `buyTokens()` function.

<br/>

> 🎛 Edit the frontend that invites the user to `<input\>` an amount of tokens they want to buy. We'll display a preview of the amount of ETH (or USD) it will cost with a confirm button.

<br/>

> 🔍 It will be important to verify your token's source code in the block explorer after you deploy. Supporters will want to be sure that it has a fixed supply and you can't just mint more.

<br/>

> 🌟 The final deliverable is an app that lets users purchase your ERC20 token, transfer it, and sell it back to the vendor. Deploy your contracts on your public chain of choice and then `yarn build` and `yarn surge` your app to a public web server. Submit the url on [SpeedRunEthereum.com](https://speedrunethereum.com)!

<br/>

> 💬 Meet other builders working on this challenge and get help in the [Challenge 2 telegram](https://t.me/joinchat/IfARhZFc5bfPwpjq)!

<br/>

🧫 Everything starts by ✏️ Editing `YourToken.sol` in `packages/hardhat/contracts`

<br/>
<br/>
