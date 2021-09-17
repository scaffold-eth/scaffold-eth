# 🏗 scaffold-eth | 🏰 BuidlGuidl | 🚩 Challenge 2: Token Vendor

## The goal of the dApp

The goal of this challenge is to create your own ERC20 Token and a Token Vendor Contract that will handle the sell/buy process of your token exchanging it with ETH sent by the user.

## What are you going to learn?

-   What is an ERC20 Token
-   How to mint an ERC20 Token
-   OpenZeppelin ERC20 implementation
-   Ownership of a Contract
-   How to create a Token Vendor contract to sell/buy your token

In addition to the content above we are going to learn a lot of new Solidity and web3 concepts and how to write well-made tests for your Solidity code. I’m going to skip some basic parts so if you feel lost just go back to the [first challenge](https://github.com/scaffold-eth/scaffold-eth/tree/challenge-1-decentralized-staking) and read all the explanations.

### Some always useful links that you should always have in mind:

-   [Solidity by Example](https://solidity-by-example.org/)
-   [Solidity Documentation](https://docs.soliditylang.org/)
-   [Hardhat Documentation](https://hardhat.org/getting-started/)
-   [Ethers-js Documentation](https://docs.ethers.io/v5/)
-   [OpenZeppelin Documentation](https://docs.openzeppelin.com/openzeppelin/)
-   [OpenZeppelin Ethernaut tutorial](https://ethernaut.openzeppelin.com/)
-   [CryptoZombies Tutorial](https://cryptozombies.io/)

## What is an ERC20 Token?

Before we start I will just give you an overview of what an ERC20 Token is quoting directly the Ethereum Documentation.

Tokens can represent virtually anything in Ethereum:

-   reputation points in an online platform
-   skills of a character in a game
-   lottery tickets
-   financial assets like a share in a company
-   a fiat currency like USD
-   an ounce of gold
-   and more…

Such a powerful feature of Ethereum must be handled by a robust standard, right? That’s exactly where the ERC-20 plays its role! This standard allows developers to build token applications that are interoperable with other products and services.

The ERC-20 introduces a standard for Fungible Tokens, in other words, they have a property that makes each Token be exactly the same (in type and value) of another Token. For example, an ERC-20 Token acts just like the ETH, meaning that 1 Token is and will always be equal to all the other Tokens.

If you want to know more about the ERC-20 token you can look at these links:

-   [ERC-20 Token Standard on Ethereum Documentation](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
-   [EIP-20 Ethereum Improvement Proposals](https://eips.ethereum.org/EIPS/eip-20)

## Setup the project

First of all, we need to set up it. Clone the scaffold-eth repository, switch to the challenge 1 branch and install all the needed dependencies.

    git clone [https://github.com/austintgriffith/scaffold-eth.git](https://github.com/austintgriffith/scaffold-eth.git) challenge-2-token-vendor  
    cd challenge-2-token-vendor  
    git checkout challenge-2-token-vendor  
    yarn install

To locally test your application

-   `yarn chain` to start your local hardhat chain
-   `yarn start` to start your local React app
-   `yarn deploy` to deploy/redeploy your contract and update the React app

## OpenZeppelin and ERC20 Implementation

OpenZeppelin provides security products to build, automate, and operate decentralized applications.

We are going to use the OpenZeppelin Contract framework to build our own ERC20 Token.

**The framework is a library for secure smart contract development.** Build on a solid foundation of community-vetted code.

-   Implementations of standards like [ERC20](https://docs.openzeppelin.com/contracts/4.x/erc20) and [ERC721](https://docs.openzeppelin.com/contracts/4.x/erc721).
-   Flexible [role-based permissions](https://docs.openzeppelin.com/contracts/4.x/access-control) scheme.
-   Reusable [Solidity components](https://docs.openzeppelin.com/contracts/4.x/utilities) to build custom contracts and complex decentralized systems.

If you want to learn more about the OpenZeppelin implementation you can follow these links:

-   [OpenZeppelin ERC20 Contract](https://docs.openzeppelin.com/contracts/4.x/erc20)
-   [OpenZeppelin ERC20 API Reference](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20)

## Exercise Part 1: Create your own ERC20 Token and deploy it!

  

In the first part of the exercise, you need to create a Token Contract inhering from OpenZepllein’s ERC20 Contract.

In the constructor, you have to mint `1000 token` (remember that in Solidity an [ERC20 token has 18 decimals](https://docs.openzeppelin.com/contracts/4.x/erc20#a-note-on-decimals)) and send them to the `msg.sender` (the one that deployed the contract).

Remember to update the `deploy.js` file to send those tokens to the correct address. You can find your current address on the top right of your web application, just hit the copy icon!

To transfer tokens to your account, add this line to your `deploy.js`:

`const result = await yourToken.transfer("**YOUR FRONTEND ADDRESS**", utils.parseEther("1000"));`

Don’t be scared, I’ll explain later after reviewing the code.

-   Can you see on the frontend that the `balanceOf` your Wallet has those 1000 tokens?
-   Can you `transfer()` some of those tokens to another wallet address? Simply open a new incognito window on Chrome, type your localhost address and you should have a brand new burner account to send those tokens to!

### Important Concepts to master

-   [OpenZeppelin ERC20 Contract](https://docs.openzeppelin.com/contracts/4.x/erc20)
-   [Ethereum ERC-20 Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
-   [Inheritance](https://solidity-by-example.org/inheritance/)  — Contracts can inherit from other contracts by using the `is` keyword.
-   [Shadowing Inherited State Variables](https://solidity-by-example.org/shadowing-inherited-state-variables/)  — As explained by SolidityByCode unlike functions, state variables cannot be overridden by re-declaring them in the child contract

### YourToken.sol

```ts
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Learn more about the ERC20 implementation 
// on OpenZeppelin docs: https://docs.openzeppelin.com/contracts/4.x/erc20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourToken is ERC20 {
    constructor() ERC20("Scaffold ETH Token", "SET") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
```

As you can see we are importing the ERC20.sol Contract from the OpenZeppelin library. That Contract is the OpenZeppelin implementation of the ERC20 Standard and they made an amazing job on both security and optimization!

When in your code you `is ERC20` that code make your `YourContract` contract inherits all the function/state variables implemented in the ERC20 Contract from OpenZeppelin.

The amazing thing is that everything is open source. Try to `CMD+click` on the ERC20 keyword or on the `_mint` function.

As you can see when the `constructor` of our contract is called, we are also calling the ERC20 constructor passing two arguments. The first one is the `name` of our Token and the second one is the `symbol`.

The second important part is the `_mint` function, let’s take a look at it.

![ERC20 mint function](https://cdn-images-1.medium.com/max/1200/1*JRCmopUIIfqM5X2iS_D25w.png)

The first `require` you see is just checking that the minter (the one that will receive all the token minted) is not the null address.

`_beforeTokenTransfer` and `_afterTokenTransfer` are function hooks that are called after any transfer of tokens. This includes minting and burning.

In the rest of the code, we are updating the `_totalSupply` of the token (in our case it would be 1000 tokens with 18 decimals), updating the minter `balance` with the amount and we are emitting a `Transfer` event.

How cool is that? And in our `TokenContract` we have **only** called one function.

Remember that I said to updated the deploy.js file to transfer all those tokens to our wallet in the web app? The code was this:

`await yourToken.transfer(‘0xafDD110869ee36b7F2Af508ff4cEB2663f068c6A’, utils.parseEther(‘1000’));`

`transfer` is another function offered by the ERC20 Contract implementation.

![ERC20 Transfer function](https://cdn-images-1.medium.com/max/1200/1*uIXPgJGp3Cx-VFPbAKuCJg.png)

I will not go much into detail but after checking that both the `sender` and `recipient` are not the `null address` the function will check if the sender has enough balance to transfer the requested amount, will transfer it and will also emit a `Transfer` event.

## Exercise Part 2: Create a Vendor Contract

In this part of the exercise, we are going to create our Vendor Contract.

The Vendor will be responsible to allow users to exchange ETH for our Token. In order to do that we need to

-   Set a price for our token (1 ETH = 100 Token)
-   Implement a payable `buyToken()` function. To transfer tokens look at the `transfer()` function exposed by the OpenZeppelin ERC20 implementation.
-   Emit a `BuyTokens` event that will log who’s the buyer, the amount of ETH sent and the amount of Token bought
-   Transfer all the Tokens to the Vendor contract at deployment time
-   Transfer the `ownership` of the Vendor contract (at deploy time) to our frontend address (you can see it on the top right of your web app) to withdraw the ETH in the balance

### Important Concepts to master

-   [Events](https://solidity-by-example.org/events/)
-   [Payable functions](https://solidity-by-example.org/payable/)
-   [Open Zeppelin Ownable & ownership](https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable)  — OpenZeppelin module used through inheritance. It will make available the modifier `onlyOwner`, which can be applied to your functions to restrict their use to the owner.
-   [OpenZeppelin Address utility](https://docs.openzeppelin.com/contracts/4.x/api/utils#Address) (not required but useful to known)  — Collection of functions related to the address type. You could use it to safely transfer ETH funds from the Vendor to the owner
-   [Transfer function from OpenZeppelin ERC20 contract](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-transfer-address-uint256-)  —  `transfer(address recipient, uint256 amount)` moves `amount` tokens from the caller’s account to `recipient` and returns a boolean value indicating whether the operation succeeded.
-   [Sending ether  ](https://solidity-by-example.org/sending-ether/)— As we saw in the previous challenge always use the `call` function to do that!

### Vendor.sol

Let’s review the important part of the code.

```ts
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./YourToken.sol";

// Learn more about the ERC20 implementation 
// on OpenZeppelin docs: https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {

  // Our Token Contract
  YourToken yourToken;

  // token price for ETH
  uint256 public tokensPerEth = 100;

  // Event that log buy operation
  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

  constructor(address tokenAddress) {
    yourToken = YourToken(tokenAddress);
  }

  /**
  * @notice Allow users to buy token for ETH
  */
  function buyTokens() public payable returns (uint256 tokenAmount) {
    require(msg.value > 0, "Send ETH to buy some tokens");

    uint256 amountToBuy = msg.value * tokensPerEth;

    // check if the Vendor Contract has enough amount of tokens for the transaction
    uint256 vendorBalance = yourToken.balanceOf(address(this));
    require(vendorBalance >= amountToBuy, "Vendor contract has not enough tokens in its balance");

    // Transfer token to the msg.sender
    (bool sent) = yourToken.transfer(msg.sender, amountToBuy);
    require(sent, "Failed to transfer token to user");

    // emit the event
    emit BuyTokens(msg.sender, msg.value, amountToBuy);

    return amountToBuy;
  }

  /**
  * @notice Allow the owner of the contract to withdraw ETH
  */
  function withdraw() public onlyOwner {
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, "Owner has not balance to withdraw");

    (bool sent,) = msg.sender.call{value: address(this).balance}("");
    require(sent, "Failed to send user balance back to the owner");
  }
}
```

In the `buyTokens()` we are checking that the user has sent us at least some ETH otherwise we will revert the transaction (don’t be cheap!). Remember that in order to receive ETH our function must have the keyword `payable`.

After that, we calculate, based on the token price how many tokens he will receive with the amount of ETH sent.

We are also checking that the Vendor contract has enough balance of Tokens to fill the user buy request, otherwise we revert the transaction.

If every check goes well we trigger the `transfer` function of our Token Contract implemented inside the ERC20 contract that is inherited by the Token Contract (see the image above to view the code). That function is returning a `boolean` that will notify us if the operation was successful.

The last thing to do is to emit the `BuyTokens` event to notify to the blockchain that we made the deal!

The `withdraw()` function is pretty simple. As you can see it rely on the `onlyOwner` `function modifier` that we inherited by the `Owner` contract. That modifier is checking that the `msg.sender` is the owner of the contract. We don’t want another user to withdraw the ETH we collected. Inside the function, we are transferring the ETH to the owner and checking if the operation was successful. Another way to do that, as I said previously is to use the `sendValue` of the [Address utility](https://docs.openzeppelin.com/contracts/4.x/api/utils#Address-sendValue-address-payable-uint256-) of OpenZeppelin.

[![scaffol-eth challgenge 2 - ERC20 Token + Vendor dApp - Part 1 buyTokens](https://img.youtube.com/vi/xQNKBMKmdNs/0.jpg)](http://www.youtube.com/watch?v=xQNKBMKmdNs 'scaffol-eth challgenge 2 - ERC20 Token + Vendor dApp - Part 1 buyTokens')

## Exercise Part 3: Allow the Vendor to buy back!

This is the last part of the exercise and it’s the most difficult one, not from a technology point of view but more from a concept and UX.

We want to allow the user to sell their token to our Vendor contract. As you know, Contract can accept ETH when their function is declared as `payable`, but they are only allowed to receive ETH.

So what we need to implement is to allow our Vendor to take Tokens directly from our Token’s balance and trust him to give us back the equal value amount of ETH back. This is called the “Approve approach”.

This is the flow that will happen:

-   The user requests to “approve” the Vendor contract to transfer tokens from the user’s balance to Vendor’s wallet (this will happen on the Token’s contract). When you invoke the `approve` function you will specify the number of tokens that you want to decide to let the other contract be able to transfer **at max**.
-   The user will invoke a `sellTokens` function on Vendor’s contract that will transfer user’s balance to Vendor’s balance
-   The vendor’s contract will transfer to the user’s wallet an equal amount of ETH

### Important Concepts to master

-   [approve ERC20 function](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-transfer-address-uint256-)  — Sets `amount` as the allowance of `spender` over the caller’s tokens. Returns a boolean value indicating whether the operation succeeded. Emits an `[Approval](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-Approval-address-address-uint256-)` event.
-   [transferFrom ERC20 function](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-transfer-address-uint256-)  — Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then deducted from the caller’s allowance. Returns a boolean value indicating whether the operation succeeded. Emits a `[Transfer](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-Transfer-address-address-uint256-)` event.

> An important note that I would like to explain: UX over security
> This approve mechanism is not something new. If you ever used a DEX like Uniswap you already have done this.
> 
> The approve function allows other wallet/contract to transfer at max the number of tokens you specify within the function arguments. What does it mean? What if I want to trade 200 tokens I should approve the Vendor contract to only transfer to itself 200 tokens. If I want to sell another 100, I should approve it again. **Is it a good UX? Maybe not but it’s the most secure one.**
> 
> DEX uses another approach. To avoid to ask every time to the user to approve each time you want to swap TokenA for TokenB they simply ask to approve the MAX possible number of tokens directly. What does it mean? That every DEX contract could potentially steal all your tokens without you knowing it. You always should be aware of what’s happening behind the scene!

### Vendor.sol

```ts
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./YourToken.sol";

// Learn more about the ERC20 implementation 
// on OpenZeppelin docs: https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {

  // Our Token Contract
  YourToken yourToken;

  // token price for ETH
  uint256 public tokensPerEth = 100;

  // Event that log buy operation
  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
  event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfETH);

  constructor(address tokenAddress) {
    yourToken = YourToken(tokenAddress);
  }

  /**
  * @notice Allow users to buy tokens for ETH
  */
  function buyTokens() public payable returns (uint256 tokenAmount) {
    require(msg.value > 0, "Send ETH to buy some tokens");

    uint256 amountToBuy = msg.value * tokensPerEth;

    // check if the Vendor Contract has enough amount of tokens for the transaction
    uint256 vendorBalance = yourToken.balanceOf(address(this));
    require(vendorBalance >= amountToBuy, "Vendor contract has not enough tokens in its balance");

    // Transfer token to the msg.sender
    (bool sent) = yourToken.transfer(msg.sender, amountToBuy);
    require(sent, "Failed to transfer token to user");

    // emit the event
    emit BuyTokens(msg.sender, msg.value, amountToBuy);

    return amountToBuy;
  }

  /**
  * @notice Allow users to sell tokens for ETH
  */
  function sellTokens(uint256 tokenAmountToSell) public {
    // Check that the requested amount of tokens to sell is more than 0
    require(tokenAmountToSell > 0, "Specify an amount of token greater than zero");

    // Check that the user's token balance is enough to do the swap
    uint256 userBalance = yourToken.balanceOf(msg.sender);
    require(userBalance >= tokenAmountToSell, "Your balance is lower than the amount of tokens you want to sell");

    // Check that the Vendor's balance is enough to do the swap
    uint256 amountOfETHToTransfer = tokenAmountToSell / tokensPerEth;
    uint256 ownerETHBalance = address(this).balance;
    require(ownerETHBalance >= amountOfETHToTransfer, "Vendor has not enough funds to accept the sell request");

    (bool sent) = yourToken.transferFrom(msg.sender, address(this), tokenAmountToSell);
    require(sent, "Failed to transfer tokens from user to vendor");


    (sent,) = msg.sender.call{value: amountOfETHToTransfer}("");
    require(sent, "Failed to send ETH to the user");
  }

  /**
  * @notice Allow the owner of the contract to withdraw ETH
  */
  function withdraw() public onlyOwner {
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, "Owner has not balance to withdraw");

    (bool sent,) = msg.sender.call{value: address(this).balance}("");
    require(sent, "Failed to send user balance back to the owner");
  }
}
```

Let’s review `sellTokens`.

First of all, we check that the `tokenAmountToSell` is greater than `0` otherwise, we revert the transaction. You need to sell at least one of your tokens!

Then we check that the **user’s token balance** is at least **greater** than the amount of token he’s trying to sell. You cannot oversell what you don’t own!

After that, we calculate the `amountOfETHToTransfer` to the user after the sell operation. We need to be sure that the Vendor can pay that amount so we’re checking that Vendor’s balance (in ETH) is greater than the amount to transfer to the user.

If everything is OK we proceed with the `(bool sent) = yourToken.transferFrom(msg.sender, address(this), tokenAmountToSell);` operation. We are telling the YourToken contract to transfer `tokenAmountToSell` from the user’s balance `msg.sender` to the Vendor’s balance `address(this)` . This operation can succeed only if the user has **already** **approved** at least that specific amount with the `approve` function we already reviewed.

The last thing we do is to **transfer** the ETH amount for the sell operation back to the user’s address. And we’re done!

### Update your App.jsx

In order to test this in your React app, you can update your App.jsx adding two `Card` to `Approve` and `Sell` tokens (see the GitHub code repo at the end of the post) or you can just do everything from the **Debug Contract** **tab** that offers all the needed features.

[![scaffol-eth challgenge 2 - ERC20 Token + Vendor dApp - Part 2 sellTokens](https://img.youtube.com/vi/G1Wcb6Q3mYI/0.jpg)](http://www.youtube.com/watch?v=G1Wcb6Q3mYI 'scaffol-eth challgenge 2 - ERC20 Token + Vendor dApp - Part 2 sellTokens')

## Exercise Part 4: Create a test suite

You know already from the previous post that Tests are a great foundation for the security and optimization of your app. You should never skip them and they are a way to understand the flow of the operations that are involved in the logic of the overall application.

Tests on Solidity environment leverage on four libraries:

-   [Hardhat](https://hardhat.org/)
-   [Ethers-js](https://docs.ethers.io/v5/)
-   [Waffle](https://ethereum-waffle.readthedocs.io/en/latest/index.html)
-   Chai (part of Waffle)

Let’s review one test and then I’ll dump the whole code

### Testing the sellTokens() function

![sellToken test case](https://cdn-images-1.medium.com/max/1200/1*YPEpE4hQGKoTtWLbgMMQQA.png)

This is the test that will verify that our `sellTokens` functions work as expected.

Let’s review the logic:

-   First of all `addr1` buys some tokens from the Vendor contract
-   Before selling as we said before we need to **approve** the Vendor contract to be able to transfer to itself the amount of token that we want to sell.
-   After the approval, we double-check that Vendor’s token **allowance** from addr1 is at least the amount of the token addr1 needs to sell (and transfer to the Vendor). This check could be skipped because we know that OpenZeppeling has already battle-tested their code but I just wanted to add it for learning purposes.
-   We are ready to sell the amount of token we just bought using the `sellTokens` function of Vendor contract

At this point we need to check three things:

-   The user’s token balance is 0 (we sold all our tokens)
-   User’s wallet has increased by 1 ETH with that transaction
-   The vendor’s token balance is 1000 (we bought 100 tokens)

Waffle offers some cool utilities to check [changes in ether balance](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-ether-balance) and [changes in token balances](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-token-balance) but unfortunately, it seems that there’s an issue on the latter one (check out the GitHub issue I just created).

### Test coverage complete code

```ts
const {ethers} = require('hardhat');
const {use, expect} = require('chai');
const {solidity} = require('ethereum-waffle');

use(solidity);

describe('Staker dApp', () => {
  let owner;
  let addr1;
  let addr2;
  let addrs;

  let vendorContract;
  let tokenContract;
  let YourTokenFactory;

  let vendorTokensSupply;
  let tokensPerEth;

  beforeEach(async () => {
    // eslint-disable-next-line no-unused-vars
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy ExampleExternalContract contract
    YourTokenFactory = await ethers.getContractFactory('YourToken');
    tokenContract = await YourTokenFactory.deploy();

    // Deploy Staker Contract
    const VendorContract = await ethers.getContractFactory('Vendor');
    vendorContract = await VendorContract.deploy(tokenContract.address);

    await tokenContract.transfer(vendorContract.address, ethers.utils.parseEther('1000'));
    await vendorContract.transferOwnership(owner.address);

    vendorTokensSupply = await tokenContract.balanceOf(vendorContract.address);
    tokensPerEth = await vendorContract.tokensPerEth();
  });

  describe('Test buyTokens() method', () => {
    it('buyTokens reverted no eth sent', async () => {
      const amount = ethers.utils.parseEther('0');
      await expect(
        vendorContract.connect(addr1).buyTokens({
          value: amount,
        }),
      ).to.be.revertedWith('Send ETH to buy some tokens');
    });

    it('buyTokens reverted vendor has not enough tokens', async () => {
      const amount = ethers.utils.parseEther('101');
      await expect(
        vendorContract.connect(addr1).buyTokens({
          value: amount,
        }),
      ).to.be.revertedWith('Vendor contract has not enough tokens in its balance');
    });

    it('buyTokens success!', async () => {
      const amount = ethers.utils.parseEther('1');

      // Check that the buyTokens process is successful and the event is emitted
      await expect(
        vendorContract.connect(addr1).buyTokens({
          value: amount,
        }),
      )
        .to.emit(vendorContract, 'BuyTokens')
        .withArgs(addr1.address, amount, amount.mul(tokensPerEth));

      // Check that the user's balance of token is 100
      const userTokenBalance = await tokenContract.balanceOf(addr1.address);
      const userTokenAmount = ethers.utils.parseEther('100');
      expect(userTokenBalance).to.equal(userTokenAmount);

      // Check that the vendor's token balance is 900
      const vendorTokenBalance = await tokenContract.balanceOf(vendorContract.address);
      expect(vendorTokenBalance).to.equal(vendorTokensSupply.sub(userTokenAmount));

      // Check that the vendor's ETH balance is 1
      const vendorBalance = await ethers.provider.getBalance(vendorContract.address);
      expect(vendorBalance).to.equal(amount);
    });
  });

  describe('Test withdraw() method', () => {
    it('withdraw reverted because called by not the owner', async () => {
      await expect(vendorContract.connect(addr1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('withdraw reverted because called by not the owner', async () => {
      await expect(vendorContract.connect(owner).withdraw()).to.be.revertedWith('Owner has not balance to withdraw');
    });

    it('withdraw success', async () => {
      const ethOfTokenToBuy = ethers.utils.parseEther('1');

      // buyTokens operation
      await vendorContract.connect(addr1).buyTokens({
        value: ethOfTokenToBuy,
      });

      // withdraw operation
      const txWithdraw = await vendorContract.connect(owner).withdraw();

      // Check that the Vendor's balance has 0 eth
      const vendorBalance = await ethers.provider.getBalance(vendorContract.address);
      expect(vendorBalance).to.equal(0);

      // Check the the owner balance has changed of 1 eth
      await expect(txWithdraw).to.changeEtherBalance(owner, ethOfTokenToBuy);
    });
  });

  describe('Test sellTokens() method', () => {
    it('sellTokens reverted because tokenAmountToSell is 0', async () => {
      const amountToSell = ethers.utils.parseEther('0');
      await expect(vendorContract.connect(addr1).sellTokens(amountToSell)).to.be.revertedWith(
        'Specify an amount of token greater than zero',
      );
    });

    it('sellTokens reverted because user has not enough tokens', async () => {
      const amountToSell = ethers.utils.parseEther('1');
      await expect(vendorContract.connect(addr1).sellTokens(amountToSell)).to.be.revertedWith(
        'Your balance is lower than the amount of tokens you want to sell',
      );
    });

    it('sellTokens reverted because vendor has not enough tokens', async () => {
      // User 1 buy
      const ethOfTokenToBuy = ethers.utils.parseEther('1');

      // buyTokens operation
      await vendorContract.connect(addr1).buyTokens({
        value: ethOfTokenToBuy,
      });

      await vendorContract.connect(owner).withdraw();

      const amountToSell = ethers.utils.parseEther('100');
      await expect(vendorContract.connect(addr1).sellTokens(amountToSell)).to.be.revertedWith(
        'Vendor has not enough funds to accept the sell request',
      );
    });

    it('sellTokens reverted because user has now approved transfer', async () => {
      // User 1 buy
      const ethOfTokenToBuy = ethers.utils.parseEther('1');

      // buyTokens operation
      await vendorContract.connect(addr1).buyTokens({
        value: ethOfTokenToBuy,
      });

      const amountToSell = ethers.utils.parseEther('100');
      await expect(vendorContract.connect(addr1).sellTokens(amountToSell)).to.be.revertedWith(
        'ERC20: transfer amount exceeds allowance',
      );
    });

    it('sellTokens success', async () => {
      // addr1 buy 1 ETH of tokens
      const ethOfTokenToBuy = ethers.utils.parseEther('1');

      // buyTokens operation
      await vendorContract.connect(addr1).buyTokens({
        value: ethOfTokenToBuy,
      });

      const amountToSell = ethers.utils.parseEther('100');
      await tokenContract.connect(addr1).approve(vendorContract.address, amountToSell);

      // check that the Vendor can transfer the amount of tokens we want to sell
      const vendorAllowance = await tokenContract.allowance(addr1.address, vendorContract.address);
      expect(vendorAllowance).to.equal(amountToSell);

      const sellTx = await vendorContract.connect(addr1).sellTokens(amountToSell);

      // Check that the vendor's token balance is 1000
      const vendorTokenBalance = await tokenContract.balanceOf(vendorContract.address);
      expect(vendorTokenBalance).to.equal(ethers.utils.parseEther('1000'));

      // Check that the user's token balance is 0
      const userTokenBalance = await tokenContract.balanceOf(addr1.address);
      expect(userTokenBalance).to.equal(0);

      // Check that the user's ETH balance is 1
      const userEthBalance = ethers.utils.parseEther('1');
      await expect(sellTx).to.changeEtherBalance(addr1, userEthBalance);
    });
  });
});
```

## Final step: deploy your Contract to the moon (testnet)

Ok, now it’s time. We have implemented our Smart Contract, we have tested the frontend UI, we have covered every edge case with our tests. We are ready to deploy it on the testnet.

Following the [scaffold-eth documentation](https://docs.scaffoldeth.io/scaffold-eth/solidity/deploying-your-contracts), these are the steps we need to follow:

1.  Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js` to the testnet you would like to use (in my case rinkeby)
2.  Updated the `infuriaProjectId` with one created on [Infura](https://infura.io/)
3.  Generate a deployer account `with yarn generate` . This command should generate two `.txt` file. One that will represent the account address and one with the **seed phrase** of the generated account.
4.  Run `yarn account` to see details of the account like eth balances across different networks.
5.  Make sure that the **mnemonic.txt** and **relative account files** are not pushed with your git repository, otherwise, anyone could get ownership of your Contract!
6.  Fund your deployer account with some funds. You can use an [instant wallet](https://instantwallet.io/) to send funds to the QR code you just saw on your console.
7.  Deploy your contract with `yarn deploy`!

If everything goes well you should see something like this on your console

![Deploy on Rinkeby success!](https://cdn-images-1.medium.com/max/800/1*5yt4Ucq28IB8yKN5_0df-A.png)

> _Deployment metadata is stored in the_ `_/deployments_` _folder, and automatically copied to_ `_/packages/react-app/src/contracts/hardhat_contracts.json_` _via the_ `_--export-all_` _flag in the_ `_yarn deploy_` _command (see_ `_/packages/hardhat/packagen.json_`_)._

If you want to check the deployed contract you can search for them on the Etherscan Rinkeby site:

-   [YourToken Contract](https://rinkeby.etherscan.io/address/0xf386a0FB2F5cd61f188cFC93949A9Ea56F6c3ce1)
-   [Vendor Contract](https://rinkeby.etherscan.io/address/0xC37e05dCF542273F71c08fC64802fDd8f3C3DD8e)

## Update your frontend app and deploy it on Surge!

We are going to use the [Surge](https://surge.sh/) method but you could also deploy your app on **AWS S3** or on **IPFS**, that’s up to you!

The [scaffold-eth documentations](https://docs.scaffoldeth.io/scaffold-eth/deployment/shipping-your-app) always come in hand but I will summarize what you should do:

1.  If you are deploying on mainnet you should verify your contract on Etherscan. This procedure will add credibility and trust to your application. If you are interested in doing so just follow [this guide](https://docs.scaffoldeth.io/scaffold-eth/infraestructure/etherscan) for scaffold-eth.
2.  Turn **off Debug Mode** (it prints an awful lot of console.log, something that you don’t want to see in Chrome Developer Console, trust me!). Open `App.jsx` , find `const DEBUG = true;` and turn it to `false`.
3.  Take a look at `App.jsx` and remove all unused code, just be sure to ship only what you really need!
4.  Make sure that your React app is pointing to the correct network (the one you just used to deploy your Contract). Look for `const targetNetwork = NETWORKS[“localhost”];` and replace `localhost` with the network of your contract. In our case, it will be `rinkeby`
5.  Make sure you are using your own nodes and not the ones in Scaffold-eth as they are public and there’s no guarantee they will be taken down or rate limited. Review lines 58 and 59 of `App.jsx`
6.  Update `constants.js` and swap **Infura**, **Etherscan,** and **Blocknative** API Keys if you want to use their services.

Are we ready? Let’s go!

Now build your React App with`yarn build` and when the build script has finished deploy it to Surge with `yarn surge`.

If everything goes well you should see something like this. Your dApp is now live on Surge!

![Deploy on Surge success!](https://cdn-images-1.medium.com/max/800/1*aRe4JaBGiz6bk3sCFrofRQ.png)

You can check out our deployed dApp here: [https://woozy-cable.surge.sh/](https://melted-mind.surge.sh/)

## Recap and Conclusions

That’s what we have learned and done so far

-   Clone scaffold-eth challenge repo
-   Learned a lot of web3/solidity concepts (deep dive into the ERC20 contract, approve pattern, and so on)
-   Create an ERC20 Token contract
-   Create a Vendor contract to allow users to buy and sell them
-   Tested our Contract locally on hardhat network
-   Deployed our contract on Rinkeby
-   Deployed our dApp on Surge

If everything works as expected, you are ready to make the big jump and deploy everything on Ethereum main net!


---

> 🎖 Show off your app by pasting the url in the [Challenge 2 telegram channel](https://t.me/joinchat/IfARhZFc5bfPwpjq)


> 💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)
