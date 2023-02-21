import { Button, Select, InputNumber, notification } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { utils } from "zksync-web3";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { parse } from "eth-url-parser";

function PayToVendor({ provider, userSigner, updateBalanceBuidl, contractBuidl, vendors }) {
  // local
  // const BUIDLBUXX_PAYMASTER_ADDRESS = "0x628e8b27F0c5c443a68297893c920328dD18e611";
  // testnet
  const BUIDLBUXX_PAYMASTER_ADDRESS = "0x7F904e350F27aF4D4A70994AE1f3bBC1dAfEe665";

  const [vendorAddress, setVendorAddress] = useState();
  const [vendorLabel, setVendorLabel] = useState();
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

  useEffect(() => {
    console.log("vendorAddress: ", vendorAddress);
    const vendorIndex = vendors.findIndex(element => element.value == vendorAddress);
    if (vendorIndex >= 0) {
      setVendorLabel(vendors[vendorIndex].label);
    }
  }, [vendorAddress]);

  const handleChangeAmount = value => {
    console.log("changed", value);
    setAmount(value);
  };

  return (
    <div>
      <h2>Purchase Food</h2>
      {vendorAddress && vendorLabel ? (
        <div>
          <h3>Food Truck: {vendorLabel}</h3>
          <h4>Address: {vendorAddress}</h4>
          <InputNumber placeholder="amount..." onChange={handleChangeAmount} value={amount} />
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

              if (amount > 0) {
                const amountToSend = amount * 100;
                try {
                  const result = await (
                    await contractBuidl.transfer(vendorAddress, amountToSend, {
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
                } catch (error) {
                  console.log("error name: ", error.name);
                  console.log("error message: ", error.message);
                  if (error.message === "invalid remainder") {
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
                      description: `${error}`,
                      placement: "topRight",
                    });
                  }
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
