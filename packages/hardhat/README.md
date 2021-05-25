## OpynPerpVault contracts

# Basics

There're 2 contracts: `Vault` contracts and the `SellAction` contract

To launch a short vault, you will need to do the following:

- Deploy `ShortOTokenActionWithSwap` **action contract** . You will be minting options on this `ActionContract`, and sell it directly from this contract with market makers through airswap.
- Deploy a `OpynPerpVault` **vault contract** which set the `ShortOTokenActionWithSwap` contract address as the only action.

### Rollover

To rollover a position, you need to:

1. call `closePosition` on the **vault contract** action contract. 
    - this will settle the short otokens, bring back all the money to the vault contract
2. commit to the next otoken the action is selling with `setNextOToken` on **action contract**
3. call `rollover` on the **vault contract**, this will  re-distrbute `ETH` to the action contract, and set the `otoken` in the action contract to the new one.
4. call `mintOToken` on the **action contract** to use the assets to mint new options.
5. use `swapSell` function to fill and Airswap order, and actually sell that otoken with the counter-party.

### diagram

![](https://i.imgur.com/suTvJiP.png)

- `OpynPerpVault` on the left: all the operation in green, is what need to be done by the vault owner.
- `ShortOTokenActionWithSwap` on the right: all the operation in purple, is what need to be done by the action owner; everything in green is triggered by vault.


Users will be interacting with the **vault contract**, which handles deposit & withdraw. the actual trade will happen in a separate action contract.

# Local Developement

## Install

```
npm install
```

add a `.secret` file containing your testing mnemonic in the current folder.

## Test

```
npx hardhat test
```

## Coverage

Generate test coverage report

```
npx hardhat coverage
```