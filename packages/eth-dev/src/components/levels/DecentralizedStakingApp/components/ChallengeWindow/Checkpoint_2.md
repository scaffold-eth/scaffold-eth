## Checkpoint 2: 🥩 Staking 💵

You'll need to track individual `balances` using a mapping:
```solidity
mapping ( address => uint256 ) public balances;
```

And also track a constant `threshold` at ```1 ether```
```solidity
uint256 public constant threshold = 1 ether;
```

> 👩‍💻 Write your `stake()` function and test it with the `Debug Contracts` tab in the frontend

💸 Need more funds from the faucet?  Enter your frontend address into the wallet to get as much as you need!
<br/>
<br/>
![Wallet_Medium](https://user-images.githubusercontent.com/12072395/159990402-d5535875-f1eb-4c75-86a7-6fbd5e6cbe5f.png)
<br/>
<br/>
#### 🥅 Goals

- [ ] Do you see the balance of the `Staker` contract go up when you `stake()`?
- [ ] Is your `balance` correctly tracked?
- [ ] Do you see the events in the `Staker UI` tab?
<br/>
<br/>
