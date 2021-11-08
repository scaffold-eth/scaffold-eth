# Buidlguidl MultiSig Tx Activity Generator

```bash
git clone https://github.com/scaffold-eth/scaffold-eth buidl-guidl-reporting
cd buidl-guidl-reporting
git checkout buidl-guidl-reporting
yarn install
```

- add your rpc [here](https://github.com/scaffold-eth/scaffold-eth/blob/buidl-guidl/reporting/index.js#L8)

```bash
yarn dev
```

- visit endpoint http://localhost:8001/txActivity to test

## Get Logs
In `logs.js` set the url to your rpc endpoint and then run `yarn logs`. This will fetch the logs from all blocks that had a transaction that contained the multisig address, from the block where it was deployed up to the current block. The API only allows fetching a max of 10,000 blocks, so the requests will be made in batches.

The events that are parsed are the `FundStreams` and `Deposit` events, for now. If one of these events is found in a transaction, the result will be written to `transactions.json`. See `sample.json` for what the results will look like if running the script as is.
