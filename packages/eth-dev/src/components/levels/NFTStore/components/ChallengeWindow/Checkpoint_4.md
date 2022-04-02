# Checkpoint 4: 🚢 Ship it! 🚁

> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to `NETWORKS.rinkeby`:

![image](https://user-images.githubusercontent.com/2653167/142491593-a032ebf2-38c7-4d1c-a4c5-5e02485e21b4.png)

You should see the correct network in the frontend (http://localhost:3000):

![nft10](https://user-images.githubusercontent.com/526558/124387099-9a3edd80-dcb3-11eb-9a57-54a7d370589a.png)

🎫 Ready to mint a batch of NFTs for reals?  Use the `MINT NFT` button.

![MintNFT2](https://user-images.githubusercontent.com/12072395/145692572-d61c971d-7452-4218-9c66-d675bb78a9dc.PNG)

📦 Build your frontend:

```sh
yarn build
```

💽 Upload your app to surge:
```sh
yarn surge
```
(You could also `yarn s3` or maybe even `yarn ipfs`?)

> 😬 Windows users beware!  You may have to change the surge code in `packages/react-app/package.json` to just `"surge": "surge ./build",`

⚙ If you get a permissions error `yarn surge` again until you get a unique URL, or customize it in the command line.

⚠️ Run the automated testing function to make sure your app passes

```sh
yarn test
```

![testOutput](https://user-images.githubusercontent.com/12072395/152587433-8314f0f1-5612-44ae-bedb-4b3292976a9f.PNG)
<br/>
<br/>
