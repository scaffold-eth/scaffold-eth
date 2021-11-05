import { Badge, Button } from "antd";
import { useBlockNumber, usePoller } from "eth-hooks";
import React, { useState } from "react";
// import { WalletOutlined } from '@ant-design/icons';
import Address from "./Address";

export default function Provider(props) {
  const [showMore, setShowMore] = useState(false);
  const [status, setStatus] = useState("processing");
  const [network, setNetwork] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();

  const blockNumber = useBlockNumber(props.provider);

  usePoller(async () => {
    if (props.provider && typeof props.provider.getNetwork === "function") {
      try {
        const newNetwork = await props.provider.getNetwork();
        setNetwork(newNetwork);
        if (newNetwork.chainId > 0) {
          setStatus("success");
        } else {
          setStatus("warning");
        }
      } catch (e) {
        console.log(e);
        setStatus("processing");
      }
      try {
        const newSigner = await props.provider.getSigner();
        setSigner(newSigner);
        const newAddress = await newSigner.getAddress();
        setAddress(newAddress);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }, 1377);

  if (
    typeof props.provider === "undefined" ||
    typeof props.provider.getNetwork !== "function" ||
    !network ||
    !network.chainId
  ) {
    return (
      <Button
        shape="round"
        size="large"
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        <Badge status={status} /> {props.name}
      </Button>
    );
  }

  let showExtra = "";
  if (showMore) {
    showExtra = (
      <span>
        <span style={{ padding: 3 }}>
          id:
          {network ? network.chainId : ""}
        </span>
        <span style={{ padding: 3 }}>
          name:
          {network ? network.name : ""}
        </span>
      </span>
    );
  }

  let showWallet = "";
  if (typeof signer !== "undefined" && address) {
    showWallet = (
      <span>
        <span style={{ padding: 3 }}>
          <Address minimized address={address} />
        </span>
      </span>
    );
  }

  return (
    <Button
      shape="round"
      size="large"
      onClick={() => {
        setShowMore(!showMore);
      }}
    >
      <Badge status={status} /> {props.name} {showWallet} #{blockNumber}{" "}
      {showExtra}
    </Button>
  );
}
