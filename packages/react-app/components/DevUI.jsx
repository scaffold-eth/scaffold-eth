import React from "react";
import { Button, Row, Col } from "antd";
import { Faucet, Ramp, GasGauge } from ".";
import { NETWORKS } from "../constants";
import { Web3Consumer } from "../helpers/Web3Context";

// todo : Extend to include available contracts on current chain

function DevUI({ web3 }) {
  return (
    <>
      <div style={{ position: "absolute", textAlign: "right", right: 10, top: 50, padding: 10 }}>
        <div>{web3.faucetHint}</div>
      </div>

      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={web3.price} address={web3.address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={web3.gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" style={{ marginTop: 10 }} gutter={[4, 4]}>
          <Col span={24}>{web3.faucetAvailable ? <Faucet {...web3} ensProvider={web3.mainnetProvider} /> : ""}</Col>
        </Row>
      </div>
    </>
  );
}

export default Web3Consumer(DevUI);
