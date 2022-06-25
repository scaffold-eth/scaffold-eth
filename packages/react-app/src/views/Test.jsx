//import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

//import { utils } from "ethers";
//import { SyncOutlined } from "@ant-design/icons";

import { Card, Row, Col, Button, Alert } from "react-bootstrap";

import { Address, Balance, Events } from "../components";

import { ethers } from "ethers";

//create a page that says hey
export default function Test({ price, address, readContracts, mainnetProvider }) {
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
                    <Button variant="primary">Primary</Button>
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
