import { Button } from "antd";
import React from "react";
import { Wallet, Contract, utils, Provider } from "zksync-web3";
import externalContracts from "../contracts/external_contracts";

function MintTokens({ address }) {
  const RICH_WALLET_PK = "0xb6e82058e797db9dbaccb7ce0dd7b80e6da32c623bcea42b9227b3f443816714";

  const BUIDLBUXX_PAYMASTER_ADDRESS = "0x7F904e350F27aF4D4A70994AE1f3bBC1dAfEe665";

  // TODO: use chainId from provider
  // local
  //const chanId = 270;
  // testnet
  const chanId = 280;
  const abi = externalContracts[chanId].contracts.BuidlBuxx.abi;
  const BUIDLBUXX_ADDRESS = externalContracts[chanId].contracts.BuidlBuxx.address;

  return (
    <Button
      onClick={async () => {
        const providerZk = new Provider("https://zksync2-testnet.zksync.dev");
        const wallet = new Wallet(RICH_WALLET_PK, providerZk);

        const currentBalance = await wallet.getBalance();
        console.log("currentBalance: ", currentBalance);

        const paymasterParams = utils.getPaymasterParams(BUIDLBUXX_PAYMASTER_ADDRESS, {
          type: "General",
          innerInput: new Uint8Array(),
        });

        const contractBuildBuxx = new Contract(BUIDLBUXX_ADDRESS, abi, wallet);

        console.log("contractBuildBuxx: ", contractBuildBuxx);

        const gasLimit = 300000;

        /*
        await (
          await contractBuildBuxx.mint(address, 10000, {
            gasLimit,
            customData: {
              paymasterParams,
              ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
            },
          })
        ).wait();
        */

        await (await contractBuildBuxx.mint(address, 10000, { gasLimit })).wait();
      }}
    >
      Mint Tokens
    </Button>
  );
}

export default MintTokens;
