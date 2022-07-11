import { task } from 'hardhat/config'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('bundle', 'Bundle transactions').setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners()

    const flashbotsProvider = await FlashbotsBundleProvider.create(hre.ethers.provider, accounts[0])

    const signedTransactions = [
      "0x02f872014d8459682f0085043e61dc8c8252089401b2f8877f3e8f366ef4d4f4823094912373389787038d7ea4c6800080c080a02e3230cf1da839f6d36f3eddcbc234f7fe8e95b313d86643466abaa00df0f3eca0254147467d1354961f2f8408674a07f728e5e399b12b7fae83fbb10b737f9b0e"
    ]
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    const simulation = await flashbotsProvider.simulate(signedTransactions, blockNumber + 1)
    if ('error' in simulation) {
        console.log(`Simulation Error: ${simulation.error.message}`)
    } else {
        console.log(`Simulation Success: ${blockNumber} ${JSON.stringify(simulation, null, 2)}`)
        console.log(signedTransactions)

        for (var i = 1; i <= 10; i++) {
            const bundleSubmission = flashbotsProvider.sendRawBundle(signedTransactions, blockNumber + i)
            console.log('submitted for block # ', blockNumber + i)
        }
        console.log('bundles submitted')
    }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
    solidity: '0.8.4',
}
