# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 Challenge 3: Minimum Viable Exchange

This challenge will provide a tutorial to help you build/understand a simple decentralized exchange. This readme is an upated version of the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90). Please read the intro for a background on what we are building!


---
### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git challenge-3-dex
cd challenge-3-dex
git checkout challenge-3-dex
yarn install
```


### Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

`yarn start` (react app frontend)

`yarn chain` (harthat backend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

Navigate to the Debug Contracts tab and you should see two smart contracts displayed called `DEX` and `Ballons`.

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend (run `yarn deploy --reset` for a completely fresh deploy if you have made no contract changes).

`Balloons.sol` just an example ERC20 contract that mints 1000 to whatever address deploys it.
`DEX.sol` is what we will build in this tutorial and you can see it starts with a SafeMath library to help us prevent overflows and underflows and also tracks a token (ERC20 interface) that we set in the constructor (on deploy).

---

### Checkpoint 2: Reserves 

We want to create an automatic market where our contract will hold reserves of both ETH and 🎈Balloons. These reserves will provide liquidity that allows anyone to swap between the assets. Let’s add a couple new variables to `DEX.sol`:

```
uint256 public totalLiquidity;
mapping (address => uint256) public liquidity;
```

These variables track the total liquidity, but also by individual addresses too.
Then, let’s create an init() function in `DEX.sol` that is payable and then we can define an amount of tokens that it will transfer to itself:

```
function init(uint256 tokens) public payable returns (uint256) {
  require(totalLiquidity==0,"DEX:init - already has liquidity");
  totalLiquidity = address(this).balance;
  liquidity[msg.sender] = totalLiquidity;
  require(token.transferFrom(msg.sender, address(this), tokens));
  return totalLiquidity;
}
```

Calling init() will load our contract up with both ETH and 🎈Balloons. 

We can see that the DEX starts empty. We want to be able to call init() to start it off with liquidity, but we don’t have any funds or tokens yet. Add some ETH to your local account using the faucet and then find the `00_deploy_your_conract.js` file. Uncomment the below and add your adddress: 

```
  // paste in your address here to get 10 balloons on deploy:
  // await balloons.transfer("YOUR_ADDRESS",""+(10*10**18));
```

Run `yarn deploy`. The front end should show you you have balloon tokens. We can’t just call init() yet because the DEX contract isn’t allowed to transfer tokens from our account. We need to approve() the DEX contract with the Balloons UI. Copy and paste the DEX address and then set the amount to 5000000000000000000 (5 * 10¹⁸). You can confirm this worked using the allowance() function. Now we are ready to call init() on the DEX. We will tell it to take (5 *10¹⁸) of our tokens and we will also send 0.01 ETH with the transaction. You can see the DEX contract's value update and you can check the DEX token balance using the balanceOf function on the Balloons UI. 

This works pretty well, but it will be a lot easier if we just call the init() function as we deploy the contract. In the `00_deploy_your_conract.js` script try uncommenting the init section so our DEX will start with 3 ETH and 3 Balloons of liquidity:

```
  // uncomment to init DEX on deploy:
  // console.log("Approving DEX ("+dex.address+") to take Balloons from main account...")
  // If you are going to the testnet make sure your deployer account has enough ETH
  // await balloons.approve(dex.address,ethers.utils.parseEther('100'));
  // // console.log("INIT exchange...")
  // await dex.init(""+(3*10**18),{value:ethers.utils.parseEther('3'),gasLimit:200000})
```

Now when we `yarn deploy` reset our contract should be initialized as soon as it deploys and we should have equal reserves of ETH and tokens.

### Checkpoint 3: Price

Follow along with the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) Price section for an understanding of the DEX's pricing model and for a price function to add to your contract. Deploy when you are done. 

### Checkpoint 4: Trading

Let’s edit the DEX.sol smart contract and add two new functions for swapping from each asset to the other:

```
function ethToToken() public payable returns (uint256) {
  uint256 token_reserve = token.balanceOf(address(this));
  uint256 tokens_bought = price(msg.value, address(this).balance.sub(msg.value), token_reserve);
  require(token.transfer(msg.sender, tokens_bought));
  return tokens_bought;
}

