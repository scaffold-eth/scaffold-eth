# 🏗 Scaffold-ETH - 🎟 Offchain Dynamic NFT Generation

> Deploy your own dynamic ERC721!

While dApps on Ethereum have grown in complexity, depth, and breadth in the past few years. One missing piece is the efficient querying of blockchain information in real-time.

Users need to know immediately when their trades execute, when their transactions fail, when their auction bid has been accepted, or when a wallet of interest has aped into some new token. Without these notifications, trades can be missed, critical actions are forgotten, and ultimately users end up abandoning your dApp. Unfortunately, building these real-time notifications into your dApp has traditionally been complicated, time-consuming, and error-prone. But now with Alchemy Notify, sending real-time push notifications to your users for critical events such as dropped transactions, mined transactions, wallet activity, and even gas price changes is straightforward, easy, and dependable.

In this tutorial, we’ll look at an example of how, with just a few lines of code, you can build a Dynamic NFT with the 🔋 power of Alchemy Notify.

***
For ease of user experience, this particular tutorial to run on Heroku, but you are more than welcome to use other service providers!  There is no frontend for this app since we only use Scaffold-Eth to deploy our contract!
***

### Problem Statement: ###

Dynamic NFTs are all the rage... but they're had to make on-chain, cost a lot of money, and are constrained to on-chain parameters.  How, can we use on-chain info but store our image elsewhere?

For this example, we build a dynamic NFT that adds addresses that "tip it" to a dynamic wordcloud.  Note this is a simple example but can be made much more complicated like using addresses as a random hash to morph a NFT!

Wanting to create a dynamic off-chain NFT that adjusts it's image based on chain interactions, we specifically use Alchemy's Enhanced API method (particularly Alchemy Notify) specifically to get the Address Activity notifications.  This lets us hook onto any transactions that interact with our target address and allows us to inject that info into our SVG generation. To generatively create our NFT, we use the python package `wordcloud` to create a wordcloud of all the addresses that have interacted with our NFT.  

To summarize, our Heroku server is configured to accept address notifications, add addresses to our wordcloud, and return an updated NFT SVG based on on-chain interacions!

