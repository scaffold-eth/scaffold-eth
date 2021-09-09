# Learning Solidity

📕 Read the docs: [https://docs.soliditylang.org](https://docs.soliditylang.org/)

📚 Go through each topic from [solidity by example](https://solidity-by-example.org/) editing `YourContract.sol` in **🏗 scaffold-eth**

* [Primitive Data Types](https://solidity-by-example.org/primitives/)
* [Mappings](https://solidity-by-example.org/mapping/)
* [Structs](https://solidity-by-example.org/structs/)
* [Modifiers](https://solidity-by-example.org/function-modifier/)
* [Events](https://solidity-by-example.org/events/)
* [Inheritance](https://solidity-by-example.org/inheritance/)
* [Payable](https://solidity-by-example.org/payable/)
* [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn all the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

👨‍🏫 Start super simple with a counter: `uint8 public count = 1;`

⬇️ Then a `function dec() public {}` that does a `count = count - 1;`

[![image](https://user-images.githubusercontent.com/2653167/93150263-dae25180-f6b5-11ea-94e1-b24ab2a63fa5.png)](https://user-images.githubusercontent.com/2653167/93150263-dae25180-f6b5-11ea-94e1-b24ab2a63fa5.png)

🔬 What happens when you subtract 1 from 0? Try it out in the app to see what happens!

[![underflow](https://user-images.githubusercontent.com/2653167/93688066-46466d80-fa80-11ea-85df-81fbafa46575.gif)](https://user-images.githubusercontent.com/2653167/93688066-46466d80-fa80-11ea-85df-81fbafa46575.gif)

🚽 UNDERFLOW!?! \(🚑 [Solidity &gt;0.8.0](https://docs.soliditylang.org/en/v0.8.0/) will catch this!\)

🧫 You can iterate and learn as you go. Test your assumptions!

🔐 Global variables like `msg.sender` and `msg.value` are cryptographically backed and can be used to make rules

📝 Keep this [cheat sheet](https://solidity.readthedocs.io/en/v0.7.0/cheatsheet.html?highlight=global#global-variables) handy

⏳ Maybe we could use `block.timestamp` or `block.number` to track time in our contract

🔏 Or maybe keep track of an `address public owner;` then make a rule like `require( msg.sender == owner );` for an important function

🧾 Maybe create a smart contract that keeps track of a `mapping ( address => uint256 ) public balance;`

🏦 It could be like a decentralized bank that you `function deposit() public payable {}` and `withdraw()`

📟 Events are really handy for signaling to the frontend. [Read more about events here.](https://solidity-by-example.org/0.6/events/)

📲 Spend some time in `App.jsx` in `packages/react-app/src` and learn about the 🛰 [Providers](https://github.com/austintgriffith/scaffold-eth#-web3-providers)

⚠️ Big numbers are stored as objects: `formatEther` and `parseEther` \(ethers.js\) will help with WEI-&gt;ETH and ETH-&gt;WEI.

🧳 The single page \(searchable\) [ethers.js docs](https://docs.ethers.io/v5/single-page/) are pretty great too.

🐜 The UI framework `Ant Design` has a [bunch of great components](https://ant.design/components/overview/).

📃 Check the console log for your app to see some extra output from hooks like `useContractReader` and `useEventListener`.

🏗 You'll notice the `<Contract />` component that displays the dynamic form as scaffolding for interacting with your contract.

🔲 Try making a `<Button/>` that calls `writeContracts.YourContract.setPurpose("👋 Hello World")` to explore how your UI might work...

💬 Wrap the call to `writeContracts` with a `tx()` helper that uses BlockNative's [Notify.js](https://www.blocknative.com/notify).

🧬 Next learn about [structs](https://solidity-by-example.org/0.6/structs/) in Solidity.

🗳 Maybe an make an array `YourStructName[] public proposals;` that could call be voted on with `function vote() public {}`

🔭 Your dev environment is perfect for _testing assumptions_ and learning by prototyping.

📝 Next learn about the [fallback function](https://solidity-by-example.org/0.6/fallback/)

💸 Maybe add a `receive() external payable {}` so your contract will accept ETH?

🚁 OH! Programming decentralized money! 😎 So rad!

