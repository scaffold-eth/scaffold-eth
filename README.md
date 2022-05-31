# LoogieBoard Game

[LoogieBoard Game](https://board.fancyloogies.com)

![loogieboard](https://user-images.githubusercontent.com/466652/171219750-d6614daf-c71b-4ec0-acb0-cd663fbc6dca.png)

Forked from the Amsterdam Game from https://github.com/andrejrakic/scaffold-eth/tree/austins

Some changes to the Game contract:
- Register with a FancyLoogie
- Use LoogieCoin as Gold
- Drop Health or Gold when someone collect one of them

Added a subgraph to avoid event listeners:
- Now one subgraph entity represent each board field
- Another entity for each player


```bash
git clone https://github.com/scaffold-eth/scaffold-eth loogie-board
```

> install and start your 👷‍ Hardhat chain:

```bash
cd loogie-board
git checkout loogie-board
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd loogie-board
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd loogie-board
yarn deploy
```

🔏 Edit your smart contracts are in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app
