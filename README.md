# 🏗 IPFS Upload with new Authentication requirements

This scaffold-eth branch expands upon the image-upload-ipfs branch, utilizing Infura and adding the newly required Infura authentication credentials for IPFS.



# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git ipfs-auth
```

> install and start your 👷‍ Hardhat chain:

```bash
cd ipfs-auth
git checkout ipfs-auth
yarn install
```

> You'll need three terminals open for:

```bash
yarn chain   (hardhat backend)
yarn start   (react app frontend)
yarn deploy  (to compile, deploy, and publish your contracts to the frontend)
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```

# Accessing IPFS with Infura

We're going to be using the ipfs-http-client method, you can see this and other options at [Infura](https://docs.infura.io/infura/networks/ipfs/how-to/make-requests). The code uses a .env file to protect yourself from uploading your Infura keys to your git repo. THIS DOES NOT PROTECT YOUR KEYS WHEN YOUR APP IS DEPLOYED PUBLICLY!!!

```
const ipfsClient = require('ipfs-http-client');

const { REACT_APP_INFURA_ID, REACT_APP_INFURA_SECRET } = process.env;
const projectId = REACT_APP_INFURA_ID;
const projectSecret = REACT_APP_INFURA_SECRET;

const auth =
    'Basic ' + btoa(projectId + ':' + projectSecret);

const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
```
# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)
