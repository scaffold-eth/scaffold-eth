import { Button, InputNumber, notification, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Address from "../components/Address";
import { utils } from "zksync-web3";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { parse } from "eth-url-parser";

function PayToVendor({
  provider,
  userSigner,
  updateBalanceBuidl,
  contractBuidl,
  vendors,
  paymasterAddress,
  mainnetProvider,
  blockExplorer,
  address,
}) {
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
    if (vendors && vendorAddress) {
      const vendorIndex = vendors.findIndex(element => element.value.toLowerCase() === vendorAddress.toLowerCase());
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
        <div className="payment-confirmation">
          <img src="assets/bufficorn-taco.svg" alt="Bufficorn & Taco" />
          <h2 style={{ fontSize: 48 }}>{amount} BUILD</h2>
          <p>Sent to</p>
          <h3 style={{ fontSize: 36 }}>{vendorLabel}</h3>
          <h3 style={{ fontSize: 36 }}>
            Order #{transactionHash ? transactionHash.slice(-6) : "N/A (please check customer address)"}
          </h3>
          <p>Customer Address</p>
          <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={36} />
          <p style={{ marginTop: 20 }}>Show this confirmation to the vendor</p>
        </div>
      ) : (
        <div>
          {vendorAddress && vendorLabel ? (
            <div>
              <h4 style={{ marginBottom: 0 }}>
                <Address
                  address={vendorAddress}
                  ensProvider={mainnetProvider}
                  blockExplorer={blockExplorer}
                  fontSize={16}
                />
              </h4>
              <h2 style={{ fontSize: 48 }}>{vendorLabel}</h2>
              <InputNumber
                placeholder="amount..."
                style={{
                  width: 200,
                  display: "block",
                  margin: "0 auto",
                  border: "2px solid black",
                  borderRadius: 5,
                }}
                onChange={handleChangeAmount}
                value={amount}
              />
              <Button
                type="primary"
                className="claim-button"
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
                    window.plausible("TransferToVendorClick", { props: { amount: amount } });
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
                        setShowConfirmation(true);
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
                    window.plausible("TransferToVendorClickWithZero");
                    notification.error({
                      message: "Wrong amount!",
                      description: "Amount should be greater than 0",
                      placement: "topRight",
                    });
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
