# 🏗 scaffold-eth | 🏰 BuidlGuidl

## 🚩 **Challenge 3: Minimum Viable Exchange**

This challenge will help you build/understand a simple decentralized exchange, with one token-pair (ERC20 BALLOONS ($BAL) and ETH). This repo is an updated version of the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) and challenge repos before it. Please read the intro for a background on what we are building first! **There is a DEXTemplate.sol file for your use if you want. As well, this repo has solutions (try not to peak!) in it (in root directory, there's a solutions sub-directory) for now, but the challenge is to write the smart contracts yourself of course!**

There is also a [Youtube video](https://www.youtube.com/watch?v=eP5w6Ger1EQ&t=364s&ab_channel=SimplyExplained) that may help you understand the concepts covered within this challenge too:

This branch was heavily based off of this [archived feature branch](https://github.com/scaffold-eth/scaffold-eth-challenges/tree/challenge-5-dex).

---

### **⛳️ Checkpoint 0: 📦 install 📚**

_🚨TODO: Update this with appropriate links once finalized by Austin and team_

```bash
git clone https://github.com/squirtleDevs/scaffold-eth.git challenge-3-simpleDEX
cd challenge-3-simpleDEX
git checkout challenge-3-simpleDEX
yarn install
```

---

### ⛳️ **Checkpoint 1: 🔭 Environment 📺**

You'll have three terminals up for:

`yarn start` (react app frontend)

`yarn chain` (hardhat backend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

Navigate to the Debug Contracts tab and you should see two smart contracts displayed called `DEX` and `Balloons`.

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend (run `yarn deploy --reset` for a completely fresh deploy if you have made no contract changes).

`Balloons.sol` is just an example ERC20 contract that mints 1000 $BAL to whatever address deploys it.
`DEX.sol` is what we will build in this challenge and you can see it starts with a SafeMath library to help us prevent overflows and underflows and also tracks a token (ERC20 interface) that we set in the constructor (on deploy).

> Below is what your front-end will look like with no implementation code within your smart contracts yet. The buttons will likely break because there are no functions tied to them yet!

> **⭐️ Also note that there is no curve until you uncomment the specific lines of code at the end of `00_deploy_your_contract.js`**.

<img src="images/StartingUIImage.png" width = "800">

> 🎉 You've made it this far in Scaffold-Eth Challenges 👏🏼 . As things get more complex, it might be good to review the design requirements of the challenge first! Check out the empty DEXTemplate.sol file to see aspects of each function. If you can explain how each function will work with one another, that's great! 😎

> 🚨 🚨 🦖 **The code blobs within the toggles are some examples of what you can use, but try writing the implementation code for the functions first!**

---

### ⛳️ **Checkpoint 2: Reserves** 🪙 ⚖️

We want to create an automatic market where our contract will hold reserves of both ETH and 🎈 Balloons. These reserves will provide liquidity that allows anyone to swap between the assets.

Add a couple new variables to `DEX.sol` for `totalLiquidity` and `liquidity`:

<details markdown='1'><summary>👩🏽‍🏫 Solution Code</summary>

```
uint256 public totalLiquidity;
mapping (address => uint256) public liquidity;
```

</details>

These variables track the total liquidity, but also by individual addresses too.
Now, let's create an init() function in `DEX.sol` that is payable and then we can define an amount of tokens that it will transfer to itself.

<details markdown='1'><summary> 👨🏻‍🏫 Solution Code</summary>

```
    function init(uint256 tokens) public payable returns (uint256) {
        require(totalLiquidity == 0, "DEX: init - already has liquidity");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;
        require(token.transferFrom(msg.sender, address(this), tokens), "DEX: init - transfer did not transact");
        return totalLiquidity;
    }
```

</details>

Calling `init()` will load our contract up with both ETH and 🎈 Balloons.

We can see that the DEX starts empty. We want to be able to call init() to start it off with liquidity, but we don’t have any funds or tokens yet. Add some ETH to your local account using the faucet and then find the `00_deploy_your_contract.js` file. Find and uncomment the line below and add your front-end address:

```
  // // paste in your front-end address here to get 10 balloons on deploy:
  // await balloons.transfer(
  //   "0xe64bAAA0F6012A0F320a262cFe39289bA6cBd0f2",
  //   "" + 10 * 10 ** 18
  // );
```

Run `yarn deploy`. The front end should show you that you have balloon tokens. We can’t just call init() yet because the DEX contract isn’t allowed to transfer tokens from our account. We need to approve() the DEX contract with the Balloons UI.

🤓 Copy and paste the DEX address and then set the amount to 5000000000000000000 (5 _ 10¹⁸). You can confirm this worked using the allowance() function. Now we are ready to call init() on the DEX. We will tell it to take (5 _ 10¹⁸) of our tokens and we will also send 0.01 ETH with the transaction. You can see the DEX contract's value update and you can check the DEX token balance using the balanceOf function on the Balloons UI.

This works pretty well, but it will be a lot easier if we just call the `init()` function as we deploy the contract. In the `00_deploy_your_contract.js` script try uncommenting the init section so our DEX will start with 3 ETH and 3 Balloons of liquidity:

```
    // // uncomment to init DEX on deploy:
  // console.log(
  //   "Approving DEX (" + dex.address + ") to take Balloons from main account..."
  // );
  // // If you are going to the testnet make sure your deployer account has enough ETH
  // await balloons.approve(dex.address, ethers.utils.parseEther("100"));
  // console.log("INIT exchange...");
  // await dex.init(ethers.utils.parseEther("3"), {
  //   value: ethers.utils.parseEther("3"),
  //   gasLimit: 200000,
  // });
```

Now when we `yarn deploy --reset` then our contract should be initialized as soon as it deploys and we should have equal reserves of ETH and tokens.

### 🥅 Goals / Checks

- [ ] 🎈 Under the debug tab, does your DEX show 3 ETH and 3 Balloons of liquidity?

---

### ⛳️ **Checkpoint 3: Price** 🤑

This section is directly from the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) "Price" section. It outlines the general details of the DEX's pricing model.

Now that our contract holds reserves of both ETH and tokens, we want to use a simple formula to determine the exchange rate between the two.
Let’s start with the formula `x * y = k` where `x` and `y` are the reserves:

```
amount of ETH in DEX ) _ ( amount of tokens in DEX ) = k
```

The `k` is called an invariant because it doesn’t change during trades. (The `k` only changes as liquidity is added.) If we plot this formula, we’ll get a curve that looks something like:

<img src="images/yxk.png" width = "300">

> 💡 We are just swapping one asset for another, the “price” is basically how much of the resulting output asset you will get if you put in a certain amount of the input asset.

🤔 OH! A market based on a curve like this will always have liquidity, but as the ratio becomes more and more unbalanced, you will get less and less of the weaker asset from the same trade amount. Again, if the smart contract has too much ETH and not enough tokens, the price to swap tokens to ETH should be more desirable.

When we call `init()` we passed in ETH and tokens at a ratio of 1:1 and that ratio must remain constant. As the reserves of one asset changes, the other asset must also change inversely.

Now, try to edit your DEX.sol smart contract and bring in a this price function!

<details markdown='1'><summary>👩🏽‍🏫 Solution Code</summary>

```

    function price(
        uint256 xInput,
        uint256 xReserves,
        uint256 yReserves
    ) public view returns (uint256 yOutput) {
        uint256 xInputWithFee = xInput.mul(997);
        uint256 numerator = xInputWithFee.mul(yReserves);
        uint256 denominator = (xReserves.mul(1000)).add(xInputWithFee);
        return (numerator / denominator);
    }

```

</details>

We use the ratio of the input vs output reserve to calculate the price to swap either asset for the other. Let’s deploy this and poke around:

```
yarn run deploy
```

Let’s say we have 1 million ETH and 1 million tokens, if we put this into our price formula and ask it the price of 1000 ETH it will be an almost 1:1 ratio:

<img src="images/1.png" width = "300">

If we put in 1000 ETH we will receive 996 tokens. If we’re paying a 0.3% fee it should be 997 if everything was perfect. BUT, there is a tiny bit of slippage as our contract moves away from the original ratio. Let’s dig in more to really understand what is going on here.
Let’s say there is 5 million ETH and only 1 million tokens. Then, we want to put 1000 tokens in. That means we should receive about 5000 ETH:

<img src="images/2.png" width = "300">

Finally, let’s say the ratio is the same but we want to swap 100,000 tokens instead of just 1000. We’ll notice that the amount of slippage is much bigger. Instead of 498,000 back we will only get 453,305 because we are making such a big dent in the reserves.

<img src="images/3.png" width = "300">

💡 The contract automatically adjusts the price as the ratio of reserves shifts away from the equilibrium. It’s called an 🤖 _Automated Market Maker._

### 🥅 Goals / Checks

- [ ] 🤔 Do you understand how the x\*y=k price curve actually works? Write down a clear explanation for yourself and derive the formula for price. You might have to shake off some old algebra skills!
- [ ] 💃 You should be able to go through the price section of this tutorial with the sample numbers and generate the same outputChange variable.

> 💡 _Hints:_ See this [link](https://hackernoon.com/formulas-of-uniswap-a-deep-dive), solve for the change in the Output Reserve. See the section in that link up to the uniswap v3 title.

> 💡💡 _More Hints:_ Also, don't forget to think about how to implement the trading fee. Solidity doesn't allow for decimals, so one way that contracts are written to implement percentage is using whole uints (997 and 1000) as numerator and denominator factors, respectively.

---

### ⛳️ **Checkpoint 4: Trading** 🤝

Let’s edit the DEX.sol smart contract and add two new functions for swapping from each asset to the other, `ethToToken()` and `tokenToEth()`!

<details markdown='1'><summary>👨🏻‍🏫 Solution Code </summary>

```
    /**
     * @notice sends Ether to DEX in exchange for $BAL
     */
    function ethToToken() public payable returns (uint256 tokenOutput) {
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 tokenOutput = price(msg.value, ethReserve, token_reserve);
        require(token.transfer(msg.sender, tokenOutput), "ethToToken(): reverted swap.");
        return tokenOutput;
        emit EthToTokenSwap(msg.sender, tokenOutput, msg.value);
    }

    /**
     * @notice sends $BAL tokens to DEX in exchange for Ether
     */
    function tokenToEth(uint256 tokenInput) public returns (uint256 ethOutput) {
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 ethOutput = price(tokenInput, token_reserve, address(this).balance);
        require(token.transferFrom(msg.sender, address(this), tokenInput), "tokenToEth(): reverted swap.");
        (bool sent, ) = msg.sender.call{ value: ethOutput }("");
        require(sent, "tokenToEth: revert in transferring eth to you!");
        return ethOutput;
        emit TokenToEthSwap(msg.sender, ethOutput, tokenInput);
    }
```

</details>

> 💡 Each of these functions calculate the resulting amount of output asset using our price function that looks at the ratio of the reserves vs the input asset. We can call tokenToEth and it will take our tokens and send us ETH or we can call ethToToken with some ETH in the transaction and it will send us tokens. Deploy it and try it out!

---

### ⛳️ **Checkpoint 5: Liquidity** 🌊

So far, only the init() function controls liquidity. To make this more decentralized, it would be better if anyone could add to the liquidity pool by sending the DEX both ETH and tokens at the correct ratio.

Let’s create two new functions that let us deposit and withdraw liquidity. How would you write this function out? Try before taking a peak!

> 💡 _Hints:_
> The deposit() function receives ETH and also transfers tokens from the caller to the contract at the right ratio. The contract also tracks the amount of liquidity the depositing address owns vs the totalLiquidity.
> The withdraw() function lets a user take both ETH and tokens out at the correct ratio. The actual amount of ETH and tokens a liquidity provider withdraws will be higher than what they deposited because of the 0.3% fees collected from each trade. This incentivizes third parties to provide liquidity.

<details markdown='1'><summary>👩🏽‍🏫 Solution Code </summary>

```
/**
     * @notice allows deposits of $BAL and $ETH to liquidity pool
     * NOTE: Ratio needs to be maintained.
     */
    function deposit() public payable returns (uint256 tokensDeposited) {
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenDeposit;

        tokenDeposit = msg.value.mul((tokenReserve / ethReserve)).add(1);
        uint256 liquidityMinted = msg.value.mul(totalLiquidity / ethReserve);
        liquidity[msg.sender] = liquidity[msg.sender].add(liquidityMinted);
        totalLiquidity = totalLiquidity.add(liquidityMinted);

        require(token.transferFrom(msg.sender, address(this), tokenDeposit));
        return tokenDeposit;
    }

    /**
     * @notice allows withdrawal of $BAL and $ETH from liquidity pool
     */
    function withdraw(uint256 amount) public returns (uint256 eth_amount, uint256 token_amount) {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethWithdrawn;

        ethWithdrawn = amount.mul((ethReserve / totalLiquidity));

        uint256 tokenAmount = amount.mul(tokenReserve) / totalLiquidity;
        liquidity[msg.sender] = liquidity[msg.sender].sub(ethWithdrawn);
        totalLiquidity = totalLiquidity.sub(ethWithdrawn);
        (bool sent, ) = msg.sender.call{ value: ethWithdrawn }("");
        require(sent, "withdraw(): revert in transferring eth to you!");
        require(token.transfer(msg.sender, tokenAmount));

        return (ethWithdrawn, tokenAmount);
    }

```

 </details>

🚨 Take a second to understand what these functions are doing if you pasted them into DEX.sol in packages/hardhat/contracts:

### 🥅 Goals / Checks

- [ ] 💧 Deposit liquidity, and then check your liquidity amount through the mapping in the debug tab. Has it changed properly? Did the right amount of assets get deposited?
- [ ] 🧐 What happens if you deposit(), then another user starts swapping out for most of the balloons, and then you try to withdraw your position as a liquidity provider? Answer: you should get the amount of liquidity proportional to the ratio of assets within the isolated liquidity pool.

---

### ⛳️ **Checkpoint 6: UI** 🖼

Cool beans! Your front-end should be showing something like this now!

<img src="images/ui-screenshot-final.png" width = "700">

Now, a user can just enter the amount of ETH or tokens they want to swap and the chart will display how the price is calculated. The user can also visualize how larger swaps result in more slippage and less output asset.

## 💸 A user can also deposit and withdraw from the liquidity pool, earning fees

### **Checkpoint 7: 💾 Deploy it!** 🛰

📡 Edit the `defaultNetwork` in `packages/hardhat/hardhat.config.js`, as well as `targetNetwork` in `packages/react-app/src/App.jsx`, to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/)

## 🔶 Infura

> You will need to get a key from infura.io and paste it into constants.js in packages/react-app/src:

![nft13](https://user-images.githubusercontent.com/526558/124387174-d83c0180-dcb3-11eb-989e-d58ba15d26db.png)

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

🛰 Use an [instantwallet.io](https://instantwallet.io) to fund your **deployer address** (run `yarn account` again to view balances)

> 🚀 Run `yarn deploy` to deploy to your public network of choice (😅 wherever you can get ⛽️ gas)

🔬 Inspect the block explorer for the network you deployed to... make sure your contract is there.

👮 Your token contract source needs to be **verified**... (source code publicly available on the block explorer)

---

### **Checkpoint 8: 📜 Contract Verification**

Update the api-key in packages/hardhat/package.json file. You can get your key [here](https://etherscan.io/myapikey).

![Screen Shot 2021-11-30 at 10 21 01 AM](https://user-images.githubusercontent.com/9419140/144075208-c50b70aa-345f-4e36-81d6-becaa5f74857.png)

> Now you are ready to run the `yarn verify --network your_network` command to verify your contracts on etherscan 🛰

This will be the URL you submit to [SpeedRun](https://speedrunethereum.com).

---

### **Checkpoint 9: 🚢 Ship it! 🚁**

📦 Run `yarn build` to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

🚔 Traffic to your url might break the [Infura](https://infura.io/) rate limit, edit your key: `constants.js` in `packages/ract-app/src`.

---

> 💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)

---

# 🙅🏻‍♂️ 🚧 General public ignore below, these are just notes for devs to fix about this challenge!

### 🚨 STEVE/M00NPAPI/WHOEVER TODO: Aspects to Check Before Finalizing

<details markdown='1'><summary>👨🏻‍🏫 TO DO List</summary>

1. Front End looks like it is being mainly derived from DEX.jsx (which was taken from an old repo - challenge-3-dex from scaffold eth repo). We simply connected and routed what was needed and it started to work. Since it is importing from there, my guess is that when the smart contracts are blank, it will display the front end (buttons and all). If you click on a button that you know doesn't line up with a function from the smart contracts, then an error will arise in your webpage. **Could be worthwhile to do a better deep dive into front-end with someone who knows front-end** This may be why it is a bit clunky too!

2. The liquidity mapping is not displaying properly in debug or the front end for some reason. It was working before we started working on the front end. See this line of code. I'm guessing that if it was removed, that the liquidity may start to display right at least in the debug tab. The odd thing is that sometimes it works, and other times it does not.

```
<Divider> Liquidity ({liquidity ? ethers.utils.formatEther(liquidity) : "none"}):</Divider>
```

3. Archive the rough notes (unfinished) for those who are tackling this project from the Master branch itself. This is messy and unorganized because I took down notes as m00npapi and I progressed but only passively. After I get more experience with front end I think I can write this better.

Extra UI TODO's

4. When you swap from tokens to eth it automatically pops up the swap, we probably either want that popup to come a few seconds after the approve (you have to craft the transactions manually and have them sign the raw transaction with the next nonce) OR maybe a second button for the second action.
5. Display how much liquidity I have am providing / how much locked up I have of each asset or something
6. Formalize document and repo for an official challenge for scaffold-eth community / program

DEX.test.js TODO:

7. See TODO: in DEX.test.js

</details>

---

### 🚨TODO: STEVE - ARCHIVE THIS TOGGLE SECTION AS PER TO DO LIST AT TOP OF THIS DOCUMENT

<details markdown='1'><summary> 🚨 If you're using the master branch, and not the DEX challenge feature branch, then click this toggle to see how to hook things up for your front end. 🚨 </summary>

**NOTE: THIS IS IF THE USER IS GOING OFF OF THE MASTER BRANCH... ALTHOUGH WHEN THEY READ THIS I'M GUESSING THAT THEY ARE USING OUR REPO WHICH WILL HAVE THE STUFF ALL READY TO GO, THEY JUST GOTTA UNCOMMENT OR WHATEVER**

NOTE: <details markdown='1'><summary>Context for people newer to ReactJS</summary> For those that are really new to anything front-end development, there are many resources out there to possibly use. This one was particularly helpful from minutes 15 to 20 describing the typical folder structure within a ReactJS project.
https://www.youtube.com/watch?v=w7ejDZ8SWv8&ab_channel=TraversyMedia

 </details>

NOTE:
\*From a fresh master branch off of scaffold-eth repo, we found the following was needed to get things hooked up with the front-end:

1. Update index.js file within components sub-directory to include some things from the OG challenge repos:

```
export { default as Dex } from "./DEX";
export { default as Curve } from "./Curve";
```

2. Other files you'll need from OG repo: DEX.jsx, Curve.jsx
   NOTE: INSERT LINKS TO OG REPO

3. You will likely run into errors from your front-end assuming you've ran `yarn start` already. Let's fix those!

Find useEventListener, useContractLoader, useContractReader, useBlockNumber, useBlanace, useTokenBalance within DEX.jsx file. You will see them calling for .hooks --> delete those and replace with the following:

```
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useContractLoader } from "eth-hooks";
import { useContractReader } from "eth-hooks";
import { useBlockNumber } from "eth-hooks";
import { useBalance } from "eth-hooks";
import { useTokenBalance } from "eth-hooks/erc/erc-20/useTokenBalance";
```

These replacements are needed because the pointers within the `DEX.jsx` and `Curve.jsx` files from the OG repo are not accurate with the `master branch` off of `scaffold-eth` repo.

In 00_deploy_your_contracts.js, you'll have to write in the necessary code to get your contracts, using Ethers.js.

As well, make sure that the tags are updated to your contract names, it should be something like `module.exports.tags = ["YourContract"];` and you'll want to change it to:

`module.exports.tags = ["Balloons", "DEX"];`

**Further Check-Ups between DEX in Ch-3 and Ch-5**

NOTE: CLEAN THIS DOC UP

What's in Ch-5 but not Ch-3
_Imports_
Blockies
Missing Button and List
DownloadOutlined and UploadOutlined

```
import { Card, Col, Divider, Input, Row } from "antd"; 😎
import { useBalance, useContractReader, useBlockNumber } from "eth-hooks"; 😎
.
.
.
importing Address, TokenBalance are coming from their respectively named subdirectories: "./Address;," and "./TokenBalance;" 😎
.
.
.
export default function DEX(props) {etc.} <-- this line may have the wrong name, be careful because you are likely exporting Dex, not DEX. --> challnege 3 has Dex, ch5 has DEX
.
.
.
  const ethBalance = useBalance(contractAddress, props.localProvider);
😭 breaks challenge 3 code!
.
const tx = Transactor(props.injectedProvider...) is different than challenge 3 set up for const tx... in ch3 it is set up so we do not use injectedProvider 😎
.
.
.
const contractAddress = ternary operators in challenge5, whereas in challenge3 it is just direct, no ternary.
.
.
.
const tokenBalance = useTokenBalance --> this is different but we think it isn't breaking changes.
.
.
.
nonce is in challenge 5 and not challenge 3.
.
.
let swapTx differs just cause of nonce showing up.
.
.
consolelogging extras
.
.
let addingEth = 0 is in challenge 5.
.
.
Balloons button is in Challenge 3 DEX not Challenge 5 DEX

```

### Front-End (without the debug tab)

So the debug tab was taken care, or should be working now if all pointers have been corrected and variables instantiated, respectively.

The front-end is brought in through several steps.

State the aspects within the actual front-end display. First, find the comment in your `App.jsx`:
`{/* pass in any web3 props to this Home component. For example, yourLocalBalance */}`

There you will see the debug code blob below it, it is here where you will outline details for your home-page. Follow the medium blog post and you will see two inputs to bring into your `App.jsx` file:

**NOTE: NOTE TO SELF TO FIX THIS PART AS I'M NOT GETTING THE DEX TO LOAD ON THE FRONT END! ONLY BALLOONS :(**

```
<DEX
  address={address}
  injectedProvider={injectedProvider}
  localProvider={localProvider}
  mainnetProvider={mainnetProvider}
  readContracts={readContracts}
  price={price}
/>

<Contract
  title={"🎈 Balloons"}
  name={"Balloons"}
  show={["balanceOf","approve"]}
  provider={localProvider}
  address={address}
/>
```

Your front-end should now load accordingly!

</details>
