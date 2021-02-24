# 🏗 scaffold-eth

> is everything you need to get started building decentralized applications powered by smart contracts

---

Let's get started with 🏗 scaffold-eth and create our own decentralized application! 

:page_with_curl: In this tutorial, we will be building a **Staking App**. The main idea is that anyone can deposit into the contract and the contract becomes active if the threshold amount of money is met until the given deadline. However, if the deadline passes and necessary amount is not collected, then users can withdraw the deposited amount. Sounds interesting, right? :grinning:

## Getting started
Let's get right into it by having a fresh copy of 🏗 scaffold-eth master branch.

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git staking-app

cd staking-app
```

```bash

yarn install

```

:arrow_forward: Get our frontend running: 

```bash

yarn start

```

:arrow_forward: Run the local chain:

```bash
cd scaffold-eth
yarn chain

```

:arrow_forward: Deploy our smart contract:

```bash
cd scaffold-eth
yarn deploy

```

## Editing smart contract
The smart contract we need to edit is `YourContract.sol` and it is located in  `packages/hardhat/contracts`. 
Contract has an address in the local chain and it changes every time we deploy it.

### Variables
First, let's think about the variables that we will need :thinking:

:small_orange_diamond: Address -> Balance

To keep track of deposited amounts for each address the *mapping* structure would be useful since we can access the amount corresponding to user address quickly. You can read more about the syntax of mapping in Solidity [here](https://solidity-by-example.org/mapping/).
```
mapping(address => uint256) public balance;
```
:small_orange_diamond: isActive

Next, as an indication of whether the contract is active or not we will use the boolean variable. Initially, the contract is not active.
```
bool public isActive = false;
```
:small_orange_diamond: Threshold

Since we need to collect some amount to make the contract active, we will refer to it as a threshold amount. For this example, let's take it as 0.003 ETH. Note here that it is essential to multiply the amount in ETH by 10^18 because Solidity supports only integer values and we need to convert ETH into wei, which is the smallest unit (1 ETH = 10^18 wei). You can read more about ether units [here](https://docs.soliditylang.org/en/v0.5.10/units-and-global-variables.html).
```
uint256 constant public threshold = 0.003 * 10**18;
```
:small_orange_diamond: Deadline

We also need to declare a deadline, the time by which a threshold amount should be gathered. Notice that `now` indicates the time the contract was deployed and deadline is time from `now` plus 2 minutes. You may change the deadline as you wish, and refer to [Time Units section](https://docs.soliditylang.org/en/v0.5.10/units-and-global-variables.html) to see available options and learn more.
```
uint256 public deadline = now + 2 minutes;
```

### Functions
Now as we have all necessary variables, we can start writing functions for depositing and withdrawing funds.

:small_blue_diamond: Deposit

Firstly, it is important to make sure that our contract accepts funds when deposit function is executed. Therefore, we need to make `deposit()` function *payable* and write `receive() external payable` function in addition. 
```
receive() external payable { deposit(); }
```
```
function deposit() public payable {}
```
After the contract is ready to receive funds and if user deposits ether, we need to increase the balance of the address by transaction value, which is the amount of ether sent. To accomplish this, it is useful to be familair with [global variables](https://docs.soliditylang.org/en/v0.5.10/units-and-global-variables.html), such as `msg.sender` (sender of the message or transaction) and `msg.value` (the amount of ether sent with the transaction). So, we add the following code to the function and use previously declared balance mapping.
```
function deposit() public payable {
    balance[msg.sender] += msg.value;
 }
```
In addition, our contract should become active if the threshold amount is already collected before the deadline, which means that we should have a condition for the contract to become active. Intuitively, the condition should be `now <= deadline && address(this).balance >= threshold`, because the current time must be less than deadline, i.e. we did not reach the deadline yet, and the balance of the contract must be more than threshold amount. You can refer to the contract as `address(this)` and to its balance as `address(this).balance`. Now the deposit() function looks as follows:
```
function deposit() public payable {
    balance[msg.sender] += msg.value;
    
    if (now <= deadline && address(this).balance >= threshold) {
      isActive = true;
    }
 }
