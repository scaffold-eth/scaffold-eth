# 🏗 Scaffold-ETH: The Merkler

# 🏄‍♂️ Quick Start

Prerequisites:
[Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone -b merkler https://github.com/austintgriffith/scaffold-eth.git merkler
```

Get a (free) [Pinata account](https://app.pinata.cloud/pinmanager), and create `.env` in `/packages/react-app`:

```
REACT_APP_PINATA_API_KEY=key_goes_here
REACT_APP_PINATA_SECRET=secret_goes_here
```

> install and start your forked 👷‍ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn fork
```

> in a second terminal window, start your 📱 frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```
