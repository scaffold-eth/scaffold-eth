exports.backend = "ipfs"; // "ipfs" or "akord"

// required for IPFS
exports.projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
exports.projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;

// required for Akord/Arweave
exports.akordEmail = process.env.AKORD_EMAIL;
exports.akordPassword = process.env.AKORD_PASSWORD;
exports.akordVaultName = process.env.AKORD_VAULT_NAME || "Simple NFT example";


exports.baseUri = exports.backend === "akord" ? "https://arweave.net/" : "https://ipfs.io/ipfs/";
