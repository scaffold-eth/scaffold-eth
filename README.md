# Grid Game

---

## quickstart

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git your-next-dapp

cd your-next-dapp
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

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📱 Open http://localhost:3000 to see the app

📚 Keep [solidity by example](https://solidity-by-example.org) handy and check out the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

> With everything up your app will look like this:

![image](https://user-images.githubusercontent.com/9419140/104850138-5568eb00-58bb-11eb-919b-6e20ec039069.png)

> Click on a square and select a color

![image](https://user-images.githubusercontent.com/9419140/104850079-f1462700-58ba-11eb-8488-e903f86b34dd.png)
![image](https://user-images.githubusercontent.com/9419140/104850164-7c272180-58bb-11eb-9d37-9997fbaef816.png)

> Grid is rendered and then updated from watching events on the blockchain

![image](https://user-images.githubusercontent.com/9419140/104850716-c067f100-58be-11eb-8d14-78013b919384.png)

> GridView Component contains all the logic and functions for the squares



