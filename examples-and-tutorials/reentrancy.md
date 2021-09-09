# ☠️ Re-entrancy Attack

## Tutorial Info

**Source code:** [https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example](https://github.com/austintgriffith/scaffold-eth/tree/reentrancy-example)  
**Intended audience:** Beginners/Intermediate  
**Topics:** Scaffold-eth basics, Security

## Re-entrancy Example

[What is a Re-Entrancy Attack?](https://quantstamp.com/blog/what-is-a-re-entrancy-attack)

## Tutorial Explanation

The re-enterancy contract is vulnerable through its poorly written withdraw\(\) function. Withdraw\_safe\(\) is not. To test the attack do this:

**Player 1 \(usually an incognito tab\):**  
In the re-enterancy contract, Deposit 0.001 ETH \(converted into GWEI by clicking \*\)  
Verify the amount in the contract is $0.001 \(or whatever the price of ETH is\)

**Player 2 \(attacker\):**  
In the attacker contract, deposit 0.001 ETH as well.  
Verify the contract now has $0.002  
From the attacker contract, withdraw  
Notice the balance of the attacker contract now has 2x the funds it should, and re-enterancy has 0. Also, the Player 1's balance in the contract seems to still be 0.001.

_The takeaway? Follow the checks-effects-interaction pattern in all your functions :\)_

## Quickstart

```text
git clone https://github.com/austintgriffith/scaffold-eth.git reentrancy
cd reentrancy
git checkout reentrancy-example
```

```text
yarn install
```

```text
yarn start
```

> in a second terminal window:

```text
yarn chain
```

> in a third terminal window:

```text
yarn deploy
```

🔏 Edit your smart contract `Attacker.sol` and `Reenterancy.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📱 Open [http://localhost:3000](http://localhost:3000/) to see the app

First try interacting with `Reenterancy.sol` directly. You can deposit, check your balance, and withdraw:

![](https://user-images.githubusercontent.com/2653167/104358533-d135f280-54cb-11eb-947f-c23244cec8f2.png)

For the attack to work, you need to deposit some _extra_ funds so they can be stolen:

![](https://user-images.githubusercontent.com/2653167/104358669-017d9100-54cc-11eb-95c2-ef73da4b6b2b.png)

Make sure the `Reenterancy.sol` contract has extra funds in it:

![](https://user-images.githubusercontent.com/2653167/104358768-2245e680-54cc-11eb-8f87-c20cca22f54a.png)

Then, deposit a the same amount through the `Attacker.sol`:

![](https://user-images.githubusercontent.com/2653167/104358818-31c52f80-54cc-11eb-91f6-99e838a44d3e.png)

Finally, when you withdraw from the `Attacker.sol` it will withdraw once and then _re-enter_ and withdraw _again_:

![](https://user-images.githubusercontent.com/2653167/104358966-5b7e5680-54cc-11eb-94c3-042ff0e7325d.png)

The `Reenterancy.sol` contract is now empty but the original account that deposited the extra funds _thinks_ they still have a balance:

![](https://user-images.githubusercontent.com/2653167/104359146-93859980-54cc-11eb-9887-eccfe8cc17ef.png)