function tokenToEth(uint256 tokens) public returns (uint256) {
  uint256 token_reserve = token.balanceOf(address(this));
  uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
  (bool sent, ) = msg.sender.call{value: eth_bought}("");
  require(sent, "Failed to send user eth.");
  require(token.transferFrom(msg.sender, address(this), tokens));
  return eth_bought;
}

```

Each of these functions calculate the resulting amount of output asset using our price function that looks at the ratio of the reserves vs the input asset.We can call tokenToEth and it will take our tokens and send us ETH or we can call ethToToken with some ETH in the transaction and it will send us tokens. Let’s deploy our contract then move over to the frontend. Exchange some ETH for tokens and some tokens for ETH!

### Checkpoint 5: Liquidity 

So far, only the init() function controls liquidity. To make this more decentralized, it would be better if anyone could add to the liquidity pool by sending the DEX both ETH and tokens at the correct ratio.
Let’s create two new functions that let us deposit and withdraw liquidity:

``` 
function deposit() public payable returns (uint256) {
  uint256 eth_reserve = address(this).balance.sub(msg.value);
  uint256 token_reserve = token.balanceOf(address(this));
  uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(1);
  uint256 liquidity_minted = msg.value.mul(totalLiquidity) / eth_reserve;
  liquidity[msg.sender] = liquidity[msg.sender].add(liquidity_minted);
  totalLiquidity = totalLiquidity.add(liquidity_minted);
  require(token.transferFrom(msg.sender, address(this), token_amount));
  return liquidity_minted;
}

function withdraw(uint256 amount) public returns (uint256, uint256) {
  uint256 token_reserve = token.balanceOf(address(this));
  uint256 eth_amount = amount.mul(address(this).balance) / totalLiquidity;
  uint256 token_amount = amount.mul(token_reserve) / totalLiquidity;
  liquidity[msg.sender] = liquidity[msg.sender].sub(eth_amount);
  totalLiquidity = totalLiquidity.sub(eth_amount);
  (bool sent, ) = msg.sender.call{value: eth_amount}("");
  require(sent, "Failed to send user eth.");
  require(token.transfer(msg.sender, token_amount));
  return (eth_amount, token_amount);
}

```

Take a second to understand what these functions are doing after you paste them into DEX.sol in packages/buidler/contracts:
The deposit() function receives ETH and also transfers tokens from the caller to the contract at the right ratio. The contract also tracks the amount of liquidity the depositing address owns vs the totalLiquidity.
The withdraw() function lets a user take both ETH and tokens out at the correct ratio. The actual amount of ETH and tokens a liquidity provider withdraws will be higher than what they deposited because of the 0.3% fees collected from each trade. This incentivizes third parties to provide liquidity.

### Checkpoint 6: UI

Uncomment the Dex Component and the slimmed down Baloons component to load the two contracts on the main UI. Now, you user can enter the amount of ETH or tokens they want to swap and the chart will display how the price is calculated. You can also visualize how larger swaps result in more slippage and less output asset. You can also deposit and withdraw from the liquidity pool, earning fees

### Checkpoint 7: 💾 Deploy it! 🛰

📡 Edit the `defaultNetwork` in `packages/hardhat/hardhat.config.js`, as well as `targetNetwork` in `packages/react-app/src/App.jsx`, to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/)

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

🛰 Use an [instantwallet.io](https://instantwallet.io) to fund your **deployer address** (run `yarn account` again to view balances)

 >  🚀 Run `yarn deploy` to deploy to your public network of choice (😅 wherever you can get ⛽️ gas)

🔬 Inspect the block explorer for the network you deployed to... make sure your contract is there.  

👮 Your token contract source needs to be **verified**... (source code publicly available on the block explorer)

📠 You can verify on etherscan by updating the etherscan-verify command in the hardhat package with your api key. 


### Checkpoint 5: 🚢 Ship it! 🚁

 📦 Run `yarn build` to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

🚔 Traffic to your url might break the [Infura](https://infura.io/) rate limit, edit your key: `constants.js` in `packages/ract-app/src`.

---

> 💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)