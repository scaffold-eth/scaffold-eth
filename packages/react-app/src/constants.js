// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "3ccea23c26224daf802cf31e4699d15e";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";

// EXTERNAL CONTRACTS

//------ added by save script:
export const mainStreamReader_ADDRESS = "0x710644C199549925E065a551b51B848d8725Bd0A";

export const mainStreamReader_ABI = [
  {
    inputs: [{ internalType: "address[]", name: "streams", type: "address[]" }],
    name: "readStreams",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
];

export const mainStreamReader_BYTECODE =
  "0x608060405234801561001057600080fd5b506103b5806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063a2dd56ca14610030575b600080fd5b6100d36004803603602081101561004657600080fd5b81019060208101813564010000000081111561006157600080fd5b82018360208201111561007357600080fd5b8035906020019184602083028401116401000000008311171561009557600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610123945050505050565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561010f5781810151838201526020016100f7565b505050509050019250505060405180910390f35b60606000825160040267ffffffffffffffff8111801561014257600080fd5b5060405190808252806020026020018201604052801561016c578160200160208202803683370190505b50905060005b83518160ff161015610378576000848260ff168151811061018f57fe5b60200260200101519050806001600160a01b031663355274ea6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101d257600080fd5b505afa1580156101e6573d6000803e3d6000fd5b505050506040513d60208110156101fc57600080fd5b50518351849060ff600486021690811061021257fe5b602002602001018181525050806001600160a01b031663ead50da36040518163ffffffff1660e01b815260040160206040518083038186803b15801561025757600080fd5b505afa15801561026b573d6000803e3d6000fd5b505050506040513d602081101561028157600080fd5b50518351849060ff600160048702011690811061029a57fe5b602002602001018181525050806001600160a01b031663c3ae1e596040518163ffffffff1660e01b815260040160206040518083038186803b1580156102df57600080fd5b505afa1580156102f3573d6000803e3d6000fd5b505050506040513d602081101561030957600080fd5b50518351849060ff600260048702011690811061032257fe5b602002602001018181525050848260ff168151811061033d57fe5b60200260200101516001600160a01b031631838360040260030160ff168151811061036457fe5b602090810291909101015250600101610172565b509291505056fea264697066735822122067e7dc07f621168ef11fadbf0eaa64166f656ecaaa2a8b492bb201804eeb98f064736f6c63430007060033";

export const SIMPLE_STREAM_ABI = [
  {
    inputs: [
      { internalType: "address payable", name: "_toAddress", type: "address" },
      { internalType: "uint256", name: "_cap", type: "uint256" },
      { internalType: "uint256", name: "_frequency", type: "uint256" },
      { internalType: "bool", name: "_startsFull", type: "bool" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "cap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "frequency",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "last",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "streamBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "reason", type: "string" }],
    name: "streamDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    name: "streamWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "toAddress",
    outputs: [{ internalType: "address payable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

export const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const DAI_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "chainId_", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "guy", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, internalType: "bytes4", name: "sig", type: "bytes4" },
      { indexed: true, internalType: "address", name: "usr", type: "address" },
      { indexed: true, internalType: "bytes32", name: "arg1", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "arg2", type: "bytes32" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "LogNote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "dst", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "deny",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "move",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "expiry", type: "uint256" },
      { internalType: "bool", name: "allowed", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "pull",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "push",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "rely",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "wards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const BUILDS = [
  {
    name: "🎟 Simple NFT Example",
    desc: "Mint and display NFTs on Ethereum with a full example app...",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/simple-nft-example",
    readMore: "",
    image: "simplenft.png",
  },
  {
    name: "🧾 Minimum Viable Payment Channel",
    desc: "Make micro payments in ETH with signatures over a open session",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/payment-channel",
    readMore: "",
    image: "paymentchannel.png",
  },
  {
    name: "📈 Bonding Curve",
    desc: "Learn about bonding curves and play around with the 😃 bonding curve token",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/bonding-curve",
    readMore: "",
    image: "bondingcurve.png",
  },
  {
    name: "🏷 ✍️ NFT Signature Based Auction",
    desc: "Discover how you can build your own NFT auction where the bids go off-chain!",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/signature-nft-auction",
    readMore: "",
    image: "highestbid.png",
  },
  {
    name: "👻 Lender",
    desc: "A component for depositing & borrowing assets on Aave",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/lender",
    readMore: "https://azfuller20.medium.com/lend-with-aave-v2-20bacceedade",
    image: "lender.png",
  },
  {
    name: "🐸 Chainlink 🎲 VRF 🎫 NFT",
    desc: 'Use VRF to get a 🎲 random "⚔️ strength" for each NFT as it is minted...',
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/chainlink-vrf-nft",
    readMore: "https://youtu.be/63sXEPIEh-k?t=1773",
    image: "randomimage.png",
  },
  {
    name: "💵 Meta-Multi-Sig Wallet",
    desc: "An off-chain signature-based multi-sig wallet",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/meta-multi-sig",
    readMore: "",
    image: "metamultisig.png",
  },
  {
    name: "🎨 Nifty.ink",
    desc: "NFT artwork platform powered by meta transactions, burner wallets, sidechains, and bridged to Ethereum.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/nifty-ink-dev",
    readMore: "https://nifty.ink",
    image: "niftyink.png",
  },
  {
    name: "⏳ Simple Stream",
    desc: "A simple ETH stream where the beneficiary reports work via links when they withdraw.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/simple-stream",
    readMore: "",
    image: "simplestream.png",
  },
  {
    name: "🧑‍🎤 PunkWallet.io",
    desc: "A quick web wallet for demonstrating identity of keypairs and sending around ETH.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/punk-wallet",
    readMore: "https://punkwallet.io",
    image: "punkwallet.png",
  },
  {
    name: "👛 Streaming Meta Multi Sig",
    desc: "An off-chain signature based multi sig with streaming.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/streaming-meta-multi-sig",
    readMore: "https://bank.buidlguidl.com/streams",
    image: "smms.png",
  },
  {
    name: "🔴 Optimism Starter Pack",
    desc: "A 🏗 scaffold-eth dev stack for 🔴 Optimism",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/local-optimism",
    readMore: "https://azfuller20.medium.com/optimism-scaffold-eth-draft-b76d3e6849e8",
    image: "op.png",
  },
  {
    name: "⚖️ Uniswapper",
    desc: "A component for swapping erc20s on Uniswap (plus tokenlists + local forks of mainnet!)",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/uniswapper",
    readMore: "https://azfuller20.medium.com/swap-with-uniswap-wip-f15923349b3d",
    image: "uniswapper.png",
  },
  {
    name: "👨‍🎤 xNFT.io",
    desc: "A fork of 🎨 Nifty.ink with file uploads.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/xnft",
    image: "xnft.jpg",
  },
  {
    name: "👨‍👦 Minimal Proxy",
    desc: "A clever workaround where you can deploy the same contract thousands of times with minimal deployment costs",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/minimal_proxy",
    readMore: "",
    image: "proxy.png",
  },
  {
    name: "🍯 Honeypot",
    desc: 'How you can catch hackers by putting bait into your "vulnerable" smart contract 🤭',
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/honeypot-example",
    readMore: "",
    image: "honeypot.png",
  },
  {
    name: "😈 Denial of Service",
    desc: "Make contract unusable by exploiting external calls",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/denial-of-service-example",
    readMore: "",
    image: "dos.png",
  },
  {
    name: "⚡️ Aave Flash Loans Intro",
    desc: "Learn how to borrow any available amount of assets without putting up any collateral and build a simple arbitrage bot that would trade between Uniswap and Sushiswap pools.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/flash-loans-intro",
    readMore: "",
    image: "flash.png",
  },
  {
    name: "🧾 rTokens",
    desc: "tokens that represent redirected yield from lending",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/defi-rtokens",
    readMore: "",
    image: "rokens.png",
  },
  {
    name: "🌱 radwallet.io",
    desc: "A simple web wallet to send around Rad tokens (ERC20 on mainnet).",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/radwallet",
    readMore: "https://radwallet.io",
    image: "radwallet.png",
  },

  {
    name: "🌐 GTGS Voice Gems",
    desc: 'NFT "shards" collected from original "Voice Gems" for the Global Technology and Governance Summit.',
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/gtgs-voice-gems",
    readMore: "https://gtgs.io",
    image: "gtgs.png",
  },
  {
    name: "🐊 Token Allocator",
    desc: "Allocator.sol distributes tokens to addresses on a ratio defined by Governor.sol",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/new-allocator",
    readMore: "",
    image: "allocator.png",
  },
  {
    name: "💎 Diamond Standard exploration",
    desc: "Diamond standard in 🏗 scaffold-eth?",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/diamond-standard",
    readMore: "",
    image: "diamond.png",
  },
  {
    name: "🔮 Chainlink Example",
    desc: "oracles and vrf",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/chainlink-tutorial-1",
    readMore: "",
    image: "vrf.png",
  },
  {
    name: "🦍 Aave Ape",
    desc: "A helper contract that lets you go long on the Aave asset of your choice.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/aave-ape",
    readMore: "https://www.youtube.com/watch?v=4uAzju3efqY",
    image: "ape.png",
  },
  {
    name: "🔴 Optimism 🎟 NFTs ",
    desc: 'A "buyer mints" NFT gallery running on Optimism',
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/optimistic-nft-dev-session",
    readMore: "",
    image: "opnfts.png",
  },
  {
    name: "🎫 Nifty Viewer",
    desc: "A forkable nft gallery with transfer functionality and burner wallets.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/nifty-viewer",
    readMore: "",
    image: "niftyview.png",
  },

  {
    name: "✍️ Signator.io",
    desc: "Sign a message with an Ethereum account & generate shareable proof-of-signature links.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/signatorio",
    readMore: "http://signator.io",
    image: "signatorio.png",
  },
  {
    name: "💰 Emoji Support",
    desc: "Funding round that uses quadratic matching (capital-constrained liberal radicalism).",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/emoji-support",
    readMore: "http://emoji.support",
    image: "emojisupport.png",
  },
  {
    name: "🏷 NFT Auction",
    desc: "Discover how you can build your own NFT auction where the highest bid gets an NFT!",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/nft-auction",
    readMore: "",
    image: "highestbid.png",
  },
  {
    name: "🌲 Merkle Mint NFTs",
    desc: "Use a Merkle tree of possible artworks and then submit a proof it is valid to mint.",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/merkle-root-buyer-mints",
    readMore: "",
    image: "merklenft.png",
  },
  {
    name: "🎲 Push The Button",
    desc: "A base template for multiplayer turn-based game on Ethereum",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/push-the-button-dev",
    readMore: "",
    image: "push.png",
  },
  {
    name: "🖼 Rarible Protocol Starter App",
    desc: "Mint, Lazy Mint, Buy, and Sell NFTs using the Rarible Protocol and Marketplace",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/rarible-starter-app",
    readMore: "https://docs.rarible.com/starter-app",
    image: "rarible.png",
  },
  {
    name: "🏭 Proxy Factory - EIP-1167 w/ OpenZeppelin",
    desc: "Use the EIP-1667 w/ OpenZeppelin Proxy Factory pattern to deploy low-gas contract instances",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/proxy-factory",
    readMore: "https://eips.ethereum.org/EIPS/eip-1167",
    image: "proxy.png",
  },
  {
    name: "🔓 Sign in with Ethereum - Serverless JWT Authentication",
    desc: "Authenticate your serverless back end with Ethereum based login and JWT tokens",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/serverless-auth/packages/react-app",
    readMore: "",
    image: "serverlessauth.png",
  },
  {
    name: "🔥 Burny Boys",
    desc: "Dynamic Basefee NFTs, live on Ethereum",
    branch: "https://github.com/scaffold-eth/scaffold-eth/tree/burny-boy",
    readMore: "https://burnyboys.com",
    image: "burnyBoys.png",
  },

  /*
    {
      name: "",
      desc: "",
      branch: "",
      readMore: "",
      image: ""
    }*/
];

//--------------------------------------------------------------------------------------------------------------------------------------------

/*
{
 name: ".eth",
 role: "",
 address: "",
 github: "",
 builds: [ ],
 streamAddress: "",
 streamUrl: "http://.buidlguidl.com"
},


*/


export const BUILDERS = [
  {
   name: "bboyle.eth",
   role: "",
   address: "0xdfcbf02520fdde9d8c46cc44dadcfc798029e5b4",
   github: "",
   builds: [ ],
   streamAddress: "0x684653eF9231e6142446053E4766027e6c6aAb15",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://bboyle.buidlguidl.com"
  },
  {
   name: "frogbaseball.eth",
   role: "",
   address: "0x38f84e92b468a1885e73cedc9a4d5632de07eabb",
   github: "",
   builds: [ ],
   streamAddress: "0x664C54cF70797a69f82A4991Ea1Be343a03334e8",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://frogbaseball.buidlguidl.com"
  },
  {
   name: "kijun.eth",
   role: "",
   address: "0x03d8DF325C8bFB8929414756E95023d2150C8881",
   github: "",
   builds: [ ],
   streamAddress: "0x8DaBdEf0259A8266234fcbDE4b12a59A66559239",
   streamUrl: "https://kijun.buidlguidl.com/"
  },
  {
   name: "huxwell.eth",
   role: "",
   address: "0xc9a238405ef9d753d55ec1eb8f7a7b17b8d83e63",
   github: "",
   builds: [ ],
   streamAddress: "0xE29ae83beF493eae7A6c07608C25C359d24989C3",
   streamUrl: "http://huxwell.buidlguidl.com"
  },
  {
   name: "grothe.eth",
   role: "",
   address: "0xacf16886efa51ff0957ef321b8510e53d67d1d7c",
   github: "",
   builds: [ ],
   streamAddress: "0xeAdc8bBB8717765429712C7BF5C9C5e55f0bCCd5",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://grothe.buidlguidl.com"
  },

  {
   name: "cluda.eth",
   role: "",
   address: "0xEB0C4F040FF0e2278bB2c14B7CC9c357467C83e3",
   github: "",
   builds: [ ],
   streamAddress: "0xB34006e71Ac4cF8B05C56422B7Be3d7f14d934E8",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://cluda.buidlguidl.com"
  },
  {
   name: "danielrees.eth",
   role: "",
   address: "0xE7A54673f2FfE41cf38dbA2014326064A958b709",
   github: "",
   builds: [ ],
   streamAddress: "0xA13966b1b4B66aC6670f0C14f8FA0a45FE219A09",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://danielrees.buidlguidl.com"
  },
  {
   name: "stermi.eth",
   role: "fullstack",
   address: "0x67960c0c99498AfF880D1bd68FE596C9443528ae",
   github: "",
   builds: [ ],
   streamAddress: "0x3B2ca03Bae949bA2C72C78D2f331b5Ebd155c735",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://stermi.buidlguidl.com"
  },
  {
   name: "damianmarti.eth",
   role: "fullstack",
   address: "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93",
   github: "",
   builds: [ ],
   streamAddress: "0x8FE72B655b54f4a900b1A0e6FD9957a6a3779209",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://damianmarti.buidlguidl.com"
  },
  {
   name: "mridul.eth",
   role: "fullstack",
   address: "0x5AbB06DC717cbe8112eFf232a6dfc98cB521511d",
   github: "",
   builds: [ ],
   streamAddress: "0x4cc7976d1b0784808E838CD89e0A4dF957B0f652",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://mridul.buidlguidl.com"
  },

  {
   name: "developermarwan.eth",
   role: "fullstack",
   address: "0x53E7f107F3037Df2A03C79Fa9750908c67B55CD3",
   github: "",
   builds: [ ],
   streamAddress: "0x52864De6545554437999FA20374AFf409B4F52b7",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://developermarwan.buidlguidl.com"
  },
  {
   name: "dgrcode.eth",
   role: "fullstack",
   address: "0x0D0f9Ebd254e510AA6F3788ecb6E6fC8bf78188F",
   github: "",
   builds: [ ],
   streamAddress: "0xE5C281c470AcedD6f15d41C640988822594bf69A",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://dgrcode.buidlguidl.com"
  },
  {
   name: "carletex.eth",
   role: "fullstack",
   address: "0x60583563D5879C2E59973E5718c7DE2147971807",
   github: "",
   builds: [ ],
   streamAddress: "0x4b5ed9760e5F5E87c50d9739BeFf5b13FB61cC2F",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://carletex.buidlguidl.com"
 },/*
  {
   name: "trombone.eth",
   role: "support",
   address: "0x18EE15f0C12B3035C84a9A1027dB1e1151308ac5",
   github: "",
   builds: [ ],
   streamAddress: "0x853E9d7036C48FA36CCCfF0e5b8907ae013ae8Eb",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://trombone.buidlguidl.com"
 },*/
  {
   name: "ghostffcode.eth",
   role: "fullstack",
   address: "0xbF7877303B90297E7489AA1C067106331DfF7288",
   github: "",
   builds: [ ],
   streamAddress: "0x0e185D75A3658De186fCef13Ae01e816cCCE599a",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://ghostffcode.buidlguidl.com"
  },
  {
   name: "ryanpetroff.eth",
   role: "gardener",
   address: "0x00555dC77a343E205CB1C7755407c93470DB3F91",
   github: "",
   builds: [ ],
   streamAddress: "0x6459ED3063E1267B9c22E6410076d328E4B971a6",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://ryanpetroff.buidlguidl.com"
  },
  {
   name: "captnseagraves.eth",
   role: "fullstack",
   address: "0x5Ad3b55625553CEf54D7561cD256658537d54AAd",
   github: "https://github.com/austintgriffith/scaffold-eth/commits?author=captnseagraves",
   builds: [ ],
   streamAddress: "0x446455ece8922a5C4CE8b205b74D06bD9706143b",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
   streamUrl: "http://captnseagraves.buidlguidl.com"
  },
  {
    name: "lekag.eth",
    role: "Full Stack",
    address: "0x7C2F9E77CFB36Fc90bc8296C0cebbcd89E8D1981",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=le-kag",
    builds: [],
    streamAddress: "0xc3c9ff28Ffa2BB65E5827C5Fdc309FFC41e5017e", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://lekag.buidlguidl.com",
  },
  {
    name: "nook.eth",
    role: "Full Stack",
    address: "0x50c57894C3b9bf022D10B94B9D940a48A93cd8c0",
    github: "",
    builds: [],
    streamAddress: "0xbD0944bb3aE59952E772A65661C1a51BBbF1ea92", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://nook.buidlguidl.com",
  },
  {
    name: "blindnabler.eth",
    role: "Full Stack",
    address: "0x807a1752402D21400D555e1CD7f175566088b955",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=MercuricChloride",
    builds: [],
    streamAddress: "0x619ACcbE6E5C4E5Cc71a29a05eE7228867c9733c", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://blindnabler.buidlguidl.com",
  },
  {
    name: "0xsama.eth",
    role: "Full Stack",
    address: "0x411381D227AF243E9383fDbB77313352E622D72f",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=ososco",
    builds: [],
    streamAddress: "0x538d822559Eb7A2D594E7D68dCdf29b3296830D3", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://0xsama.buidlguidl.com",
  },
  {
    name: "xiangan.eth",
    role: "Support",
    address: "0x26Ad3416e70bD055Dbc5E34c91D17d72AdBe1478",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=shravansunder",
    builds: [],
    streamAddress: "0xb32270518664C77a09E44f6DA59aD2dd3470299C", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://xiangan.buidlguidl.com",
  },
  {
    name: "shravansunder.eth",
    role: "Full Stack",
    address: "0xbE13CA20B7ff5fEf2D04f67aBf2A2a07feAfA102",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=shravansunder",
    builds: [],
    //streamAddress: "0x1FE0e66952b7eeB16dDb62B33CA62813c1c4FaA7", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    //streamUrl: "http://shravansunder.buidlguidl.com",
    streamAddress: "0x262f56C901847261080e366eDAb27d454a1315cd", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://shravansunder2.buidlguidl.com",
  },
  {
    name: "powvt.eth",
    role: "Full Stack",
    address: "0x9E67029403675Ee18777Ed38F9C1C5c75F7B34f2",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=powvt",
    builds: [],
    streamAddress: "0xc80bfd26B102991E2D96CE583B5eFA2E4Db0733d", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://powvt.buidlguidl.com",
  },
  {
    name: "isaacpatka.eth",
    role: "Full Stack",
    address: "0x775aF9b7c214Fe8792aB5f5da61a8708591d517E",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=ipatka",
    builds: [],
    streamAddress: "0x21BD856523f62Dd2A6eDBa750E97bD106204D5f2", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://isaacpatka.buidlguidl.com",
  },/*
  {
    name: "pabloruiz.eth",
    role: "Full Stack | Community",
    address: "0xfD4c0F5848642FC2041c003cb684fc66B16217bc",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=pabloruiz55",
    builds: [],
    streamAddress: "0xB3A51b63B7f1Bcb8600FF67E4a69C7B690994a89", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://pabloruiz.buidlguidl.com",
  },*/
  {
    name: "togzhan.eth",
    role: "Full Stack",
    address: "0x50ECcad809D553335a8eB7bfEC2CeE5A6f2cdE43",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=btogzhan2000",
    builds: [],
    streamAddress: "0x3B60b34Aa5dEAFF586D3841AD62b4aa730e11ceC", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://togzhan.buidlguidl.com",
  },
  {
    name: "ironsoul.eth",
    role: "React | Full Stack",
    address: "0x1e2Ce012b27d0c0d3e717e943EF6e62717CEc4ea",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=ironsoul0",
    builds: ["xnft", "honeypot", "dos", "flash", "highestbid", "merklenft", "paymentchannel"],
    streamAddress: "0xDbcD66b510191cD0539F7FAe8cD981B82Ee2006f", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://ironsoul.buidlguidl.com",
  },
  {
    name: "viraz.eth",
    role: "Full Stack",
    address: "0x2DdA8dc2f67f1eB94b250CaEFAc9De16f70c5A51",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=viraj124",
    builds: ["xnft", "proxy", "diamond", "highestbid", "merklenft", "paymentchannel", "bondingcurve"],
    streamAddress: "0x974a061A8cE5a2b07cB3f1D356Bb01Daaa9eC31d", //"0x21e18260357D33d2e18482584a8F39D532fb71cC",
    streamUrl: "http://viraz.buidlguidl.com",
  },
  {
    name: "sadda11asm.eth",
    role: "Full Stack",
    address: "0x7b945ffE9725D8e05343bEC36c0eced294097f78",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=ironsoul0",
    builds: ["xnft", "rokens", "highestbid", "merklenft", "paymentchannel"],
    streamAddress: "0x1eB6Da6F03B6D3C0d8da0B127388Add4d78Eb652", //"0xd116179A26F7b36Ed7B3334679aD0B2ec8c5ec22",
    streamUrl: "http://sadda11asm.buidlguidl.com",
  },
  {
    name: "amogh.eth",
    role: "Full Stack",
    address: "0x1245e96fe32B43dDEc930D662B5d20239282b876",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=amogh-jrules",
    builds: ["smms", "push", "metamultisig"],
    streamAddress: "0xA267be6eF185f7563354e90882c1d3332455B8F8", //"0x298F4Af778954d771A6Fc6098AFc0a19f35d3dAA",
    streamUrl: "http://amogh.buidlguidl.com",
  },
  {
    name: "calvinquin.argent.xyz",
    role: "Full Stack",
    address: "0x614Ae4C6Eb91cEC9e6e178549c0745A827212B24",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=calvbore",
    builds: [],
    streamAddress: "0x864Fa2F20e414c9534B1DE567a30a77436c7a745", //"0x0dE7a22627b68F51bBE22f408e009146D6c56ee1",
    streamUrl: "http://calvinquin.buidlguidl.com",
  },

  {
    name: "ssteiger.eth",
    role: "React",
    address: "0x4ceb8dC70813fFbB2d8d6DC0755086698F977613",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=ssteiger",
    builds: ["ethdev"],
    streamAddress: "0x24aAc13141DbE8946433215bfdc793C2B71398c8", //"0x271C2Fb694F38bE3FA7e6374D349A714c7E8Bba7",//streamAddress: "0x7D6DAdfb6df8ebe6fCB1C32af55252F04D79Df85",
    streamUrl: "http://ssteiger.buidlguidl.com",
  },
  {
    name: "pharo.eth",
    role: "Maintainer | Full Stack",
    address: "0xa4ca1b15fe81f57cb2d3f686c7b13309906cd37b",
    github: "https://github.com/austintgriffith/scaffold-eth/commits?author=codenamejason",
    builds: [ "vrf" ],
    streamAddress: "0x3DC246459433aFc0360b83166A6Dd9B7697EaA4A",//"0x733F7E1aEdC49c7c777c29C4bE2eB772666552F4",//"0x1B8bB82bF08D69bDFb0287F6C16Fa739Aa6e95f2",//"0x45283840c879DBA341170FaFA62542F7714BFE8f",
    streamUrl: "http://rawcipher1.buidlguidl.com",//rawcipherstream.surge.sh
  },
  {
    name: "mrdee.eth",
    role: "Artwork",
    address: "0xd2f016809969b4105978fDD5b112CD95bFDd6814",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=azf20",
    builds: [],
    streamAddress: "0xD31aDDE3c6659653f5BdCb237afB353155db1567", //"0xF48BECEa4C65F0c2F3841ed00E813298C8B327ab",
    streamUrl: "http://mrdee.buidlguidl.com",
  },
  {
    name: "pileofscraps.eth",
    role: "Full Stack",
    address: "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=pileofscraps",
    builds: [],
    streamAddress: "0x0A9eDE9A66683F23d369FC6bAAA9D1fa7198Ebf2", //dup"0x2eC099fE9547A1Ac760Bd1C9bBE710218624Bf3f"//"0x2eC099fE9547A1Ac760Bd1C9bBE710218624Bf3f",
    streamUrl: "http://pileofscraps.buidlguidl.com/",
  },
  {
    name: "hunterchang.eth",
    role: "React",
    address: "0xf7e89E45502890381F9242403eA8661fad89Ca79",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=azf20",
    builds: ["xnft"],
    streamAddress: "0x560Dd59ED235446d04da7C907289E3f88e685447", //dup"0x2eC099fE9547A1Ac760Bd1C9bBE710218624Bf3f"//"0x2eC099fE9547A1Ac760Bd1C9bBE710218624Bf3f",
    streamUrl: "http://hunterchang.buidlguidl.com",
  },

  {
    name: "hipsterhelpdesk.eth",
    role: "eth.build",
    address: "0x84946f14B092A0b32B21dd10E742C02AE3710aDd",
    github: "https://github.com/scaffold-eth/eth.build/commits?author=grahamtallen",
    builds: [],
    streamAddress: "0x04e9245892391FB290D11D5deB0bB8C2A325B629", //"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
    streamUrl: "http://hipsterhelpdesk.buidlguidl.com",
  },

  {
    name: "adamfuller.eth",
    role: "Solidity + React",
    address: "0x60Ca282757BA67f3aDbF21F3ba2eBe4Ab3eb01fc",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=azf20",
    builds: ["niftyink", "uniswapper", "lender", "ape", "op", "signatorio", "burnyBoys"],
    streamAddress: "0x754A8a09Eae2FFEFbDE706a6ed40C0f0F3c58d7e", //"0xdC1d9454CBa690E0a33abeB08de1DD6921b15759",//"0x79Eeda2a3cdB90129A3Dc851556AeaF25DdF1E39",
    streamUrl: "http://adamfuller.buidlguidl.com",
  },

  {
    name: "austingriffith.eth",
    role: "Mentor",
    address: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    github: "https://github.com/scaffold-eth/scaffold-eth/commits?author=austintgriffith",
    builds: [
      "niftyink",
      "simplestream",
      "niftyview",
      "opnfts",
      "smms",
      "allocator",
      "radwallet",
      "punkwallet",
      "simplenft",
      "randomimage",
      "gtgs",
    ],
    streamAddress: "0x518Af5F20bf07C882e17731207761C174AB4F9c4", //"0xb0D25772CB076cb4cE90a0c4dfdba6Cad07921a1",
    streamUrl: "http://austingriffith.buidlguidl.com",
  },
];

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + window.location.hostname + ":8545",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  matic: {
    name: "matic",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://explorer-mainnet.maticvigil.com//",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://mumbai-explorer.matic.today/",
  },
};
