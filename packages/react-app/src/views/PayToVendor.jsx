import { Button, Select, InputNumber, notification, ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { utils } from "zksync-web3";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { parse } from "eth-url-parser";

function PayToVendor({ provider, userSigner, updateBalanceBuidl, contractBuidl }) {
  // local
  // const BUIDLBUXX_PAYMASTER_ADDRESS = "0x628e8b27F0c5c443a68297893c920328dD18e611";
  // testnet
  const BUIDLBUXX_PAYMASTER_ADDRESS = "0x7F904e350F27aF4D4A70994AE1f3bBC1dAfEe665";

  const [vendorAddress, setVendorAddress] = useState();
  const [amount, setAmount] = useState();
  const [qr, setQr] = useState();

  let location = useLocation();

  useEffect(() => {
    console.log("location: ", location);
    const qr = qs.parse(location.search, { ignoreQueryPrefix: true }).qr;
    console.log("qr: ", qr);
    if (qr) {
      const parsedQr = parse(qr);
      console.log("parsedQr: ", parsedQr);
      setVendorAddress(parsedQr.parameters.address);
    }
  }, [location]);

  const handleChangeAmount = value => {
    console.log("changed", value);
    setAmount(value);
  };

  return (
    <div>
      <h2>Pay to Vendor</h2>
      {vendorAddress ? (
        <div>
          <h3>Vendor: {vendorAddress}</h3>
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
            Transfer
          </Button>
        </div>
      ) : (
        <h3>No vendor selected</h3>
      )}
    </div>
  );
}

export default PayToVendor;
