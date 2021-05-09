# 🏗 scaffold-eth - 🧑‍🎤 [eth.dev](https://eth.dev)

---

## 🏃‍♀️ Quick Start

```bash
# clone repository
git clone -b eth-dev https://github.com/austintgriffith/scaffold-eth.git eth-dev

cd eth-dev

# install dependencies
yarn install

# start app
yarn start

# > in a second terminal window:
# start local eth chain
yarn chain

# deploy contracts
yarn deploy
```

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

📱 Open http://localhost:3000 to see the app

## Development

The code structure now looks/works like this:

There are global game objects (some have actions which can be accessed and called from within all 'level' components):

- Terminal
- Wallet
- GameBackground [setBackground()]
- Dialog [setCurrentDialog(), setCurrentDialog()]
- Level [setCurrentLevel()]

There is a levels folder that will contain one folder for each game level/story
The content of these folders is structured in the following way:

- view/LevelContainerContent
  - the components and their logic are mapped into the global game screen
  - (in the underflow level the smart contract window goes here)
- view/TerminalContent
  - the components and their logic are mapped into the Terminal component
- view/WalletContent
  - the components and their logic are mapped into the Wallet component
- model/dialog
  - contains a json structure that defines the levels story flow (atm. mostly dialogs)
  - are aggregated in the global Dialog controller

### Deploy to surge

```bash
yarn build

yarn surge
```

## TODO's

- [store redux state in browser](https://github.com/grofers/redux-cookies-middleware)
- [force nice scrollbars in all browser](https://www.npmjs.com/package/perfect-scrollbar)
- [maybe use this](https://github.com/nextapps-de/winbox)
