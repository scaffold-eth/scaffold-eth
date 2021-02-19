import React, { useState } from "react";
import { ethers } from "ethers";
import { Popover, Button, Typography, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useContractLoader } from "./hooks";
import { Transactor, transactionHandler } from "./helpers";

export default function UpgradeInkButton(props) {
  const [upgrading, setUpgrading] = useState(false);

  //const writeContracts = useContractLoader(props.injectedProvider);

  let relayPrice = props.upgradePrice;

  const relayToken = async (tokenId) => {
    setUpgrading(true);
    let bigNumber = ethers.utils.bigNumberify(relayPrice);
    let hex = bigNumber.toHexString();

    try {
      let result;
      let contractName = "NiftyMediator";
      let regularFunctionArgs = [tokenId];
      let payment = hex;
      let regularFunction = "relayToken";

      let txConfig = {
        ...props.transactionConfig,
        contractName,
        regularFunction,
        regularFunctionArgs,
        payment,
      };

      console.log(txConfig);

      result = await transactionHandler(txConfig);

      //let result = await tx(writeContracts["NiftyMediator"].relayToken(tokenId, { value: hex } ))
      console.log("result", result);
    } catch (e) {
      console.log(e);
      notification.open({
        message: "Upgrade failed",
        description: "No changes made",
      });
      setUpgrading(false);
    }
    /*notification.open({
      message: 'Token successfully sent to '+process.env.REACT_APP_NETWORK_NAME+'!',
      description: ''
    });*/
    setUpgrading(false);
  };

  let buttonSize;
  if (props.buttonSize) {
    buttonSize = props.buttonSize;
  }

  return (
    <Popover
      content={
        <div style={{ textAlign: "center" }}>
          <Typography></Typography>
          <Button
            type="primary"
            style={{ marginBottom: 12 }}
            onClick={() => {
              relayToken(props.tokenId);
            }}
            loading={upgrading}
          >
            <UploadOutlined
              style={{ fontSize: 26, marginLeft: 4, verticalAlign: "middle" }}
            />{" "}
          </Button>
        </div>
      }
      title={"Upgrade to Ethereum mainnet"}
    >
      <Button
        type="secondary"
        size={buttonSize}
        style={{ margin: 4, marginBottom: 12 }}
      >
        <UploadOutlined />
        {relayPrice
          ? "Upgrade: $" +
            parseFloat(ethers.utils.formatEther(relayPrice)).toFixed(2)
          : "Upgrade"}
      </Button>
    </Popover>
  );
}
