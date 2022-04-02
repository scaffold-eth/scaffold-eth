## Checkpoint 3: ⚖️ Vendor 🤖

> 👩‍💻 Edit the `Vendor.sol` contract with a **payable** `buyTokens()` function

Use a price variable named `tokensPerEth` set to **100**:

```solidity
uint256 public constant tokensPerEth = 100;
```

> 📝 The `buyTokens()` function in `Vendor.sol` should use `msg.value` and `tokensPerEth` to calculate an amount of tokens to `yourToken.transfer()` to `msg.sender`.

> 📟 Emit **event** `BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens)` when tokens are purchased.

Edit `deploy/01_deploy_vendor.js` to deploy the `Vendor` (uncomment Vendor deploy lines).

#### 🥅 Goals

- [ ] When you try to buy tokens from the vendor, you should get an error: **'ERC20: transfer amount exceeds balance'**

⚠️ this is because the Vendor contract doesn't have any YourTokens yet!

⚔️ Side Quest: send tokens from your frontend address to the Vendor contract address and *then* try to buy them.

> ✏️ We can't hard code the vendor address like we did above when deploying to the network because we won't know the vender address at the time we create the token contract.

> ✏️ So instead, edit `YourToken.sol` to transfer the tokens to the `msg.sender` (deployer) in the **constructor()**.

> ✏️ Then, edit `deploy/01_deploy_vendor.js` to transfer 1000 tokens to `vendor.address`.

```js
await yourToken.transfer( vendor.address, ethers.utils.parseEther("1000") );
```

> You can `yarn deploy --reset` to deploy your contract until you get it right.

(You will use the `YourToken` UI tab and the frontend for most of your testing. Most of the UI is already built for you for this challenge.)

#### 🥅 Goals

- [ ] Does the `Vendor` address start with a `balanceOf` **1000** in `YourToken` on the `Debug Contracts` tab?
- [ ] Can you buy **10** tokens for **0.1** ETH?
- [ ] Can you transfer tokens to a different account?

> 📝 Edit `Vendor.sol` to inherit *Ownable*.

In `deploy/01_deploy_vendor.js` you will need to call `transferOwnership()` on the `Vendor` to make *your frontend address* the `owner`:

```js
await vendor.transferOwnership("**YOUR FRONTEND ADDRESS**");
```

#### 🥅 Goals

- [ ] Is your frontend address the `owner` of the `Vendor`?

> 📝 Finally, add a `withdraw()` function in `Vendor.sol` that lets the owner withdraw ETH from the vendor.

#### 🥅 Goals

- [ ] Can **only** the `owner` withdraw the ETH from the `Vendor`?

#### ⚔️ Side Quests

- [ ] Can _anyone_ withdraw? Test _everything_!
- [ ] What if you minted **2000** and only sent **1000** to the `Vendor`?
<br/>
<br/>
