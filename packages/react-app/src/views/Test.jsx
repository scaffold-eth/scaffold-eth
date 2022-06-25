//import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

//import { utils } from "ethers";
//import { SyncOutlined } from "@ant-design/icons";

import { Card, Row, Col, Button, Alert } from "react-bootstrap";

import { Address, Balance, Events } from "../components";

//create a page that says hey
export default function Test({ price }) {
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
                <Card.Title>Card {idx + 1}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Title>Streaming...</Card.Title>
                <Card.Text>
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
