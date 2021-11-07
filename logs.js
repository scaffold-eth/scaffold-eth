const fs = require("fs");
const ethers = require("ethers");
const simpleStream = require("./simple-stream-abi.json");
const streamFunder = require("./stream-funder-abi.json");

const multiSigDeploymentBlockNumber = 11028339;
const multiSigAddress = "0x97843608a00e2bbc75ab0c1911387e002565dede";
const simpleStreamInterface = new ethers.utils.Interface(simpleStream);
const streamFunderInterface = new ethers.utils.Interface(streamFunder);

const provider = new ethers.providers.JsonRpcProvider("Your RPC");

(async () => {
  const events = [];
  const blockNumber = await provider.getBlockNumber();

  // getLogs can only fetch 10000 blocks at a time
  const steps = Math.ceil(
    (blockNumber - multiSigDeploymentBlockNumber) / 10000
  );

  for (let i = 0; i < steps; i++) {
    let fromBlock = multiSigDeploymentBlockNumber + i * 10000;
    let toBlock = Math.min(fromBlock + 10000, blockNumber);

    const logs = await provider.getLogs({
      fromBlock,
      toBlock,
      address: multiSigAddress,
    });

    for (let j = 0; j < logs.length; j++) {
      const log = logs[j];
      const receipt = await provider.getTransactionReceipt(log.transactionHash);

      console.log(`parsing events for block ${receipt.blockNumber}`);

      receipt.logs.forEach((l) => {
        // There's other events in the logs, so wrap each parse in a try/catch in case it fails
        try {
          const parsed = simpleStreamInterface.parseLog(l);
          events.push({ blockNumber: receipt.blockNumber, ...parsed });
        } catch (error) {}

        try {
          const parsed = streamFunderInterface.parseLog(l);
          events.push({ blockNumber: receipt.blockNumber, ...parsed });
        } catch (error) {}
      });
    }

    fs.writeFileSync("transactions.json", JSON.stringify(events));
  }
  console.log(`Done! Parsed ${events.length} logs`);
})();
