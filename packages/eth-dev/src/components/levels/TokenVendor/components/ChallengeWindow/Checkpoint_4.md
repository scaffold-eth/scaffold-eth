## Checkpoint 4: 🤔 Vendor Buyback 🤯

👩‍🏫 The hardest part of this challenge is to build your `Vendor` to buy the tokens back.

🧐 The reason why this is hard is the `approve()` pattern in ERC20s. You can read more about the `approve()` pattern [here](https://docs.ethhub.io/guides/a-straightforward-guide-erc20-tokens/).

😕 First, the user has to call `approve()` on the `YourToken` contract, approving the `Vendor` contract address to take some amount of tokens.

🤨 Then, the user makes a *second transaction* to the `Vendor` contract to `sellTokens(uint256 amount)`.

🤓 The `Vendor` should call `yourToken.transferFrom(msg.sender, address(this), theAmount)` and if the user has approved the `Vendor` correctly, tokens should transfer to the `Vendor` and ETH should be sent to the user.

> 📝 Edit `Vendor.sol` and add a `sellTokens()` function!

⚠️ You will need extra UI for calling `approve()` before calling `sellTokens(uint256 amount)`.

🔨 Use the `Debug Contracts` tab to call the approve and sellTokens() at first but then...

🔍 Look in the `App.jsx` for the extra approve/sell UI to uncomment!

#### 🥅 Goal

- [ ] Can you sell tokens back to the vendor?
- [ ] Do you receive the right amount of ETH for the tokens?

#### ⚔️ Side Quest

- [ ] Should we disable the `owner` withdraw to keep liquidity in the `Vendor`?
- [ ] It would be a good idea to display Sell Token Events.  Create the `event` and `emit` it in your `Vendor.sol` and look at `buyTokensEvents` in your `App.jsx` for an example of how to update your frontend.

#### ⚠️ Test it!

-  Now is a good time to run `yarn test` to run the automated testing function. It will test that you hit the core checkpoints.  You are looking for all green checkmarks and passing tests!
<br/>
<br/>
