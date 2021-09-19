# 🏗 scaffold-eth

> is everything you need to get started building decentralized applications powered by smart contracts

---

## quickstart

```bash
git clone -b commit-reveal-scafold https://github.com/austintgriffith/scaffold-eth.git commit-reveal-scafold 

cd commit-reveal-scafold
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash

yarn chain

```

> in a third terminal window:

```bash

yarn deploy

```

> This Branch demonstrates two types of on chain random generation on Ethereum with commit reveal and chainlink vrf.
> The Contracts have been deployed on Kovan, so once you try and interact with the UI do connect your wallet and switch to kovan

<img width="474" alt="Screenshot 2021-01-17 at 11 56 37 AM" src="https://user-images.githubusercontent.com/26670962/104834738-6ae41200-58c7-11eb-8b0e-a7da6ccb30a0.png">

> To interact with commit reveal contract just go to commit reveal in the home page.

<img width="480" alt="Screenshot 2021-01-17 at 11 56 19 AM" src="https://user-images.githubusercontent.com/26670962/104834735-66b7f480-58c7-11eb-8949-f082fb2e3aa0.png">

> To interact with chainlink custom vrf contract just go to chainlink vrf in the home page.
 
### Issues with Random Number Generation on Ethereum
There has been a strong need to have an efficient and secure way to generate random numbers on ethereum since it is public deterministic.
One trick many have used in the past is to use the previous blockhash as a source or randomness. This has a few flaws including its public nature and susceptibility to miner tampering.

### Solutions to generate randomness
- **Commit - Reveal** involves generating a random number and then hash it and send it on-chain (the commit). Next, on a future block, we’ll have them submit their original random number. Finally, we’ll hash their random number (that the miner shouldn’t know about) with the blockhash on the commit block (that the player couldn’t know about). This final hash is a pretty good source of randomness on-chain because it gives the player an assurance that the the miner didn’t manipulate it.
One con of this approach that it is not advisable to use when randomness involves something that is worth more than the block reward. Players and miners could collude and by sharing information they would have the opportunity to withhold mined blocks that aren’t winners for them.
To know more on the technical execution please checkout [Austin's](https://twitter.com/austingriffith) in depth [Article](https://medium.com/gitcoin/commit-reveal-scheme-on-ethereum-25d1d1a25428)

- **Chainlink VRF (Verifiable Random Function)** is a provably-fair and verifiable source of randomness designed for smart contracts.
it enables smart contracts to access randomness without compromising on security or usability. With every new request for randomness, Chainlink VRF generates a random number and cryptographic proof of how that number was determined. The proof is published and verified on-chain before it can be used by any consuming applications. This process ensures that the results cannot be tampered with nor manipulated by anyone, including oracle operators, miners, users and even smart contract developers.
**The only thing to keep in mind is requesting randomness with VRF requires a fee to be paid to the node operators** which is **0.1 LINK** for each call. To read about the technical implementation checkout this official Chainlink [Post](https://blog.chain.link/verifiable-random-functions-vrf-random-number-generation-rng-feature/).
