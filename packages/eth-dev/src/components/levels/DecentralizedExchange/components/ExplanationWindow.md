Ethereum has a long and rich history when it comes to decentralized exchanges.
<br />
A decentralized exchange is a bundle of smart contracts where users can freely trady tokens with each other. Just like they would on centralized exchanges like Coinbase or Binance.
One of the first DEX's that got some notable traction within the community was an exchange known as [EtherDelta](https://etherdelta.com).

![Ether Delta](https://imgur.com/a/r3adM3W)

The original code and the smart contracts used to run this DEX can be found [here](https://github.com/etherdelta/smart_contract/blob/master/etherdelta.sol).

Some time in early 2017 Vitalik Buterin [proposed](https://www.reddit.com/r/ethereum/comments/55m04x/lets_run_onchain_decentralized_exchanges_the_way/) a way to run a decentralized exchange on Ethereum.
He later [expanded](https://ethresear.ch/t/improving-front-running-resistance-of-x-y-k-market-makers/1281) on the original idea by introducing the now famouse
```x*y=k formula```.

One of the people that stumbled accrosse Buterins post was [Hayden Adams](https://twitter.com/haydenzadams), founder of Uniswap. He promptly coded up a [MVP](https://github.com/Uniswap/old-solidity-contracts) which eventually grew into what [Uniswap](https://app.uniswap.org) is today.

A boilerplate has been prepared for you that you can fetch here:

[https://github.com/squirtleDevs/scaffold-eth/tree/challenge-3-single-pool-dex](https://github.com/squirtleDevs/scaffold-eth/tree/challenge-3-single-pool-dex
)

Follow the README.md to complete the challenge.

This challenge will help you build/understand a simple decentralized exchange, with one token-pair (ERC20 BALLOONS ($BAL) and ETH).
This repo is an updated version of the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) and challenge repos before it. Please read the intro for a background on what we are building first!

There is a `DEXTemplate.sol` file for your use if you want (rename it to `DEX.sol`). As well, this repo has solutions (👮🏻 try not to peak!) in it (in root directory, there's a solutions sub-directory) for now, but the challenge is to write the smart contracts yourself of course!

> ❗️ NOTE: functions outlined within the `DEXTemplate.sol` are what works with the frontend of this branch/repo. Also return variable names may need to be specified exactly as outlined within the `Solutions/DEX.sol` file. If you are confused, see solutions folder in this repo and/or cross reference with frontend code.

There is also a [Youtube video](https://www.youtube.com/watch?v=eP5w6Ger1EQ&t=364s&ab_channel=SimplyExplained) that may help you understand the concepts covered within this challenge.
