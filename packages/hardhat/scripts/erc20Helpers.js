const { ethers } = require('ethers');

// A Human-Readable ABI; any supported ABI format could be used
const abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const erc20 = (address) => {
    const provider = ethers.getDefaultProvider();
    const tokenContract = new ethers.Contract(address, abi, provider);

    return tokenContract;
}

module.exports = erc20;