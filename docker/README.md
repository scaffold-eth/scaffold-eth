# 🏄‍♂️ Using Docker

Prerequisite: [Docker](https://docs.docker.com/engine/install/)/)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git
```

> [basic] run the script that sets the stack up and that's it (takes some minutes to finish):

```bash
cd scaffold-eth
./docker/setup.sh start
```

> [basic] to re-deploy your contracts (container must be up and running):

```bash
./docker/setup.sh deploy
```

> [advanced] running front-end on a different port (eg. 8080):

```bash
docker rm -f SCAFFOLD_ETH

docker run \
  --name SCAFFOLD_ETH \
  -v `pwd`:/opt/scaffold-eth \
  -w /opt/scaffold-eth \
  -e PORT=8080 \
  -p 8080:8080 \
  -p 8545:8545 \
  -dt node:16

./docker/setup.sh start
```

> [advanced] running the container in interactive mode (must run each tool manually):

```bash
docker rm -f SCAFFOLD_ETH

docker run \
  --name SCAFFOLD_ETH \
  -v `pwd`:/opt/scaffold-eth \
  -w /opt/scaffold-eth \
  -p 3000:3000 \
  -p 8545:8545 \
  --entrypoint /bin/bash \
  -ti node:16
```

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app
