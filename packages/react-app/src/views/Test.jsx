//import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

//import { utils } from "ethers";
//import { SyncOutlined } from "@ant-design/icons";

import { Card, Row, Col, Button, Alert } from "react-bootstrap";

import { Address, Balance, Events } from "../components";

import { INFURA_ID } from "../constants";

import { ethers } from "ethers";

import { Framework } from "@superfluid-finance/sdk-core";

// Ethers.js provider initialization
const customHttpProvider = new ethers.providers.InfuraProvider("rinkeby", INFURA_ID);

//where the Superfluid logic takes place
async function createNewFlow(recipient, flowRate, provider) {
  const sf = await Framework.create({
    chainId: 4,
    provider: provider,
  });

  const signer = sf.createSigner({
    privateKey: "ae4b6f52bfbdeadbca2901f6776c0411bdff7b482192fb6743d755a52a1995c3",
    provider: provider,
  });

  const ETHxContraactAddress = await sf.loadSuperToken("ETHx");
  const ETHx = ETHxContraactAddress.address;

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: ETHx,
      gasLimit: 1000000000000,
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Goerli
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `,
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!",
    );
    console.error(error);
  }
}

//create a page that says hey
export default function Test({ price, address, readContracts, mainnetProvider, sf }) {
  console.log("Test");
  console.log(sf);
  return (
    <div>
      <Alert variant="success">
        <Alert.Heading>!</Alert.Heading>
        <p>:)</p>
      </Alert>

      <Row xs={1} md={2} className="g-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>Stream {idx + 1}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Title className="d-flex justify-content-start">
                  <Address
                    address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  />
                </Card.Title>
                <Card.Text className="d-flex justify-content-evenly">
                  <div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        createNewFlow(
                          "0xFC394bB8811bE6Da8f3B345CD8885E3802Ea1698",
                          //readContracts && readContracts.YourContract ? readContracts.YourContract.address : null,
                          "40000000000",
                          customHttpProvider,
                        )
                      }
                    >
                      Create Stream
                    </Button>
                  </div>
                  ${price}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">test</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
