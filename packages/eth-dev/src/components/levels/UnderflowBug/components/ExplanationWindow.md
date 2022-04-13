The contract to your right was taken from a real-world project that suffered from a real-world exploit.

Don't be intimidated by the amount of code. Scan it and try to understand what is going on if you like.
We will be focussing on `line 265`, specifically the `batchTransfer()` function.

Anon Punk wants us to find a way to issue more tokens. So we'll exploit this contract the same way it got exploited in the real-world.

First, we need a way to interact with a smart contract.
We'll be using Javascript.
A boilerplate has been prepared for you that you can fetch here:

```bash
# fetch code
$ git clone https://github.com/ssteiger/eth-dev-challenges.git
$ cd eth-dev-challenges
$ git checkout underflow-bug

# install dependencies
$ yarn

# start local ethereum chain
$ yarn chain

# in second terminal
# deploy contracts
$ yarn deploy

# start app
# when asked to use a different port, hit yes
$ yarn start
```

Open the app in your browser.
Then open the project in your favorite editor and take a look at the following file:

```text
packages/react-app/src/views/Script.js
```

We've already imported and prepared the smart contract for you.
Additionally, we've made a small adjustment to the contract. We've added a public function `mintTokensForEthDev(address _to)`.
Use this function to get yourself some initial tokens.
