# Etherscan

`hardhat-deploy` lets you easily verify contracts on Etherscan, and we have added a helper script to `/packages/hardhat` to let you do that. Simply run:

```text
cd packages/hardhat
yarn etherscan-verify --network <network_of_choice>
```

{% hint style="warning" %}
Make sure to change the script so it uses your own Etherscan API key for the `"etherscan-verify"` command in `packages/hardhat/package.json` 
{% endhint %}

And all hardhat's deployed contracts with matching ABIs for that network will be automatically verified. 

