# 🏗 Scaffold-ETH - Circom Contract State

So you've checked out the [circom starter kit](https://github.com/scaffold-eth/scaffold-eth/tree/circom-starter-kit) and want to move on the the next step, this is it!

We're going to learn how to use a circom zk circuit to modify smart contract state.

Today we'll:
- Create a circuit that will give us the product of the squares of a private input, and a public input that is equal to our contract state.
- Implement a function to modify our smart contract state using the output of the circuit we create.

## Installation

Clone the repo and install dependencies.

```bash
git clone -b circom-contract-tutorial https://github.com/austintgriffith/scaffold-eth.git circom-contract-tutorial

yarn install
```

## Creating a Circuit

#### Creating Files

First step is to actually make a circuit.

In `packages/hardhat/circuits` we will create a new directory and name it `sqMul`. Inside we will need to make two files: `circuit.circom`, and `input.json`.

We should make our `circuit.circom` look like this:

```
template Main() {

}

component main = Main();
```

And our `input.json` should be an empty `JSON` like this:

```
{

}
```

#### Adding Input & Output Signals

We know that we want two input signals; `x`, and `state`, and a single output signal we will call `out`.

Our inputs will look like this:

```
signal private input x;
signal input state;
```
Notice our `x` is private, this is a zk circuit after all. And our `state` is public as we want our smart contract be able  to confirm this signal. If a signal is not stated to be private it will be public.

```
signal output out;
```

Output signals will always be public.

For now we will simply assign our `out` signal as the product of `x` and `state`.

```
out <== x*state;
```

