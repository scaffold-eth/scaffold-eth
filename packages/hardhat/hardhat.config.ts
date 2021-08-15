import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import * as dotenv from "dotenv";
// import fs from "fs";

dotenv.config();

// const MNEMONIC = fs.readFileSync("../../.envrc").toString().trim();
const MUMBAI_API_KEY = process.env.MUMBAI_API_KEY;
const MNEMONIC = process.env.MNEMONIC as string;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: {
      default: 0,
      mumbai: "0xCC78280A93267D7E646e03207194510e0f09CF06"
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_API_KEY}`,
      accounts: [MNEMONIC]
    }
  },
  typechain: {
    outDir: "../frontend/types/typechain"
  }
};

export default config;
