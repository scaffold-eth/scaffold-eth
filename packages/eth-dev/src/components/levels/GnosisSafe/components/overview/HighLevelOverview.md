# High level Overview of GnosisSafe

One of the most used Multisig wallets in the Ethereum ecosystem is the Genosis Safe.
The Genosis Safe smart contracts touch on a lot of complex and deep Ethereum and Solidity concepts.
Additionally its modular structure allows the safe to be easily incorporated into a lot of SC project use cases.
This makes the Genosis Safe SC the ideal candidate for an in depth case study.

In this chapter we will be going line by line through the Genosis Safe smart contracts to gain a deep understanding of the design choices the Genosis team took. As well as touch on a multitude of advanced solidity and Ethereum concepts.
Goal is to gain a solid understanding of some key advanced SC development concepts by understanding where, how and why they can be used.

## Overview

* SafeMath
* keccak256()
* nonce
* delegate call
* handling gas inside smart contract wallets
* calldata
* bytes vs. memory vs. calldata
* Inline Assembly & evm-opcodes
* signatures & signature checking in smart contracts

[Projects using GnosisSafe](https://docs.gnosis-safe.io/introduction/statistics-and-usage/dao-users)

### SafeMath

`GnosisSafeMath` is a library for using safe math operations that prevent overflows.

Unsigned integers in solidity have a maximum and minumum value (from 0 to 2^256 (1.1579209e+77)).
If the maximum value is reached and then incremented once more the variable is set to 0. The same happens the other way. When the value of the variable is 0 and it is then substracted by 1.

SafeMath libraries prevents this from happening when working with uints.

NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler now has built in overflow checking.

### keccak256()





TODO:
## High level overview on how transactions are created, signed and executed using GnosisSafe
