import { task } from 'hardhat/config'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('providertest', 'provider test').setAction(async (args, hre) => {
        const adminAbstract = new hre.ethers.Wallet(process.env.PRIVATE_KEY || '')
        console.log('admin')
        const provider = new hre.ethers.providers.JsonRpcProvider({ url: 'https://eth-mainnet.g.alchemy.com/v2/CXHh0sWzqEOkv_igQJPE_rNPL9oLknfN' })
        console.log('provider')
        const network = await provider.detectNetwork()
        console.log({network})
        const admin = await adminAbstract.connect(provider)
        console.log('admin connected')
    const accounts = await hre.ethers.getSigners()

})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
    solidity: '0.8.4',
}