```
Deploy the contract by `yarn deploy` and test this out!
![deposit](https://user-images.githubusercontent.com/45527668/105746904-3f69c300-5f6a-11eb-84b3-f8579d87ddf3.gif)

:small_blue_diamond: Withdraw

Initially, we should define conditions at which the user cannot make a withdrawal. In our app, conditions would be that the user cannot withdraw funds if the deadline hasn't passed yet or if the  contract is still active or if the user's deposited amount is zero. Setting limits or conditions in Solidity can be done by means of `require()` statements. If the condition is not met, then the whole transaction will revert and following lines of code will not be executed. Below you can find the implementation, which we add into the `withdraw()` function.
```
function withdraw() public{
    require(now > deadline, "deadline hasn't passed yet");
    require(isActive == false, "Contract is active");
    require(balance[msg.sender] > 0, "You haven't deposited");
}
```
As the next step we should transfer funds to the user if the withdrawal function is initiated and then set the balance of the sender as zero. The intuitive solution might be this:
```
msg.sender.transfer(balance[msg.sender]);
balance[msg.sender] = 0;
```
However, this is not a correct way of doing it! You might think, *why*? :confused:

The reason is that the line `msg.sender.transfer(balance[msg.sender]);` can be called multiple times recursively during the attack, so that it will never reach the line of setting the balance to 0. This is similar to what happened during the [DAO attack](https://www.coindesk.com/understanding-dao-hack-journalists). To avoid this, we first need to set the balance to 0, and only then transfer funds. Below you can see the updated code.
```
function withdraw() public{
    require(now > deadline, "deadline hasn't passed yet");
    require(isActive == false, "Contract is active");
    require(balance[msg.sender] > 0, "You haven't deposited");
    
    uint256 amount = balance[msg.sender];
    balance[msg.sender] = 0;
    msg.sender.transfer(amount);
}
```
Note that the transaction will revert if the deadline hasn't passed yet or if the contract became active!
![withdraw](https://user-images.githubusercontent.com/45527668/105747170-a4251d80-5f6a-11eb-87b1-004e6422fe28.gif)

Now we are able to make transactions using `deposit()` and `withdraw()` functions. However, it would be more useful to see the list of events for those functions. It is very easy to do it with  🏗 scaffold-eth! 

Firstly, we need to declare our events in the contract:
```
event Deposit(address sender, uint256 amount);
event Withdraw(address sender, uint256 amount);
```
So, our events will have the address of the sender and the amount sent with the transaction. Add the following code in `deposit()` function to emit/trigger the event:
```
emit Deposit(msg.sender, msg.value);
```
Also add similar code for `withdraw()` function:
```
emit Withdraw(msg.sender, amount);
```

## Editing the front end
Go to `packages/react-app/src` to edit your front-end! :smiley:
### Events
As the events are emitted, we should track them in the front-end.
Open `App.jsx` file and see the example of how `setPurposeEvents` are tracked. In the same way add the following code to track deposit and withdraw events:
```
const depositEvents = useEventListener(readContracts, "YourContract", "Deposit", localProvider, 1);
const withdrawEvents = useEventListener(readContracts, "YourContract", "Withdraw", localProvider, 1);
```
`readContracts` is already available in the file, so there is no need to add it. But you might need to know that this way we load the contract.
```
const readContracts = useContractLoader(localProvider)
```
Also you can read more about `useContractLoader()` and `useEventListener()` in `/hooks` section.

Notice that our front-end is already interacting with the smart contract! :collision:

Let's gather the front-end components of our app in a separate file `views/StakingApp.jsx`. 

As we have the events ready, we can display them as a list. Replace `dataSource={depositEvents}` with `dataSource={withdrawEvents}` and display withdraw events too.
Note that when displaying data of type `uint256` it might be necessary to format it with `formatEther()`. 
```
<List
  bordered
  dataSource={depositEvents}
  renderItem={(item) => {
      return (
      <List.Item>
          <Address
              value={item.sender}
              ensProvider={mainnetProvider}
              fontSize={16}
          /> =>
          {formatEther(item.amount)}
      </List.Item>
      )
  }}
/>
```

![events](https://user-images.githubusercontent.com/45527668/105752113-1436a200-5f71-11eb-817f-a710e8ad1b28.gif)


### UI components
So far we interacted with the contract through the default UI. Let's now make it better and learn more about scaffold-eth by using both ready components from `/components` section and using simple `<Button />`'s to initiate transactions.

:small_orange_diamond: EtherInput

We can use `<EtherInput />` component from `/components` that takes ether value as an input and sets it as `depositedAmount`. Very simple, has a better UI and converts between USD and ETH! That is a reason why it makes sense to use components within scaffold-eth environment.  
```
const [ depositAmount, setDepositAmount ] = useState("0");
```
```
<EtherInput
    autofocus
    price={price}
    placeholder="Enter amount..."
    onChange={value => {
      setDepositAmount(value.toString());
    }}
/>
```

:small_orange_diamond: Buttons

We are able to initiate a transaction through `tx()` and we can also send the value along with the transaction, which is the `depositedAmount`. So this is an example of how transactions with value are sent with button click.
```
<Button onClick={()=>{
        tx( writeContracts.YourContract.deposit({
        value: parseEther(depositAmount)
        })) 
    }}>
    Deposit
</Button>
```
![deposit_ui](https://user-images.githubusercontent.com/45527668/105751043-b05fa980-5f6f-11eb-8baf-3dee82232274.gif)

On the other hand, here is simpler example without the value, which is launching `withdraw()` function.
```
<Button onClick={()=>{
        tx( writeContracts.YourContract.withdraw())
    }}>
    Withdraw
</Button>
```
![withdraw_ui](https://user-images.githubusercontent.com/45527668/105751051-b2c20380-5f6f-11eb-8f59-1c7b567c2953.gif)

:small_orange_diamond: Accessing contract variables

I suppose we want to see the values of the deadline, threshold and activity status in the front-end, right? :smiley:
It is very easy to access contract variables by using `useContractReader()` hook. Look at the implementation below.
```
const isActive = useContractReader(readContracts,"YourContract", "isActive")
const threshold = useContractReader(readContracts,"YourContract", "threshold")
const timeLeft = useContractReader(readContracts,"YourContract", "timeLeft")
```
But wait... :confusing: why do we use `timeLeft` instead of `deadline`? For convenience! It is better to see how much time is left, rather than what is the deadline. Let's add it to our contract. Read more about `view` function [here](https://solidity-by-example.org/view-and-pure-functions/).
 ```
function timeLeft() public view returns (uint256) {
  if (now >= deadline) return 0;
  return deadline - now;
}
```
Formatting in the front-end is important, so display the variables as given below. 
```
threshold && formatEther(threshold)
timeLeft && timeLeft.toNumber()
isActive ? "ACTIVE" : "NOT ACTIVE"
```
![vars](https://user-images.githubusercontent.com/45527668/105752290-4b0cb800-5f71-11eb-8479-da03b022cdf8.gif)

## :triangular_flag_on_post:
Congratulations! :collision: Your staking-app is ready! 







