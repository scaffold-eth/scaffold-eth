import React from "react";
import { Row, Col } from "antd";
import { Ramp, GasGauge } from ".";
import { NETWORKS } from "../constants";
import { Web3Consumer } from "../helpers/Web3Context";

function ETHStats({ web3 }) {
  return (
    <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 8, padding: 10 }}>
      <Row align="middle" gutter={[6]}>
        <Col span={14}>
          <Ramp price={web3.price} address={web3.address} networks={NETWORKS} />
        </Col>

        <Col span={8}>
          <GasGauge gasPrice={web3.gasPrice} />
        </Col>
      </Row>
    </div>
  );
}

export default Web3Consumer(ETHStats);