# 🏃‍♀️ Quick Start
Required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) and [Git](https://git-scm.com/downloads)

```
git clone https://github.com/austintgriffith/scaffold-eth.git offchain_dynamic_nft
```
```
cd offchain_dynamic_nft
git checkout offchain_dynamic_nft
yarn install
yarn start
```

> in a second terminal window, start your 📱 frontend:

```
cd offchain_dynamic_nft
yarn chain
```

> in a third terminal window

```
cd offchain_dynamic_nft
```
📱 Open http://localhost:3000 to see the app (Note, we won't be using the frontend much here, but feel free to add to it!)

⛽️ Grab some gas for each account using the faucet https://faucet.rinkeby.io/.  In this fork, we use Alchemy as node provider and as a powerful blockchain data on-ramp so that we can access blockchain info and morph our wordcloud!  As a result, we will need to deploy on a testnet.  

# 📡 Deploy NFT smart contract!

> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

![nft6](https://user-images.githubusercontent.com/526558/124387061-7a0f1e80-dcb3-11eb-9f4c-19229f43adec.png)

🔐 Generate a deploy account with `yarn generate`

![nft7](https://user-images.githubusercontent.com/526558/124387064-7d0a0f00-dcb3-11eb-9d0c-195f93547fb9.png)

👛 View your deployer address using `yarn account` (You'll need to fund this account. Hint: use an instant wallet to fund your account via QR code)

![nft8](https://user-images.githubusercontent.com/526558/124387068-8004ff80-dcb3-11eb-9d0f-43fba2b3b791.png)

👨‍🎤 Deploy your NFT smart contract (in that 3rd terminal window):
```
yarn deploy
```
> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to wherever you deployed your contract:

![nft9](https://user-images.githubusercontent.com/526558/124387095-9743ed00-dcb3-11eb-8ea5-afc25d7fef80.png)

You should see the correct network in the frontend:

![nft10](https://user-images.githubusercontent.com/526558/124387099-9a3edd80-dcb3-11eb-9a57-54a7d370589a.png)


Make sure your target network is present in the hardhat networks config, then either update the default network in `hardhat.config.js` to your network of choice or run: (Make sure you use a public testnet for this tutorial!)
```
yarn deploy --network NETWORK_OF_CHOICE
```

### 🔶 Alchemy! ###
You will need to get a key from [alchemy.io](https://alchemyapi.io/) and paste it into `constants.js` in `packages/react-app/src`

NOTE: When you copy your key from the dashboard you should get a full url like this: https://eth-mainnet.alchemyapi.io/v2/kXtBl52Cr0hNbOn0rI2up7lhUiGk_2eS, your key is just the last portion in the URL:kXtBl52Cr0hNbOn0rI2up7lhUiGk_2eS

Once you have confirmed that you can `yarn deploy`, follow the next steps to get up and running with Heroku!

### 🚀 Launching with Heroku ###

 1. Get the repo!

      * `https://github.com/pileofscraps/wordcloud_backend.git`

For all Heroku dependent documentation, refer to:
https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true
for more detailed instructions.  The Heroku instructions included below are abridged.

 2. Install Heroku-CLI and verify/install dependencies.

      * Download Heroku-CLI based on your OS [https://devcenter.heroku.com/articles/heroku-cli]
      * After installation, open your terminal and run `heroku login`; follow the commands that follow to login to your Heroku account.  If you don't have a Heroku account, you can [sign up for one](https://dashboard.heroku.com/apps)!
      * Run `node --version`.  You may have any version of Node greater than 10.  If you don’t have it or have an older version, install a more recent version of Node.
      * Run `npm --version`.  `npm` is installed with Node, so check that it’s there. If you don’t have it, install a more recent version of Node:
      * Run `git --version`   Check to make sure you have git installed.  

 3. Initiate Heroku.

      * Run `heroku create` to create your heroku app. Take note of the info that pops up in the terminal, especially the URL that looks like  http://xxxxxxxxx.herokuapp.com/ That's the URL for your tokenURI and your server!

 4. Set-Up Alchemy Account!

     * If you don’t already have an Alchemy account, [you’ll first need to create one](https://alchemy.com/?r=affiliate:ba2189be-b27d-4ce9-9d52-78ce131fdc2d). The free version will work fine for getting started.  First, create our example notification by clicking “Create Webhook” on Address Activity.


     ![webhook_1](https://github.com/pileofscraps/alchemy_notify/blob/master/webhook_1.jpg)

    * Taking note from the information that followed the `heroku create` command, copy and paste in the http://xxxxxxxxx.herokuapp.com/alchemyhook URL into the webhook entry box.  Select an app from the dropdown menu.  

    * (Make sure the app selected is on the Ethereum network you want to test on; if you're testing on Rinkeby, select an app configured to it!)

    * Add in the target address that you want to monitor!  In this example, we log and update our wordcloud with any addresses that send Rinkeby ETH to our address. AKA THIS IS OUR TIP ADDRESS! Don't forget this step!

    * Click “Create Webhook” and we’re done!

    ![webhook_2](https://github.com/pileofscraps/alchemy_notify/blob/master/webhook_2.jpg)

    * For more info about Alchemy Notify, [check it out] (https://docs.alchemy.com/alchemy/documentation/apis/enhanced-apis/notify-api)!

 5. Deploy Heroku.

      * Run `git add .`
      * Run `git commit -m "added Alchemy keys"`
      * Run `git push heroku master` to push and deploy your heroku app.

IMPORTANT: In YourCollectible.sol, replace the default Heroku link with the http://xxxxxxxxx.herokuapp.com/alchemyhook URLthat you generated with your setup process.  Make sure it goes into the Constructor and the Mint function!  Likewise, change the toAddress to an address that you own!

With all that done, go to terminal window where you previously ran `yarn deploy` to redeploy the contract once more with your own custom Heroku URL and your TIP ADDRESS!

Now go to [Testnet OpenSea](https://testnets.opensea.io/), and log in via your MetaMask configured for Rinkeby. Send your TIP ADDRESSS which you defined earlier and watch the NFT change!  Make sure to hit the "REFRESH" button underneath the Sell icon and refresh your entire webpage.  It may take a few attempts to get the NFT SVG to refresh!

NOTE: Heroku will automatically sleep apps after a set period of time so you will need to make sure you app is up and awake for onchain activity to be recognized!  

  ![open_sea_img](snapshot.PNG)

🎉 Congratulations on your dApp deployment! Feel free to edit this NFT, change its behavior, or make the backend more robust!

```
------------

# 🔭 Learning Solidity

For a more in-depth explanation, documentation, quick start guide, tutorials, tips and many more resources, visit our documentation site: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
