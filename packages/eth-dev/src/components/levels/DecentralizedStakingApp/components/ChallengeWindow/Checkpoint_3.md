## Checkpoint 3: 🔬 State Machine / Timing ⏱

> ⚙️  Think of your smart contract like a *state machine*. First, there is a **stake** period. Then, if you have gathered the `threshold` worth of ETH, there is a **success** state. Or, we go into a **withdraw** state to let users withdraw their funds.

Set a `deadline` of ```block.timestamp + 30 seconds```
```solidity
uint256 public deadline = block.timestamp + 30 seconds;
```

👨‍🏫 Smart contracts can't execute automatically, you always need to have a transaction execute to change state. Because of this, you will need to have an `execute()` function that *anyone* can call, just once, after the `deadline` has expired.

> 👩‍💻 Write your `execute()` function and test it with the `Debug Contracts` tab

If the `address(this).balance` of the contract is over the `threshold` by the `deadline`, you will want to call: ```exampleExternalContract.complete{value: address(this).balance}()```

If the balance is less than the `threshold`, you want to set a `openForWithdraw` bool to `true` and allow users to `withdraw()` their funds.

(You'll have 30 seconds after deploying until the deadline is reached, you can adjust this in the contract.)

> 👩‍💻 Create a `timeLeft()` function including ```public view returns (uint256)``` that returns how much time is left.

⚠️ Be careful! if `block.timestamp >= deadline` you want to ```return 0;```

⏳ The time will only update if a transaction occurs. You can see the time update by getting funds from the faucet just to trigger a new block.

> 👩‍💻 You can call `yarn deploy --reset` any time you want a fresh contract

#### 🥅 Goals

- [ ] Can you see `timeLeft` counting down in the `Staker UI` tab when you trigger a transaction with the faucet?
- [ ] If you `stake()` enough ETH before the `deadline`, does it call `complete()`?
- [ ] If you don't `stake()` enough can you `withdraw()` your funds?
<br/>
<br/>
