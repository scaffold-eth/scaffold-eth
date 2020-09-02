import React, { useState } from "react";
import { Button, Modal, Divider } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";

export default function Ramp(props) {
  const [modalUp, setModalUp] = useState("down");

  const type = "default";

  return (
    <div>
      <Button
        size="large"
        shape="round"
        onClick={() => {
          setModalUp("up");
        }}
      >
        <DollarCircleOutlined style={{ color: "#52c41a" }} /> {props.price.toFixed(2)}
      </Button>
      <Modal
        title="Get ETH and LINK"
        visible={modalUp === "up"}
        onCancel={() => {
          setModalUp("down");
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalUp("down");
            }}
          >
            cancel
          </Button>,
        ]}
      >
        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://faucet.rinkeby.io/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="rinkeby">
              🟨
            </span>{" "}
            Rinkeby-ETH
          </Button>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://rinkeby.chain.link/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="rinkeby">
              🟨
            </span>{" "}
            Rinkeby-LINK
          </Button>
        </p>

        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://faucet.ropsten.be/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="ropsten">
              🟠
            </span>{" "}
            Ropsten-ETH
          </Button>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://ropsten.chain.link/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="ropsten">
              🟠
            </span>{" "}
            Ropsten-LINK
          </Button>
        </p>

        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://faucet.kovan.network/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="kovan">
              🟣
            </span>{" "}
            Kovan-ETH
          </Button>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://kovan.chain.link/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="kovan">
              🟣
            </span>{" "}
            Kovan-LINK
          </Button>
        </p>

        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open("https://faucet.goerli.mudit.blog/");
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="goerli">
              🔵
            </span>{" "}
            Goerli-ETH
          </Button>
        </p>
        <Divider />
      </Modal>
    </div>
  );
}
