import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import { useContractReader, useNonce } from '../hooks/index';
import { EtherInput, AddressInput } from '../components/index';

export default function ExampleUI({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [toAddress, setToAddress] = useState()
  const [amount, setAmount] = useState();
  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "YourContract", "balanceOf", [address])
  console.log("🤗 balance:", balance)

  const daiBalance = useContractReader(readContracts, "MockDai", "balanceOf", [address])
  console.log("DAI Balance:", daiBalance)


  let nonce = useNonce(localProvider, address);
  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Example UI:</h2>

        <h4>DAI Balance: {daiBalance && formatEther(daiBalance)}</h4>

        <h4>😃Balance: {balance && formatEther(balance)}</h4>
        <Divider />

        <div style={{ margin: 8 }}>
          <EtherInput
            price={price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
          <Button onClick={() => {
            tx(writeContracts.MockDai.approve(writeContracts.YourContract.address, parseEther(amount), { nonce: nonce }))
            setTimeout(
              () => {
                console.log("second tx fired 1.5s later....")
                tx(writeContracts.YourContract.mint(parseEther(amount), { nonce: nonce + 1 }))
              }, 1500
            )
          }}>Mint 😃</Button>
        </div>


        <div style={{ margin: 8 }}>
          <EtherInput
            price={price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
          <Button onClick={() => {
            /* look how you call setPurpose on your contract: */
            tx(writeContracts.YourContract.burn(parseEther(amount)))
          }}>Burn 😃</Button>
        </div>

        <div style={{ margin: 8 }}>
          <AddressInput
            autoFocus
            ensProvider={mainnetProvider}
            placeholder="to address"
            value={toAddress}
            onChange={setToAddress}
          />
          <EtherInput
            price={price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
          <Button onClick={() => {
            console.log(amount)
            console.log(toAddress)
            /* look how you call setPurpose on your contract: */
            tx(writeContracts.YourContract.transfer(toAddress, parseEther(amount)))
          }}>Transfer </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
    </div>
  );
}