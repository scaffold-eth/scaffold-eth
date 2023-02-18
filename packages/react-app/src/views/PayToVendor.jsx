import { Button, Select, InputNumber, notification, ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Wallet, Contract, utils } from "zksync-web3";
import externalContracts from "../contracts/external_contracts";

function PayToVendor({ provider, userSigner, updateBalanceBuidl, contractBuidl }) {
  // local
  // const BUIDLBUXX_PAYMASTER_ADDRESS = "0x628e8b27F0c5c443a68297893c920328dD18e611";
  // testnet
  const BUIDLBUXX_PAYMASTER_ADDRESS = "0x7F904e350F27aF4D4A70994AE1f3bBC1dAfEe665";

  // local
  /*
  const vendors = [
    { label: "Vendor1", value: "0x0D43eB5B8a47bA8900d84AA36656c92024e9772e" },
    { label: "Vendor2", value: "0x7f1A8F0811Bf6700c3bc98342758145113c58E4A" },
  ];
  */
  // testnet
  const vendors = [
    { label: "Vendor1", value: "0x0dc01C03207fB73937B4aC88d840fBBB32e8026d" },
    { label: "Vendor2", value: "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e" },
  ];

  const [vendorAddress, setVendorAddress] = useState();
  const [amount, setAmount] = useState();

  const handleChangeVendor = value => {
    console.log(`selected ${value}`);
    setVendorAddress(value);
  };

  const handleChangeAmount = value => {
    console.log("changed", value);
    setAmount(value);
  };

  return (
    <div>
      <h2>Pay to Vendor</h2>
      <Select
        placeholder="Select vendor"
        options={vendors}
        onChange={handleChangeVendor}
        style={{ width: 200 }}
        value={vendorAddress}
      />
      <InputNumber onChange={handleChangeAmount} value={amount} />
      <Button
        type="primary"
        onClick={async () => {
          console.log("provider: ", provider);
          console.log("userSigner: ", userSigner);

          const paymasterParams = utils.getPaymasterParams(BUIDLBUXX_PAYMASTER_ADDRESS, {
            type: "General",
            innerInput: new Uint8Array(),
          });

          console.log("contractBuidl: ", contractBuidl);

          const gasLimit = 300000;

          if (amount > 0) {
            const amountToSend = amount * 100;
            const result = await (
              await contractBuidl.transfer(vendorAddress, amountToSend, {
                gasLimit,
                customData: {
                  paymasterParams,
                  gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
                },
              })
            ).wait();
            console.log("Result transfer: ", result);
            if (result.confirmations > 0) {
              notification.success({
                message: "Payment Sent!",
                description: `${amount} Buidl Tokens sent.`,
                placement: "topRight",
              });
              setAmount(0);
              setVendorAddress("");
              updateBalanceBuidl();
            } else {
              notification.error({
                message: "Error sending payment!",
                description: `${result}`,
                placement: "topRight",
              });
            }
          } else {
            alert("Amount should be > 0!");
          }
        }}
      >
        Purchase
      </Button>
    </div>
  );
}

export default PayToVendor;
