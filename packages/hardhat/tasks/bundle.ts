import { task } from 'hardhat/config'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('bundle', 'Bundle transactions').setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners()

    const flashbotsProvider = await FlashbotsBundleProvider.create(hre.ethers.provider, accounts[0])

    const signedTransactions = [
        '0x02f873014d85174876e800852e90edd0008252089401b2f8877f3e8f366ef4d4f4823094912373389787038d7ea4c6800080c001a03496c05c970d51eb907e0a2ace76fa2b6ef387ed316b40022ee60962f2429292a04047941e7579ff0a1644f4ef4a1f59fbec7f221a0f0bd5c2caa4570b38f813d0',
        '0x02f873014e85174876e800852e90edd0008252089401b2f8877f3e8f366ef4d4f4823094912373389787038d7ea4c6800080c001a0f606606e975b65191633b51ae6edc3914a05f4d842e4c6f4c39a787ee53e5ea1a02dd24a0b332dc55dc9c0e9066a9fb6221ff0d07f60fb1c28f67d18dbec590bd8',
        '0x02f873014f85174876e800852e90edd0008252089401b2f8877f3e8f366ef4d4f4823094912373389787038d7ea4c6800080c080a0d4b81918f613c11fbd4015d20dbaf1176985477e94e4e2ca7473a47487029290a04054ef9a411adc367608ad6bfaff452384674379aed78f5b035781f0675a7f5a',
    ]

    const blockNumber = await hre.ethers.provider.getBlockNumber()
    const simulation = await flashbotsProvider.simulate(signedTransactions, blockNumber + 1)
    if ('error' in simulation) {
        console.log(`Simulation Error: ${simulation.error.message}`)
    } else {
    console.log(`Simulation Success: ${blockNumber} ${JSON.stringify(simulation, null, 2)}`)
    console.log(signedTransactions)

    for (var i = 1; i <= 10; i++) {
        const bundleSubmission = await flashbotsProvider.sendRawBundle(signedTransactions, blockNumber + i)
        console.log('submitted for block # ', blockNumber + i)
        console.log({ bundleSubmission, block: blockNumber + i })
    }
    console.log('bundles submitted')
    }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
    solidity: '0.8.4',
}
