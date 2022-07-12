import { task } from 'hardhat/config'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')
import axios from 'axios'
import { ethers } from 'ethers'

async function getUserStats(admin: any, blockNumber: string) {
  const getUserStatsBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'flashbots_getBundleStats',
    params: [
      {
        blockNumber, // String, a hex encoded recent block number, in order to prevent replay attacks. Must be within 20 blocks of the current chain tip.
      },
    ],
  }
  const userStatsSignature = admin.address + ':' + (await admin.signMessage(ethers.utils.id(JSON.stringify(getUserStatsBody))))

  const userStats = await axios.post('https://relay.flashbots.net', getUserStatsBody, {
    headers: { 'X-Flashbots-Signature': userStatsSignature, 'Content-Type': 'application/json' },
  })

  console.log({ userStats: userStats.data })
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('searcher-stats', 'Flashbots stats').setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners()
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    
    const hexblock = blockNumber.toString(16)
    console.log({hexblock})

    await getUserStats(accounts[0], blockNumber.toString(16))
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
    solidity: '0.8.4',
}
