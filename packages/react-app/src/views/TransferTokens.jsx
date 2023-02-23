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
    <div className="flex flex-col gap-3 max-w-[400px] mt-4 mb-12 mx-auto border-[1px] border-white p-4 rounded-lg shadow-xl shadow-black">
      <span className="text-2xl">Transfer Buidl Tokens</span>
      <AddressInput
        ensProvider={mainnetProvider}
        placeholder="transfer to address"
        value={addressTo}
        onChange={newValue => {
          setAddressTo(newValue);
        }}
      />
      <div className="w-full">
        <span>Amount: </span>
        <InputNumber onChange={handleChangeAmount} value={amount} />
      </div>
      <Button
        type="primary"
        className="plausible-event-name=TransferClick"
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
              window.plausible("Transfered", {
                props: { address: addressTo, amount: amount },
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
              window.plausible("TransferError", { props: { message: result } });
              setLoading(false);
            }
          } else {
            alert("Amount should be > 0!");
          }
        }}
      >
        <span>Transfer</span>
      </Button>
      {loading && <Spin />}
    </div>
  );
}

export default TransferTokens;
