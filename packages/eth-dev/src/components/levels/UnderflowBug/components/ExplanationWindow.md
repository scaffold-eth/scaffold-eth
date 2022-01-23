# Welcome

The contract that you can see to your right was taken from a real-world project with a real-world exploit.

Don't be intimidated by the amount of code. Scan it and try to understand what is going on if you like.
We will be focussing on `line 295`, specifically the `batchTransfer()` function.

Punk1234 wants us to find a way to issue more tokens. So we'll exploit it the same way it happend in the real-world.

First we need a way to interact with a smart contract using javascript.
We've prepared a boilerplate for this:

```bash
# fetch code
$ git clone https://github.com/ssteiger/eth-dev-challenges.git
$ cd eth-dev-challenges
$ git checkout challenge-01

# install dependencies
$ yarn

# start app
$ yarn start
```

Open the project in your favorite editor and take a look at the following file:

```text
packages/react-app/src/views/Script.js
```

We've already imported and prepared the smart contracts for you.

Further reading:

* [ERC20 Integer Overflow Bug Explained](https://medium.com/@blockchain101/beautychain-erc20-integer-overflow-bug-explained-c583adcd847e)

* [BatchOverflow Exploit Creates Trillions of Ethereum Tokens, Major Exchanges Halt ERC20 Deposits](https://cryptoslate.com/batchoverflow-exploit-creates-trillions-of-ethereum-tokens/)

* [Awesome Buggy ERC20 Tokens](https://github.com/sec-bit/awesome-buggy-erc20-tokens)

* [A disastrous vulnerability found in smart contracts of BeautyChain (BEC)](https://medium.com/secbit-media/a-disastrous-vulnerability-found-in-smart-contracts-of-beautychain-bec-dbf24ddbc30e)

* [exploit transaction](https://etherscan.io/tx/0xad89ff16fd1ebe3a0a7cf4ed282302c06626c1af33221ebe0d3a470aba4a660f)
