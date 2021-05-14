// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "3ccea23c26224daf802cf31e4699d15e";

//MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

//BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77"


// EXTERNAL CONTRACTS

export const SIMPLE_STREAM_ABI = [{"inputs":[{"internalType":"address payable","name":"_toAddress","type":"address"},{"internalType":"uint256","name":"_cap","type":"uint256"},{"internalType":"uint256","name":"_frequency","type":"uint256"},{"internalType":"bool","name":"_startsFull","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"frequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"last","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"streamBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"streamDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"reason","type":"string"}],"name":"streamWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"toAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]


export const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

export const DAI_ABI = [{"inputs":[{"internalType":"uint256","name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]



  export const BUILDS = [
    {
      name: "🎟 Simple NFT Example",
      desc: "Mint and display NFTs on Ethereum with a full example app...",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example",
      readMore: "",
      image: "simplenft.png"
    },
    {
      name: "👻 Lender",
      desc: "A component for depositing & borrowing assets on Aave",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/lender",
      readMore: "https://azfuller20.medium.com/lend-with-aave-v2-20bacceedade",
      image: "lender.png"
    },
    {
      name: "🐸 Chainlink 🎲 VRF 🎫 NFT",
      desc: "Use VRF to get a 🎲 random \"⚔️ strength\" for each NFT as it is minted...",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/chainlink-vrf-nft",
      readMore: "https://youtu.be/63sXEPIEh-k?t=1773",
      image: "randomimage.png"
    },
    {
      name: "⏳ Simple Stream",
      desc: "A simple ETH stream where the beneficiary reports work via links when they withdraw.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/simple-stream",
      readMore: "",
      image: "simplestream.png"
    },
    {
      name: "🎨 Nifty.ink",
      desc: "NFT artwork platform powered by meta transactions, burner wallets, sidechains, and bridged to Ethereum.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev",
      readMore: "https://nifty.ink",
      image: "niftyink.png"
    },
    {
      name: "🧑‍🎤 PunkWallet.io",
      desc: "A quick web wallet for demonstrating identity of keypairs and sending around ETH.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/punk-wallet",
      readMore: "https://punkwallet.io",
      image: "punkwallet.png"
    },
    {
      name: "👛 Streaming Meta Multi Sig",
      desc: "An off-chain signature based multi sig with streaming.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/streaming-meta-multi-sig",
      readMore: "https://bank.buidlguidl.com/streams",
      image: "smms.png"
    },
    {
      name: "🔴 Optimism Starter Pack",
      desc: "A 🏗 scaffold-eth dev stack for 🔴 Optimism",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/local-optimism",
      readMore: "https://azfuller20.medium.com/optimism-scaffold-eth-draft-b76d3e6849e8",
      image: "op.png"
    },
    {
      name: "⚖️ Uniswapper",
      desc: "A component for swapping erc20s on Uniswap (plus tokenlists + local forks of mainnet!)",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/uniswapper",
      readMore: "https://azfuller20.medium.com/swap-with-uniswap-wip-f15923349b3d",
      image: "uniswapper.png"
    },
    {
      name: "👨‍🎤 xNFT.io",
      desc: "A fork of 🎨 Nifty.ink with file uploads.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/xnft",
      image: "xnft.jpg"
    },
    {
      name: "👨‍👦 Minimal Proxy",
      desc: "A clever workaround where you can deploy the same contract thousands of times with minimal deployment costs",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/minimal_proxy",
      readMore: "",
      image: "proxy.png"
    },
    {
      name: "🍯 Honeypot",
      desc: "How you can catch hackers by putting bait into your \"vulnerable\" smart contract 🤭",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/honeypot-example",
      readMore: "",
      image: "honeypot.png"
    },
    {
      name: "😈 Denial of Service",
      desc: "Make contract unusable by exploiting external calls",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/denial-of-service-example",
      readMore: "",
      image: "dos.png"
    },
    {
      name: "⚡️ Aave Flash Loans Intro",
      desc: "Learn how to borrow any available amount of assets without putting up any collateral and build a simple arbitrage bot that would trade between Uniswap and Sushiswap pools.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/flash-loans-intro",
      readMore: "",
      image: "flash.png"
    },
    {
      name: "🧾 rTokens",
      desc: "tokens that represent redirected yield from lending",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens",
      readMore: "",
      image: "rokens.png"
    },
    {
      name: "🌱 radwallet.io",
      desc: "A simple web wallet to send around Rad tokens (ERC20 on mainnet).",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/radwallet",
      readMore: "https://radwallet.io",
      image: "radwallet.png"
    },

    {
      name: "🌐 GTGS Voice Gems",
      desc: "NFT \"shards\" collected from original \"Voice Gems\" for the Global Technology and Governance Summit.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/gtgs-voice-gems",
      readMore: "https://gtgs.io",
      image: "gtgs.png"
    },
    {
      name: "🐊 Token Allocator",
      desc: "Allocator.sol distributes tokens to addresses on a ratio defined by Governor.sol",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/new-allocator",
      readMore: "",
      image: "allocator.png"
    },
    {
      name: "💎 Diamond Standard exploration",
      desc: "Diamond standard in 🏗 scaffold-eth?",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/diamond-standard",
      readMore: "",
      image: "diamond.png"
    },
    {
      name: "🔮 Chainlink Example",
      desc: "oracles and vrf",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/chainlink-tutorial-1",
      readMore: "",
      image: "vrf.png"
    },
    {
      name: "🦍 Aave Ape",
      desc: "A helper contract that lets you go long on the Aave asset of your choice.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/aave-ape",
      readMore: "https://www.youtube.com/watch?v=4uAzju3efqY",
      image: "ape.png"
    },
    {
      name: "🔴 Optimism 🎟 NFTs ",
      desc: "A \"buyer mints\" NFT gallery running on Optimism",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/optimistic-nft-dev-session",
      readMore: "",
      image: "opnfts.png"
    },
    {
      name: "🎫 Nifty Viewer",
      desc: "A forkable nft gallery with transfer functionality and burner wallets.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/nifty-viewer",
      readMore: "",
      image: "niftyview.png"
    },
    {
      name: "🏷 NFT Auction",
      desc: "Discover how you can build your own NFT auction where the highest bid gets an NFT!",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/nft-auction",
      readMore: "",
      image: "highestbid.png"
    },
    {
      name: "🌲 Merkle Mint NFTs",
      desc: "Use a Merkle tree of possible artworks and then submit a proof it is valid to mint.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints",
      readMore: "",
      image: "merklenft.png"
    },
    {
      name: "🎲 Push The Button",
      desc: "A base template for multiplayer turn-based game on Ethereum",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/push-the-button-dev",
      readMore: "",
      image: "push.png"
    },
    {
      name: "💵 Meta-Multi Signature Wallet",
      desc: "Ann off-chain signature based multi sig wallet",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig",
      readMore: "",
      image: "metamultisig.png"
    }
    /*
    {
      name: "",
      desc: "",
      branch: "",
      readMore: "",
      image: ""
    }*/
  ]





//--------------------------------------------------------------------------------------------------------------------------------------------




const placeholderStream = "0x79Eeda2a3cdB90129A3Dc851556AeaF25DdF1E39"


export const BUILDERS = [
  {
    name: "ironsoul.eth",
    role: "React + Solidity",
    address: "0x1e2Ce012b27d0c0d3e717e943EF6e62717CEc4ea",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=ironsoul0",
    builds: [ "xnft", "honeypot", "dos", "flash", "highestbid", "merklenft"],
    streamAddress: placeholderStream,
  },
  {
    name: "viraz.eth",
    role: "Solidity + React",
    address: "0x2DdA8dc2f67f1eB94b250CaEFAc9De16f70c5A51",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=viraj124",
    builds: [ "xnft", "proxy", "diamond", "highestbid", "merklenft"],
    streamAddress: placeholderStream,
  },
  {
    name: "sadda11asm.eth",
    role: "Solidity + React",
    address: "0x7b945ffE9725D8e05343bEC36c0eced294097f78",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=ironsoul0",
    builds: [ "xnft", "rokens", "highestbid", "merklenft"],
    streamAddress: placeholderStream,
  },
  {
    name: "amogh.eth",
    role: "Solidity + React",
    address: "0x1245e96fe32b43ddec930d662b5d20239282b876",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=amogh-jrules",
    builds: ["smms", "push", "metamultisig"],
    streamAddress: placeholderStream,
  },
  {
    name: "calvinquin.argent.xyz",
    role: "Solidity + React",
    address: "0x614Ae4C6Eb91cEC9e6e178549c0745A827212B24",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=calvbore",
    builds: [],
    streamAddress: placeholderStream,
  },

  {
    name: "ssteiger.eth",
    role: "React",
    address: "0x4ceb8dc70813ffbb2d8d6dc0755086698f977613",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=ssteiger",
    builds: [
      "ethdev",
    ],
    streamAddress: placeholderStream,
  },
  {
    name: "rawcipher.eth",
    role: "Community Support",
    address: "0xa4ca1b15fe81f57cb2d3f686c7b13309906cd37b",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=codenamejason",
    builds: [ "vrf" ],
    streamAddress: placeholderStream,
  },
  {
    name: "mrdee.eth",
    role: "Artwork",
    address: "0xd2f016809969b4105978fdd5b112cd95bfdd6814",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=azf20",
    builds: [],
    streamAddress: placeholderStream,
  },
  {
    name: "hunterchang.eth",
    role: "React",
    address: "0x55fFbCD5F80a7e22660A3B564447a0c1D5396A5C",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=azf20",
    builds: [ "xnft", ],
    streamAddress: placeholderStream,
  },

  {
    name: "adamfuller.eth",
    role: "Solidity + React",
    address: "0x60Ca282757BA67f3aDbF21F3ba2eBe4Ab3eb01fc",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=azf20",
    builds: [
      "niftyink", "uniswapper", "lender", "ape", "op",
    ],
    streamAddress: "0x79Eeda2a3cdB90129A3Dc851556AeaF25DdF1E39",
  },

  {
    name: "austingriffith.eth",
    role: "Mentor",
    address: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=austintgriffith",
    builds: [
      "niftyink", "simplestream", "niftyview", "opnfts", "smms", "allocator", "radwallet", "punkwallet", "simplenft", "randomimage", "gtgs"
    ]
  },

]
























export const NETWORK = (chainId)=>{
  for(let n in NETWORKS){
    if(NETWORKS[n].chainId==chainId){
      return NETWORKS[n]
    }
  }
}

export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: '#666666',
        chainId: 31337,
        blockExplorer: '',
        rpcUrl: "http://" + window.location.hostname + ":8545",
    },
    mainnet: {
        name: "mainnet",
        color: '#ff8b9e',
        chainId: 1,
        rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        blockExplorer: "https://etherscan.io/",
    },
    kovan: {
        name: "kovan",
        color: '#7003DD',
        chainId: 42,
        rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
        blockExplorer: "https://kovan.etherscan.io/",
        faucet: "https://gitter.im/kovan-testnet/faucet",//https://faucet.kovan.network/
    },
    rinkeby: {
        name: "rinkeby",
        color: '#e0d068',
        chainId: 4,
        rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
        faucet: "https://faucet.rinkeby.io/",
        blockExplorer: "https://rinkeby.etherscan.io/",
    },
    ropsten: {
        name: "ropsten",
        color: '#F60D09',
        chainId: 3,
        faucet: "https://faucet.ropsten.be/",
        blockExplorer: "https://ropsten.etherscan.io/",
        rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    },
    goerli: {
        name: "goerli",
        color: '#0975F6',
        chainId: 5,
        faucet: "https://goerli-faucet.slock.it/",
        blockExplorer: "https://goerli.etherscan.io/",
        rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    },
    xdai: {
        name: "xdai",
        color: '#48a9a6',
        chainId: 100,
        price: 1,
        gasPrice:1000000000,
        rpcUrl: "https://dai.poa.network",
        faucet: "https://xdai-faucet.top/",
        blockExplorer: "https://blockscout.com/poa/xdai/",
    },
    matic: {
        name: "matic",
        color: '#2bbdf7',
        chainId: 137,
        price: 1,
        gasPrice:1000000000,
        rpcUrl: "https://rpc-mainnet.maticvigil.com",
        faucet: "https://faucet.matic.network/",
        blockExplorer: "https://explorer-mainnet.maticvigil.com//",
    },
    mumbai: {
        name: "mumbai",
        color: '#92D9FA',
        chainId: 80001,
        price: 1,
        gasPrice:1000000000,
        rpcUrl: "https://rpc-mumbai.maticvigil.com",
        faucet: "https://faucet.matic.network/",
        blockExplorer: "https://mumbai-explorer.matic.today/",
    }
}
