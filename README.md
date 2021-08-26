# 📚 Background Info

This scaffold-eth branch introduces a file upload component. 

Currently, there are two ways to get data uploaded to IPFS: 

1). Calling the 'addToIPFS' hook in a component in your app:
```bash
const addToIPFS = async fileToUpload => {
        for await (const result of ipfs.add(fileToUpload)) {
            return result
        }
    }
```
or
2). Using the manifest approach which is showcased in the buyer-mints-nft branch:
Here the developer edits the 'artwork.js' file and publishes it via the 'upload.js' script.
This script uses the smae 'addToIPFS' hook that is shown in option one, the difference is this script can do a batch deploy of all your files/artwork. 

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git image-upload-ipfs
cd image-upload-ipfs
git checkout image-upload-ipfs
```

> install and start your 👷‍ Hardhat chain:

```bash
cd image-upload-ipfs
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd image-upload-ipfs
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd image-upload-ipfs
yarn deploy
```
