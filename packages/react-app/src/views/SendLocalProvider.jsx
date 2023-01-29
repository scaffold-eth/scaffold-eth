import { Button } from "antd";
import React from "react";
import { Wallet, Contract, utils } from "zksync-web3";
import externalContracts from "../contracts/external_contracts";

function SendLocalProvider({ provider, injectedProvider }) {
  const BUIDLBUXX_PAYMASTER_ADDRESS = "0x628e8b27F0c5c443a68297893c920328dD18e611";

  // TODO: use chainId from provider
  const abi = externalContracts[270].contracts.BuidlBuxx.abi;
  const BUIDLBUXX_ADDRESS = externalContracts[270].contracts.BuidlBuxx.address;

  return (
    <Button
      onClick={async () => {
        console.log("provider: ", provider);
        console.log("injectedProvider: ", injectedProvider);

        const signer = injectedProvider.getSigner();
        console.log("signer: ", signer);

        const wallet3 = new Wallet("0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e");

        const paymasterParams = utils.getPaymasterParams(BUIDLBUXX_PAYMASTER_ADDRESS, {
          type: "General",
          innerInput: new Uint8Array(),
        });

        const contractBuildBuxx = new Contract(BUIDLBUXX_ADDRESS, abi, signer);

        console.log("contractBuildBuxx: ", contractBuildBuxx);

        const gasLimit = 300000;

        await (
          await contractBuildBuxx.transfer(wallet3.address, 100, {
            gasLimit,
            customData: {
              paymasterParams,
              ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
            },
          })
        ).wait();
      }}
    >
      Send with Paymaster and LocalProvider
    </Button>
  );
}

export default SendLocalProvider;
