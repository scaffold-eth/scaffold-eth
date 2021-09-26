import React from "react";
import { Row, Col, Button } from "antd";
import { Account, Ramp, GasGauge, Faucet, ThemeSwitch } from ".";
import { NETWORKS } from "../constants";
import { Web3Consumer } from "../helpers/Web3Context";

function DevUI({ web3 }) {
  return (
    <>
      {web3.networkDisplay}
      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account {...web3} />
        {web3.faucetHint}
      </div>

      <ThemeSwitch />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 8, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp {...web3} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge {...web3} />
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
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              web3.faucetAvailable ? <Faucet {...web3} ensProvider={web3.mainnetProvider} /> : ""
            }
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Web3Consumer(DevUI);
