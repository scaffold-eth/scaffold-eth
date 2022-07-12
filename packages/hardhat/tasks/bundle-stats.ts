import { task } from 'hardhat/config'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')
import axios from 'axios'
import { ethers } from 'ethers'

async function getBundleStats(admin: any, blockNumber: string, bundleHash: string) {
  console.log({bundleHash, blockNumber})
  const getBundleStatsBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'flashbots_getBundleStats',
    params: [
      {
        bundleHash, // String, returned by the flashbots api when calling eth_sendBundle
        blockNumber, // String, a hex encoded block number
      },
    ],
  }

  const bundleStatsSignature = admin.address + ':' + (await admin.signMessage(ethers.utils.id(JSON.stringify(getBundleStatsBody))))
  const bundleStats = await axios.post('https://relay.flashbots.net', getBundleStatsBody, {
    headers: { 'X-Flashbots-Signature': bundleStatsSignature, 'Content-Type': 'application/json' },
  })
  console.log({ bundleStats: bundleStats.data })

}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('bundle-stats', 'Flashbots stats')
    .addParam('bundleid', 'Bundle')
    .addParam('blocknumber', 'Block number')
    .setAction(async (taskArgs, hre) => {
        const accounts = await hre.ethers.getSigners()

        console.log({taskArgs})
        const blockNumber = parseInt(taskArgs.blocknumber)
        console.log({blockNumber})
        const hexBlock = blockNumber.toString(16)
        console.log({blockNumber, hexBlock})
        await getBundleStats(accounts[0], hexBlock, taskArgs.bundleid)
    })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
    solidity: '0.8.4',
}
