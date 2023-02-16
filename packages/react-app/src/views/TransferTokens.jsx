import { Button, Input, InputNumber, notification, ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Wallet, Contract, utils } from "zksync-web3";
import externalContracts from "../contracts/external_contracts";
import AddressInput from "../components/AddressInput";

function TransferTokens({ provider, userSigner, mainnetProvider }) {
  const [addressTo, setAddressTo] = useState();
  const [amount, setAmount] = useState();
  const [contractBuidl, setContractBuidl] = useState();
  const [balance, setBalance] = useState();

  // TODO: use chainId from provider

  // local
  //const chanId = 270;
  // testnet
  const chanId = 280;

  const abi = externalContracts[chanId].contracts.BuidlBuxx.abi;
  const BUIDLBUXX_ADDRESS = externalContracts[chanId].contracts.BuidlBuxx.address;

  useEffect(() => {
    const updateContractBuidl = async () => {
      const newContractBuidl = new Contract(BUIDLBUXX_ADDRESS, abi, userSigner);
      console.log("newContractBuidl: ", newContractBuidl);
      setContractBuidl(newContractBuidl);
    };
    updateContractBuidl();
  }, [BUIDLBUXX_ADDRESS, abi, userSigner]);

  useEffect(() => {
    const updateBalanceBuidl = async () => {
      if (contractBuidl && userSigner && userSigner.address) {
        const newBalance = await contractBuidl.balanceOf(userSigner.address);
        console.log("newBalance: ", newBalance);
        setBalance((newBalance / 100).toString());
      }
    };
    updateBalanceBuidl();
  }, [contractBuidl, userSigner && userSigner.address]);

  const handleChangeAddressTo = value => {
    console.log(`changed address to ${value}`);
    setAddressTo(value);
  };

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
        onClick={async () => {
          console.log("provider: ", provider);
          console.log("userSigner: ", userSigner);

          console.log("contractBuidl: ", contractBuidl);

          const gasLimit = 300000;

          if (amount > 0) {
            const amountToSend = amount; // * 100;
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
              const newBalance = await contractBuidl.balanceOf(userSigner.address);
              console.log("newBalance: ", newBalance);
              setBalance((newBalance / 100).toString());
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
  );
}

export default TransferTokens;
