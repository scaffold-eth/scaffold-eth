The problem that you and Anon punk are facing is a common one in the Blockchain space.
<br />
How to securely handle large amounts of funds when collaborators/members are anonymous?
<br />
<br />
What most projects end up doing is using something called a Challenge5MultiSig.
<br />
A Challenge5MultiSig is a Smart Contract that can hold Ether and other tokens. And can execute arbitrary smart contract functions (e.g. functions of other smart contracts like Uniswap, Opensea, Curve.fi, etc.).
<br />
Typically, the Challenge5MultiSig Contract incorporates some form of voting, where members of the Challenge5MultiSig vote by proposing what functions to execute and then collectively vote yay or nay on whether the function should actually be executed.
<br />
<br />
A boilerplate has been prepared for you that you can fetch here:

```bash
# fetch code
$ git clone https://github.com/ssteiger/eth-dev-challenges.git
$ cd eth-dev-challenges
$ git checkout multi-sig

# install dependencies
$ yarn

# deploy contracts
$ yarn deploy

# start app
# when asked to use a different port, hit yes
$ yarn start
```
