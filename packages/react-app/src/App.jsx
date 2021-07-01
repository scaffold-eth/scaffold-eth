import { Row, Col, Layout, Space, Divider, Radio, Input } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import React, { useState } from "react";
// import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import axios from "axios";

import { HeaderSt } from "./components";
import { usePoller } from "./hooks";

const { Header, Footer, Content } = Layout;

// 😬 Sorry for all the console logging
// const DEBUG = true;

function App(props) {
  const [gasPrices, setGasPrices] = useState({});
  const [gas, setGas] = useState(0);
  const [gasEth, setGasEth] = useState(0);
  const [gasUsd, setGasUsd] = useState(0);
  const [gasLimit, setGasLimit] = useState(30000);
  const [ethPrice, setEthPrice] = useState(0);

  const ethgasAPI = "https://ethgasstation.info/json/ethgasAPI.json";
  const uniswapV2GQL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
  const ethQL = `{
    bundles (first:1) {
      ethPrice
    }
  }`;

  const getEthPrice = () => {
    axios
      .post(uniswapV2GQL, { query: ethQL })
      .then(response => {
        const { data } = response;
        const {
          data: { bundles },
        } = data;
        if (bundles.length > 0) {
          const ep = parseFloat(bundles[0].ethPrice).toFixed(6);
          setEthPrice(ep);
          calcUsd();
        }
      })
      .catch(error => console.log(error));
  };

  const gasConverter = g => {
    const gm = g * 100000000;
    const gd = parseInt(gm, 10) / 10 ** 9;
    return gd;
  };

  const getGasPrices = () => {
    axios
      .get(ethgasAPI)
      .then(response => {
        const { data } = response;
        const { average, fast, fastest } = data;
        const gasObj = {
          average: gasConverter(average),
          fast: gasConverter(fast),
          fastest: gasConverter(fastest),
        };
        setGasPrices(gasObj);
        setGas(gasObj.fast);
        calcUsd();
      })
      .catch(error => console.log(error));
  };

  const onChangeGas = e => {
    const g = e.target.value;
    // console.log("radio checked --", g);
    setGas(g);
    calcUsd();
  };

  const fromWei = i => {
    return i / 10 ** 18;
  };
  const toGWei = i => {
    return i * 10 ** 9;
  };
  const onChangeGasLimit = e => {
    const g = e.target.value;
    // console.log('value --', g);
    setGasLimit(g);
    calcUsd();
  };

  const calcUsd = () => {
    if (ethPrice < 0 || gas < 0) return;
    const fg = toGWei(gas);
    const gm = fromWei(fg * gasLimit);
    const u = parseFloat(gm * ethPrice).toFixed(6);
    if (gm > 0) setGasEth(gm);
    if (u > 0) setGasUsd(u);
  };

  const init = () => {
    getEthPrice();
    getGasPrices();
  };

  usePoller(init, 10000);

  return (
    <div className="App">
      <Layout>
        <Header
          style={{ padding: 5, position: "fixed", zIndex: 1, width: "100%", height: "auto", top: 0 }}
        >
          <HeaderSt />
          <Space></Space>
        </Header>
        <Content style={{ paddingTop: 150, paddingBottom: 50, width: "100%" }} className="">
          <div
            style={{
              width: 600,
              margin: "auto",
              marginTop: 10,
              paddingTop: 15,
              paddingBottom: 15,
              fontWeight: "bolder",
              borderRadius: 12,
            }}
            class="grad_deeprelief"
          >
            <h3> ⛽️ select gas price speed:</h3>
            <Radio.Group onChange={onChangeGas} value={gas} buttonStyle="solid">
              <Radio.Button
                value={gasPrices && gasPrices.average}
                style={{
                  margin: 10,
                  padding: 15,
                  backgroundColor: "#2FB999",
                  borderRadius: 4,
                  width: "100px",
                  height: "100px",
                }}
              >
                <div style={{ fontSize: 15 }}>average</div>
                <div style={{ fontSize: 20 }}>{gasPrices && gasPrices.average}</div>
              </Radio.Button>
              <Radio.Button
                value={gasPrices && gasPrices.fast}
                style={{
                  margin: 10,
                  padding: 15,
                  backgroundColor: "#0237CC",
                  borderRadius: 4,
                  width: "100px",
                  height: "100px",
                }}
              >
                <div style={{ fontSize: 15 }}>fast</div>
                <div style={{ fontSize: 20 }}>{gasPrices && gasPrices.fast}</div>
              </Radio.Button>
              <Radio.Button
                value={gasPrices && gasPrices.fastest}
                style={{
                  margin: 10,
                  padding: 15,
                  backgroundColor: "#FF558F",
                  borderRadius: 4,
                  width: "100px",
                  height: "100px",
                }}
              >
                <div style={{ fontSize: 15 }}>fastest</div>
                <div style={{ fontSize: 20 }}>{gasPrices && gasPrices.fastest}</div>
              </Radio.Button>
            </Radio.Group>
            <h3>enter gas limit:</h3>
            <Input
              placeholder="input gas limit"
              allowClear
              defaultValue={gasLimit}
              onChange={onChangeGasLimit}
              style={{ width: "50%" }}
            />
            <Divider />
            <h3> 💲 current eth price: {ethPrice}</h3>
            <h3> ⛽️ selected gas : {gas} gwei</h3>
            <h3> ♦ gas cost (eth) : {gasEth}</h3>
            <h3> 💲 gas cost (usd) : {gasUsd}</h3>
          </div>

          <div
            style={{
              width: 600,
              margin: "auto",
              marginTop: 10,
              padding: 10,
              fontWeight: "bolder",
              borderRadius: 12,
            }}
            class="grad_deeprelief"
          >
            <div> ****** </div>
            <div style={{ textAlign: "left" }}>
              Gas: Gas refers to the unit that measures the amount of computational effort required to execute specific
              operations on the Ethereum network.
            </div>
            <div style={{ textAlign: "left" }}>
              Gas Limit: Gas limit refers to the maximum amount of gas you are willing to consume on a transaction. A standard ETH transfer requires a gas limit of 21,000 units of gas.
            </div>
            <div style={{ textAlign: "left" }}>
              Gas Price: Gas price refers to the amount of ether you are willing to pay for every unit of gas, and this is usually measured in 'gwei'.
            </div>
            <div style={{ textAlign: "left" }}>
              reference:{" "}
              <a href="https://ethereum.org/en/developers/docs/gas/" target="_blank" rel="noopener noreferrer">
                https://ethereum.org/en/developers/docs/gas/
              </a>
            </div>
          </div>
        </Content>
        <Footer
          style={{ padding: 5, position: "fixed", zIndex: 1, width: "100%", bottom: 0 }}
          className="grad_glasswater"
        >
          <Row align="middle" gutter={[4, 4]}>
            <Col span={12}>
            </Col>

            <Col span={12} style={{ textAlign: "center" }}>
              <div style={{ opacity: 0.5 }}>
                {/*<a
                  target="_blank"
                  style={{ color: "#000" }}
                  href="https://github.com/austintgriffith/scaffold-eth"
                >
                  🍴 Repo: Fork me!
                </a>
                <br />*/}
                <a
                  target="_blank"
                  style={{ color: "#000" }}
                  href="https://github.com/austintgriffith/scaffold-eth/tree/gas-calculator"
                >
                  🍴 Repo: Fork me!
                </a>
              </div>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
