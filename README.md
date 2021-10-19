# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 Challenge 2: Token Vendor

> 🏵 Create `YourToken.sol` smart contract that inherits the **ERC20** token standard from OpenZeppelin. Set your token to `_mint()` **1000** (* 10 ** 18) tokens to the `msg.sender`. Then create a `Vendor.sol` contract that sells your token using a payable `buyTokens()` function.

> 🎛 Create a frontend that invites the user to `<input\>` an amount of tokens they want to buy. Then, display a preview of the amount of ETH (or USD) it will cost with a confirm button.

> 🔍 It will be important to verify your token's source code in the block explorer after you deploy. Supporters will want to be sure that it has a fixed supply and you can't just mint more.

> 🏆 The final **deliverable** is an app that lets users purchase and transfer your token. Deploy your contracts on your public chain of choice and then `yarn build` and `yarn surge` your app to a public webserver. Share the url in the [Challenge 2 telegram channel](https://t.me/joinchat/IfARhZFc5bfPwpjq).

> 📱 Part of the challenge is making the **UI/UX** enjoyable and clean! 🤩


🧫 Everything starts by ✏️ Editing `YourToken.sol` in `packages/hardhat/contracts`

---
### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git challenge-2-token-vendor
cd challenge-2-token-vendor
git checkout challenge-2-token-vendor
yarn install
```

🔏 Edit your smart contract `YourToken.sol` in `packages/hardhat/contracts`

---

### Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

`yarn start` (react app frontend)

`yarn chain` (harthat backend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend.

> ignore any warnings about the vendor deploy, we'll get to that.

---

### Checkpoint 2: 🏵Your Token 💵

> 👩‍💻 Edit `YourToken.sol` to inherit the **ERC20** token standard from OpenZeppelin

Mint **1000** (* 10 ** 18) in the constructor (to the `msg.sender`) and then send them to your frontend address in the `deploy/00_deploy_your_token.js`:

```javascript
const result = await yourToken.transfer( "**YOUR FRONTEND ADDRESS**", ethers.utils.parseEther("1000") );
```

(Your frontend address is the address in the top right of your frontend. Go to localhost:3000 and copy the address from the top right.)

#### 🥅 Goals

- [ ] Can you check the `balanceOf()` your frontend address in the **YourContract** of the `Debug Contracts` tab?
- [ ] Can you `transfer()` your token to another account and check *that* account's `balanceOf`?

(Use an incognito window to create a new address and try sending to that new address. Use the `transfer()` function in the `Debug Contracts` tab.)

---

### Checkpoint 3: ⚖️ Vendor 🤖

> 👩‍💻 Create a `Vendor.sol` contract with a **payable** `buyTokens()` function

Use a price variable named `tokensPerEth` set to **100**:

```solidity
uint256 public constant tokensPerEth = 100;
```

> 📟 Emit **event** `BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens)` when tokens are purchased.

Edit `deploy/01_deploy_vendor.js` to deploy the `Vendor` (uncomment Vendor deploy lines), but also to send all the tokens to the `vendor.address`:

```js
const result = await yourToken.transfer( vendor.address, ethers.utils.parseEther("1000") );
```

In `deploy/01_deploy_vendor.js` you will also need to call `transferOwnership()` on the `Vendor` to make *your frontend address* the `owner`:

```js
await vendor.transferOwnership("**YOUR FRONTEND ADDRESS**");
```

(You will use the `YourToken` UI tab and the frontend for most of your testing. Most of the UI is already built for you for this challenge.)

#### 🥅 Goals
- [ ] Does the `Vendor` address start with a `balanceOf` **1000** in `YourToken` on the `Debug Contracts` tab?
- [ ] Can you buy **10** tokens for **0.01** ETH?
- [ ] Can you transfer tokens to a different account?
- [ ] Can the `owner` withdraw the ETH from the `Vendor`?

#### ⚔️ Side Quests
- [ ] Can *anyone* withdraw? Test *everything*!
- [ ] What if you minted **2000** and only sent **1000** to the `Vendor`?


---


### Checkpoint 4: 🤔 Vendor Buyback 🤯

The hardest part of this challenge is to build your `Vendor` to buy the tokens back.

The reason why this is hard is the `approve()` pattern in ERC20s.

First, the user has to call `approve()` on the `YourToken` contract, approving the `Vendor` contract address to take some amount of tokens.

Then, the user makes a *second transaction* to the `Vendor` contract to `sellTokens()`.

The `Vendor` should call `transferFrom(msg.sender, address(this), theAmount)` and if the user has appoved the `Vendor` correctly, tokens should transfer to the `Vendor` and ETH should be sent to the user.



Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!




### Checkpoint 5: 💾 Deploy it! 🛰

📡 Edit the `defaultNetwork` in `packages/hardhat/hardhat.config.js`, as well as `targetNetwork` in `packages/react-app/src/App.jsx`, to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/)

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

🛰 Use an [instantwallet.io](https://instantwallet.io) to fund your **deployer address** (run `yarn account` again to view balances)

 >  🚀 Run `yarn deploy` to deploy to your public network of choice (😅 wherever you can get ⛽️ gas)

🔬 Inspect the block explorer for the network you deployed to... make sure your contract is there.  

👮 Your token contract source needs to be **verified**... (source code publicly available on the block explorer)

📠 You can "flatten" your contracts with `yarn flatten > flat.txt` (the flat.txt file will need a little cleanup). Then *copy and paste* the code into the block explorer like Etherscan to verify. (optimizer "on" set to 200 runs)


### Checkpoint 5: 🚢 Ship it! 🚁

 📦 Run `yarn build` to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

🚔 Traffic to your url might break the [Infura](https://infura.io/) rate limit, edit your key: `constants.js` in `packages/ract-app/src`.

> 🎖 Show off your app by pasting the url in the [Challenge 2 telegram channel](https://t.me/joinchat/IfARhZFc5bfPwpjq)

---

> 💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)
