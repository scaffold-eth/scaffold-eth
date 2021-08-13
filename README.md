# Burny Boy - 🏗 Scaffold-ETH

> getting funky with base fees

# 🏄‍♂️ Quick Start

> clone/fork 🏗 scaffold-eth:

```bash
git clone -b burny-boy https://github.com/austintgriffith/scaffold-eth.git burny-boy
```

> install and start your 👷‍ Hardhat chain:

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

Overview:

- Simple OZ ERC721
- Fully on-chain metadata generation, including SVG
- Each token has a "baseFee" associated, which impacts the SVG
- Simple beneficiary config (beneficiary can withdraw funds)
- Simple frontend

Contract configuration:

- limit
- cost to mint
- beneficiary address

TODO:

- Finalise the mechanism
- Spice up the SVG?
- Frontend jazz
