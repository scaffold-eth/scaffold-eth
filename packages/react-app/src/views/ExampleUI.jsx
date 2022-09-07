import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";
import { useContractReader } from "eth-hooks";
import { Address, Balance, Events } from "../components";

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  //const [newPurpose, setNewPurpose] = useState("loading...");

  const balanceOf = useContractReader(readContracts, "YourContract", "balanceOf", [address]);

  const priceOfCollectibles = useContractReader(readContracts, "YourContract", "price");

  const currentReward = useContractReader(readContracts, "YourContract", "currentReward");

  let artistUI = "";

  const streamBalance = useContractReader(readContracts, "YourContract", "streamBalance");

  const cap = useContractReader(readContracts, "YourContract", "cap");

  const toAddress = useContractReader(readContracts, "YourContract", "toAddress");

  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState();

  if (address == toAddress) {
    artistUI = (
      <div style={{ padding: 32, width: 320, margin: "auto" }}>
        <div>You are the artist. You can withdraw:</div>
        <div>
          <Balance value={streamBalance} provider={localProvider} price={price} /> /{" "}
          <Balance value={cap} provider={localProvider} price={price} />
        </div>
        <div>
          reason:{" "}
          <Input
            value={reason}
            onChange={e => {
              setReason(e.target.value);
            }}
          />
        </div>
        <div>
          amount: $
          <Input
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
            }}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              tx(writeContracts.YourContract.streamWithdraw(utils.parseEther("" + parseFloat(amount) / price), reason));
            }}
          >
            Withdraw
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <div>
          <img src="https://ipfs.io/ipfs/QmTw98vzxH1F62FgGsMYAbUZP9PB7uCYNM37YdvBJsgwjb" style={{ maxWidth: 200 }} />
        </div>

        <div>
          <Address address={writeContracts?.YourContract?.address} />
        </div>

        <div>
          Contract balance:{" "}
          <Balance address={writeContracts?.YourContract?.address} provider={localProvider} price={price} />
        </div>

        <div>
          Price: <Balance value={priceOfCollectibles} provider={localProvider} price={price} />
        </div>

        <div>Your kitties: {balanceOf?.toNumber()}</div>

        <Button
          onClick={async () => {
            let price = await readContracts.YourContract.price();
            console.log("PRICE", utils.formatEther(price));
            tx(writeContracts.YourContract.mintItem({ value: price }));
          }}
        >
          MINT
        </Button>

        <Button
          onClick={async () => {
            tx(writeContracts.YourContract.burnItem());
          }}
        >
          BURN
        </Button>

        <div>
          reward: <Balance value={currentReward} provider={localProvider} price={price} />
        </div>
      </div>
      <div style={{ paddingBottom: 164, marginBottom: 128 }}>{artistUI}</div>
    </div>
  );
}
