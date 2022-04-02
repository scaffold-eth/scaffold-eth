## Checkpoint 4: 💵 Receive Function / UX 🙎

🎀 To improve the user experience, set your contract up so it accepts ETH sent to it and calls `stake()`. You will use what is called the `receive()` function.

> Use the [receive()](https://docs.soliditylang.org/en/v0.8.9/contracts.html?highlight=receive#receive-ether-function) function in solidity to "catch" ETH sent to the contract and call `stake()` to update `balances`.

#### 🥅 Goals
- [ ] If you send ETH directly to the contract address does it update your `balance`?

<br/>
<br/>

### ⚔️ Side Quests
- [ ] Can execute get called more than once, and is that okay?
- [ ] Can you stake and withdraw freely after the `deadline`, and is that okay?
- [ ] What are other implications of *anyone* being able to withdraw for someone?

<br/>
<br/>

### 🐸 It's a trap!
- [ ] Make sure funds can't get trapped in the contract! **Try sending funds after you have executed! What happens?**
- [ ] Try to create a [modifier](https://solidity-by-example.org/function-modifier/) called `notCompleted`. It will check that `ExampleExternalContract` is not completed yet. Use it to protect your `execute` and `withdraw` functions.

<br/>
<br/>

#### ⚠️ Test it!
-  Now is a good time to run `yarn test` to run the automated testing function. It will test that you hit the core checkpoints.  You are looking for all green checkmarks and passing tests!
<br/>
<br/>
