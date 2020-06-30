import React from "react";
import { ethers } from "ethers";
import Blockies from "react-blockies";
import { Card, Row, Col, List } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance } from "./hooks";
import { Transactor } from "./helpers";
import { Address, Balance, Timeline } from "./components";

const { Meta } = Card;

const contractName = "SmartContractWallet";

export default function SmartContractWallet(props) {
  const tx = Transactor(props.injectedProvider, props.gasPrice);

  const localBlockNumber = useBlockNumber(props.localProvider);
  const localBalance = useBalance(props.address, props.localProvider);

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);

  const title = useContractReader(readContracts, contractName, "title", 1777);
  const owner = useContractReader(readContracts, contractName, "owner", 1777);

  const ownerUpdates = useEventListener(readContracts, contractName, "UpdateOwner", props.localProvider, 1); // set that last number to the block the contract is deployed (this needs to be automatic in the contract loader!?!)

  const contractAddress = readContracts ? readContracts[contractName].address : "";
  const contractBalance = useBalance(contractAddress, props.localProvider);

  let displayAddress;
  let displayOwner;

  if (readContracts && readContracts[contractName]) {
    displayAddress = (
      <Row>
        <Col span={8} style={{ textAlign: "right", opacity: 0.333, paddingRight: 6, fontSize: 24 }}>
          Deployed to:
        </Col>
        <Col span={16}>
          <Address value={contractAddress} />
        </Col>
      </Row>
    );
    displayOwner = (
      <Row>
        <Col span={8} style={{ textAlign: "right", opacity: 0.333, paddingRight: 6, fontSize: 24 }}>
          Owner:
        </Col>
        <Col span={16}>
          <Address
            value={owner}
            onChange={newOwner => {
              tx(writeContracts.SmartContractWallet.updateOwner(newOwner, { gasLimit: ethers.utils.hexlify(40000) }));
            }}
          />
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <Card
        title={
          <div>
            {title}
            <div style={{ float: "right", opacity: title ? 0.77 : 0.33 }}>
              <Balance address={contractAddress} provider={props.localProvider} dollarMultiplier={props.price} />
            </div>
          </div>
        }
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!title}
        actions={[
          <div
            onClick={() => {
              tx(writeContracts.SmartContractWallet.withdraw({ gasLimit: ethers.utils.hexlify(40000) }));
            }}
          >
            <UploadOutlined /> Withdraw
          </div>,
          <div
            onClick={() => {
              tx({
                to: contractAddress,
                value: ethers.utils.parseEther("0.001"),
              });
            }}
          >
            <DownloadOutlined /> Deposit
          </div>,
        ]}
      >
        <Meta
          description={
            <div>
              {displayAddress}
              {displayOwner}
            </div>
          }
        />
      </Card>
      <List
        style={{ width: 550, marginTop: 25 }}
        header={
          <div>
            <b>UpdateOwner</b> events
          </div>
        }
        bordered
        dataSource={ownerUpdates}
        renderItem={item => (
          <List.Item style={{ fontSize: 22 }}>
            <Blockies seed={item.oldOwner.toLowerCase()} size={8} scale={2} /> transferred ownership to{" "}
            <Blockies seed={item.newOwner.toLowerCase()} size={8} scale={2} />
          </List.Item>
        )}
      />
      <div style={{ position: "fixed", textAlign: "right", right: 25, top: 90, padding: 10, width: "50%" }}>
        <h1>
          <span role="img" aria-label="checkmark">
            ✅
          </span>{" "}
          TODO LIST
        </h1>
        <Timeline
          localProvider={props.localProvider}
          address={props.address}
          chainIsUp={typeof localBlockNumber !== "undefined"}
          hasOwner={typeof owner !== "undefined"}
          isNotSmoort={title && title.indexOf("Smoort") < 0}
          hasEther={parseFloat(localBalance) > 0}
          contractAddress={contractAddress}
          contractHasEther={parseFloat(contractBalance) > 0}
          amOwnerOfContract={owner === props.address}
        />
      </div>
    </div>
  );
}
