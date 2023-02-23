import { Button, InputNumber, notification, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { utils } from "zksync-web3";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { parse } from "eth-url-parser";

function PayToVendor({ provider, userSigner, updateBalanceBuidl, contractBuidl, vendors, paymasterAddress }) {
  const [vendorAddress, setVendorAddress] = useState();
  const [vendorLabel, setVendorLabel] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    if (vendors) {
      const vendorIndex = vendors.findIndex(element => element.value === vendorAddress);
      if (vendorIndex >= 0) {
        setVendorLabel(vendors[vendorIndex].label);
      }
    }
  }, [vendorAddress, vendors]);

  const handleChangeAmount = value => {
    console.log("changed", value);
    setAmount(value);
  };

  return (
    <div>
      {showConfirmation ? (
        <div>
          <img src="bufficorn-taco.svg" alt="Bufficorn & Taco" />
          <h2>{amount} BUILD</h2>
          <p>Sent to</p>
          <h3>{vendorLabel}</h3>
          <p>Order: {transactionHash.slice(-6)}</p>
          <p>Show this confirmation to the vendor</p>
        </div>
      ) : (
        <div>
          <h2>Purchase Food</h2>
          {vendorAddress && vendorLabel ? (
            <div>
              <h3>Food Truck: {vendorLabel}</h3>
              <h4>Address: {vendorAddress}</h4>
              <InputNumber placeholder="amount..." onChange={handleChangeAmount} value={amount} />
              <Button
                type="primary"
                className="plausible-event-name=TransferToVendorClick"
                disabled={loading}
                onClick={async () => {
                  console.log("provider: ", provider);
                  console.log("userSigner: ", userSigner);

                  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
                    type: "General",
                    innerInput: new Uint8Array(),
                  });

                  console.log("contractBuidl: ", contractBuidl);

                  if (amount > 0) {
                    setLoading(true);
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
                        window.plausible("TransferedToVendor", {
                          props: { vendor: vendorLabel, address: vendorAddress, amount: amount },
                        });
                        setTransactionHash(result.transactionHash);
                        setShowConfirmation(true);
                        updateBalanceBuidl();
                        setLoading(false);
                      } else {
                        notification.error({
                          message: "Error sending payment!",
                          description: `${result}`,
                          placement: "topRight",
                        });
                        window.plausible("TransferToVendorError", { props: { message: result } });
                        setLoading(false);
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
                        window.plausible("TransferedToVendor", {
                          props: { vendor: vendorLabel, address: vendorAddress, amount: amount },
                        });
                        setAmount(0);
                        updateBalanceBuidl();
                        setLoading(false);
                      } else {
                        notification.error({
                          message: "Error sending payment!",
                          description: `${error}`,
                          placement: "topRight",
                        });
                        window.plausible("TransferToVendorError", { props: { message: error } });
                        setLoading(false);
                      }
                    }
                  } else {
                    alert("Amount should be > 0!");
                  }
                }}
              >
                Transfer
              </Button>
              {loading && <Spin />}
            </div>
          ) : (
            <h3>No vendor selected</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default PayToVendor;