Notice the `<==` operator. This assigns a value to a signal while generating a constraint at the same time. See [here](https://docs.circom.io/2.-circom-fundamentals/constraints-generation) for more info.

Your `circuit.circom` should now look like this:

```
template Main() {
  signal private input x;
  signal input state;

  signal output out;

  out <== x*state;
}
```

Before we compile our circuit we will need to define some inputs in our `input.json`. Let's keep it simple and give both input signals a value of 2:

```
{
  "x": "2",
  "state": "2"
}
```

#### Compile

Now just open up a terminal and run `yarn circom` and our circuit should now be compiled!

## Smart Contract

We're not quite done with our circuit yet, but let's move on to getting our smart contract to accept a zk proof to change state.

Within `packages/hardhat/contracts` there are two contracts we will be interested in; `YourContract.sol`, and `SqMulVerifier.sol` which was generated when we ran `yarn circom` earlier. Take a look through `SqMulVerifier.sol` to see what's happening inside. It looks quite complex, but the part we are interested in is right at the bottom, the `verifyProof()` function!

#### Make `YourContract` a Verifier

First we will need to import our verifier into `YourContract.sol` like so:

```solidity
import "./SqMulVerifier.sol";
```

Next our contract will need to become a verifier. Simply:

```solidity
contract YourContract is Verifier {
  //...
}
```

#### Public Signals

Now that our contract is a verifier we can deploy it and make ourselves a proof!

Run `yarn deploy` in a terminal.

And in another terminal run `yarn start`.

Our app should open in your browser with a simple interface to generate and verify our proofs. Click the "Prove" button and you should see a proof generated that looks somewhat like this:

```json
{
  "pi_a": [
    "10039919915899401315472254225431071885428813597219685501708762199406818073997",
    "10268184631797638178785625160234178178115421279991328152990740358608470266382",
    "1"
  ],
  "pi_b": [
    [
      "11642484425833421100449968257808426788055366991788474857846708714340360060196",
      "19621364499331227782809817986222885640864370747697002156727573531922689957971"
    ],
    [
      "20503237014553477645966398361239821946600452477321694809944111385033442842598",
      "19398798654345896021419633604235680694583837162151729573015163364525849528935"
    ],
    [
      "1",
      "0"
    ]
  ],
  "pi_c": [
    "17787311029596494884334190326985550454202801548207446007162228337569655281207",
    "779294060049653872554670723408686596071206860912730416303556369095500166468",
    "1"
  ],
  "protocol": "groth16",
  "curve": "bn128"
}
[
  "4",
  "2"
]
```

Now if we click over into the "Solidity Calldata" tab you will see this proof parsed into something our solidity smart contract verifier can use:

```json
[
  [
    "10039919915899401315472254225431071885428813597219685501708762199406818073997",
    "10268184631797638178785625160234178178115421279991328152990740358608470266382"
  ],
  [
    [
      "19621364499331227782809817986222885640864370747697002156727573531922689957971",
      "11642484425833421100449968257808426788055366991788474857846708714340360060196"
    ],
    [
      "19398798654345896021419633604235680694583837162151729573015163364525849528935",
      "20503237014553477645966398361239821946600452477321694809944111385033442842598"
    ]
  ],
  [
    "17787311029596494884334190326985550454202801548207446007162228337569655281207",
    "779294060049653872554670723408686596071206860912730416303556369095500166468"
  ],
  [
    "4",
    "2"
  ]
]
```

These are all the arguments needed for the `verifyProof()` contract function.

The important part for us to understand is the last array. These are the public signals of our proof.

```json
[
  "4",
  "2"
]
```

The output signals will be listed first in the array. So in this case our output signal `out` is equal to `4`. Our public input signals are listed after our output signals. The `state` signal is equal to `2` in this proof. Our private input signals will not be listed.

#### Changing Contract State

Now that we understand public signals and where they end up in our proof we can modify our contract state!

In `YourContract.sol` we have :

```
uint256 public state = 2;
```

This variable is what we will change with our zk proof.

Take a look at the `verifyProof()` function in `SqMulVerifier.sol` again. Notice the function arguments.

We will create a new function, `changeState()`, in `YourContract.sol` that will take the same arguments as `VerifyProof`:

```solidity
    function changeState(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public {

    }
```

This function will accept the members of our solidity calldata array from earlier as arguments. But it doesn't do anything yet!

All of our public signals are given to `changeState()` as the `uint[2] memory input` arg. So `input[0]` is our `out` signal, and `input[1]` is our `state` signal from our circuit.

But before we get to changing state we have to make sure the proof passed into our `changeState()` function is valid. We can just call `verifyProof()` with all of our function arguments, and add a require statement to make sure the proof is valid!

```solidity
    bool proof = verifyProof(a, b, c, input);
    require(proof == true, "Invalid proof");
```

We are going to have a problem here though. Do you know what it is?

Anybody can submit a proof with any input signals. We want to make sure that the circuit's `state` signal is equal to our contract's `state` variable. The solution? Another require statement!

```solidity
    require(input[1] == state, "Incorrect value");
```

Now changing the contract's `state` variable is as simple as assigning our proof's `out` signal to the `state` variable.

```soidity
    state = input[0];
```

Your `changeState()` function should look a little something like this:

```solidity
    function changeState(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public {
        require(input[1] == state, "Incorrect value");
        bool proof = verifyProof(a, b, c, input);
        require(proof == true, "Invalid proof");
        state = input[0];
    }
```

Now test it out in the frontend! Copy & paste the members of the solidity calldata array into the `changeState()` function of the contract componenet near the bottom of the page.

## A Slightly More Complex Circuit

#### multiplication & Constraints

Congratulations! You can now modify a smart contract's state with a zero knowledge proof!

But our circuit isn't very complex. Let's try to make something a little more interesting.

Head back into our `sqMul/circuit.circom`. Let's square our signals and multiply them by each other.

```
out <== (x*x)*(state*state);
```

Now run `yarn circom`.

You should get this error:

```
Error: Type NQ can not be converted to QEX
```

See the circom docs([1](https://docs.circom.io/2.-circom-fundamentals/constraints-generation), [2](https://docs.circom.io/2.-circom-fundamentals/signals#assignment-to-signals), [3](https://docs.circom.io/5.-circom-insights/circom-compiler#unknowns)) to see why. A simplified rule to go by is for each `<==` operation we can only have one `*` operation on a signal.

We will need to create a couple intermediate signals and assign the squares of our input signals:

```
signal temp[2];
temp[0] <== x*x;
temp[1] <== state*state;
```
Now all we have to do is multiply our `temp` signals and assign them to our `out` signal:

```
out <== temp[0]*temp[1];
```

We can `yarn circom` and `yarn deploy` to test our newly modified circuit.

#### Wait, you want more complexity?

Alright, let's do the same computation for `n` number of rounds, except we take the latest product of our signals and multiply it by the last product.

We will have to add the `n` parameter to our circuit template.

```
template Main(n) {
  //...
}
```

We will also need `n+2` `temp` signals.

```
signal temp[n+2];
```

And our circuit will need a `for` loop so we can use an arbitrary number of `n` rounds:

```
for (var i = 0; i < n; i++) {
  temp[i+2] <== temp[i]*temp[i+1];
}
```

Our `out` signal will need to be assigned the latest `temp` signal:

```
out <== temp[n+1];
```

Lastly the instantiation of our circuit will need to specify how many rounds our circuit should calculate.

```
component main = Main(53);
```

Now we can `yarn circom` and `yarn deploy`. Give your new circuit and smart contract a whirl!

If this circuit wasn't complex enough for you try building one for yourself, and if you want a different kind of challenge try building a specialized frontend for this or another circuit & smart contract pair!

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
