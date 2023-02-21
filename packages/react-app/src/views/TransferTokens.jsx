import { Button, InputNumber, notification, Spin } from "antd";
import React, { useState } from "react";
import AddressInput from "../components/AddressInput";

function TransferTokens({ provider, userSigner, mainnetProvider, updateBalanceBuidl, contractBuidl }) {
  const [addressTo, setAddressTo] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  const handleChangeAmount = value => {
    console.log("changed", value);
    setAmount(value);
  };

  return (
    <div style={{ width: 400, margin: "0 auto" }}>
      <h2>Transfer Buidl</h2>
      <AddressInput
        ensProvider={mainnetProvider}
        placeholder="transfer to address"
        value={addressTo}
        onChange={newValue => {
          setAddressTo(newValue);
        }}
      />
      <InputNumber onChange={handleChangeAmount} value={amount} />
      <Button
        type="primary"
        disabled={loading}
        onClick={async () => {
          console.log("provider: ", provider);
          console.log("userSigner: ", userSigner);

          if (amount > 0) {
            setLoading(true);

            const amountToSend = amount * 100;
            const result = await (await contractBuidl.transfer(addressTo, amountToSend)).wait();
            console.log("Result transfer: ", result);
            if (result.confirmations > 0) {
              notification.success({
                message: "Tokens Sent!",
                description: `${amount} Buidl Tokens sent.`,
                placement: "topRight",
              });
              setAmount(0);
              setAddressTo("");
              updateBalanceBuidl();
              setLoading(false);
            } else {
              notification.error({
                message: "Error sending payment!",
                description: `${result}`,
                placement: "topRight",
              });
              setLoading(false);
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
  );
}

export default TransferTokens;
