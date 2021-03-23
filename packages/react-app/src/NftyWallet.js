import React, { useState, useRef, useEffect } from "react";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { Button, Badge, Tabs, Row, Col, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useContractReader, useLocalStorage } from "./hooks";
import { RelayProvider } from "@opengsn/gsn";
import { Account, Faucet } from "./components";
import Holdings from "./Holdings.js";
import AllInks from "./AllInks.js";
import Artist from "./Artist.js";
import CreateInk from "./CreateInk.js";
import ViewInk from "./ViewInk.js";
import Help from "./Help.js";
const { TabPane } = Tabs;

const Web3HttpProvider = require("web3-providers-http");

const ipfsConfigInfura = {
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https"
};
const ipfsConfig = {
  host: "ipfs.nifty.ink",
  port: "3001",
  protocol: "https",
  timeout: 2500
};

export default function NftyWallet(props) {
  const calculatedVmin = Math.min(
    window.document.body.clientHeight,
    window.document.body.clientWidth
  );

  const [tab, setTab] = useState("create");

  const [mode, setMode] = useState("edit");

  const [drawing, setDrawing] = useLocalStorage("drawing");
  const [viewDrawing, setViewDrawing] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ink, setInk] = useState({});
  const [renderKey, setRenderKey] = useState(Date.now());
  const [canvasKey, setCanvasKey] = useState(Date.now());

  const [injectedGsnSigner, setInjectedGsnSigner] = useState();

  const [artist, setArtist] = useState();
  const [drawerVisibility, setDrawerVisibility] = useState(false)

  const transactionConfig = useRef({})

  useEffect(()=> {
    transactionConfig.current = {
      address: props.address,
      localProvider: props.kovanProvider,
      injectedProvider: props.injectedProvider,
      injectedGsnSigner: injectedGsnSigner,
      metaSigner: props.metaProvider
    }
  },[props.address, props.kovanProvider, props.injectedProvider, injectedGsnSigner, props.metaProvider])



  let nftyBalance = useContractReader(
    props.readKovanContracts,
    "NiftyToken",
    "balanceOf",
    [props.address],
    4500
  );

  let nftyMainBalance = useContractReader(
    props.readContracts,
    "NiftyMain",
    "balanceOf",
    [props.address],
    6555
  );

  let upgradePrice = useContractReader(
    props.readKovanContracts,
    "NiftyMediator",
    "relayPrice",
    19999
  );

  let displayBalance;
  if (nftyMainBalance && nftyBalance) {
    displayBalance = Number(nftyMainBalance.toString()) + Number(nftyBalance.toString());
  }

  const showDrawer = () => {
    setDrawerVisibility(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisibility(false);
  };

  const badgeStyle = {
    backgroundColor: "#fff",
    color: "#999",
    boxShadow: "0 0 0 1px #d9d9d9 inset"
  };

  let accountDisplay = (
    <Account
      address={props.address}
      setAddress={props.setAddress}
      localProvider={props.kovanProvider}
      injectedProvider={props.injectedProvider}
      setInjectedProvider={props.setInjectedProvider}
      setInjectedGsnSigner={setInjectedGsnSigner}
      mainnetProvider={props.mainnetProvider}
      price={props.price}
      minimized={props.minimized}
      setMetaProvider={props.setMetaProvider}
      metaProvider={props.metaProvider}
    />
  );

  let accountWithCreateButton = (
    <div
      style={{
        zIndex: 99,
        position: "fixed",
        textAlign: "right",
        right: 0,
        bottom: 20,
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 16
      }}
    >
      <Row gutter={16} align={"middle"}>
        <Col>{accountDisplay}</Col>

        <Col>
        <NavLink to="create">
          <Button
            style={{ marginRight: 8, marginTop: 8 }}
            shape="round"
            size="large"
            type="primary"
          >
            <span style={{ marginRight: 12 }}>🖌</span>
          </Button>
        </NavLink>
        </Col>
      </Row>
    </div>
  );

  let supportButton = (
    <div
      style={{
        zIndex: 99,
        position: "fixed",
        textAlign: "left",
        left: 0,
        bottom: 20,
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 16
      }}
    >
      <Row gutter={4} align={"middle"}>
        <Col>
          <Button
            style={{ marginRight: 8, marginTop: 8 }}
            shape="round"
            size="large"
            type="secondary"
            onClick={() => {
              window.open("https://t.me/joinchat/KByvmRpuA2XzQVYXWICiSg");
            }}
          >
            <span
              style={{ marginRight: 12 }}
              role="img"
              aria-label="Speech Bubble"
            >
              💬
            </span>
            Chat
          </Button>
        </Col>

        <Col>
          <Button
            style={{ marginRight: 8, marginTop: 8 }}
            shape="round"
            size="large"
            type="secondary"
            onClick={() => {
              window.open(
                "https://medium.com/@austin_48503/nifty-ink-an-ethereum-tutorial-c860a4904cb2"
              );
            }}
          >
            <span
              style={{ marginRight: 12 }}
              role="img"
              aria-label="Face with Monocle"
            >
              🧐
            </span>
            About
          </Button>
        </Col>
        <Col>
          <Button
            style={{ marginRight: 8, marginTop: 8 }}
            shape="round"
            size="large"
            type="secondary"
            onClick={showDrawer}
          >
            <span
              style={{ marginRight: 12 }}
              role="img"
              aria-label="Light Bulb"
            >
              💡
            </span>
            Help
          </Button>
        </Col>
      </Row>
    </div>
  );

  return (
    <div>
      <Tabs
        activeKey={tab}
        onChange={(t) => {
          setTab(t);
        }}
        style={{ marginTop: 0, padding: 8, textAlign: "center" }}
        tabBarExtraContent={""}
        defaultActiveKey="create"
      >

        <TabPane tab={
          <NavLink to="/allinks">
          <>
            <span
              style={{ fontSize: 24, padding: 8 }}
              role="img"
              aria-label="Artist Palette"
            >
              🎨 Nifty Ink
            </span>
          </>
          </NavLink>
          }
          key="1">
        </TabPane>

        <TabPane
          disabled={!props.address}
          tab={
            <NavLink to={"/artist/"+props.address}>
            <>
              <span>
                <span style={{ padding: 8 }} role="img" aria-label="Painting">
                  🖼
                </span>{" "}
                inks
              </span>{" "}
            </>
          </NavLink>
          }
          key="inks"
        >
        </TabPane>

        <TabPane
          disabled={!(nftyBalance && nftyBalance.toString && nftyMainBalance && nftyMainBalance.toString)}
          tab={
            <NavLink to={"/holdings/"+props.address}>
            <>
              <span>
                <span style={{ padding: 8 }} role="img" aria-label="Purse">
                  👛
                </span>{" "}
                holdings
              </span>{" "}
              <Badge style={badgeStyle} count={displayBalance} showZero />
            </>
          </NavLink>
          }
          key="holdings"
        >
        </TabPane>

        <TabPane
          tab={
             <NavLink to="/create">
            <Button
              style={{ marginBottom: 8 }}
              shape="round"
              size="large"
              type={
                tab === "create" && mode === "edit" ? "secondary" : "primary"
              }
            >
              <PlusOutlined /> Create
            </Button>
            </NavLink>
          }
          key="4"
        >
        </TabPane>

      </Tabs>

      {supportButton}
      {accountWithCreateButton}

      <Switch>
        <Route path="/allinks">
          <AllInks />
        </Route>

        <Route path="/holdings/:address">
            <Holdings {...props}
              address={props.address}
              transactionConfig={transactionConfig}
              upgradePrice={upgradePrice}
            />
        </Route>

        <Route path="/holdings">
            <Holdings {...props}
              address={props.address}
              transactionConfig={transactionConfig}
              upgradePrice={upgradePrice}
            />
        </Route>

        <Route path="/artist/:address">
          <Artist {...props} />
        </Route>

        <Route path="/create">
              <div>
              <CreateInk {...props}
              key={renderKey}
              canvasKey={canvasKey}
              address={props.address}
              mainnetProvider={props.mainnetProvider}
              injectedProvider={props.injectedProvider}
              metaProvider={props.metaProvider}
              kovanProvider={props.kovanProvider}
              readKovanContracts={props.readKovanContracts}
              mode={mode}
              ink={ink}
              ipfsHash={ipfsHash}
              setMode={setMode}
              setIpfsHash={setIpfsHash}
              setInk={setInk}
              drawing={drawing}
              setDrawing={setDrawing}
              viewDrawing={viewDrawing}
              setViewDrawing={setViewDrawing}
              ipfsConfig={ipfsConfig}
              ipfsConfigInfura={ipfsConfigInfura}
              gasPrice={props.gasPrice}
              calculatedVmin={calculatedVmin}
              transactionConfig={transactionConfig}
              />
            </div>
        </Route>

        <Route path="/ink/:hash">
              <div>
              <ViewInk {...props}
              address={props.address}
              artist={artist}
              calculatedVmin={calculatedVmin}
              canvasKey={canvasKey}
              drawing={drawing}
              gasPrice={props.gasPrice}
              injectedProvider={props.injectedProvider}
              ink={ink}
              ipfsConfig={ipfsConfig}
              ipfsConfigInfura={ipfsConfigInfura}
              ipfsHash={ipfsHash}
              key={renderKey}
              kovanProvider={props.kovanProvider}
              mainnetProvider={props.mainnetProvider}
              metaProvider={props.metaProvider}
              readContracts={props.readContracts}
              readKovanContracts={props.readKovanContracts}
              setArtist={setArtist}
              setDrawing={setDrawing}
              setInk={setInk}
              setIpfsHash={setIpfsHash}
              setMode={setMode}
              setTab={setTab}
              setViewDrawing={setViewDrawing}
              transactionConfig={transactionConfig}
              upgradePrice={upgradePrice}
              viewDrawing={viewDrawing}
              />
            </div>
        </Route>

        <Route path="/:hash(Qm[A-Z]\w+)"
        render={props => (
              <Redirect to={`/ink/${props.match.params.hash}`} />
            )}
        />

        <Route path="/">
              <Redirect to="/create" />
        </Route>

      </Switch>
      <Drawer
        title="How to use"
        width={520}
        onClose={onCloseDrawer}
        visible={drawerVisibility}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right"
            }}
          >
            <button onClick={onCloseDrawer} style={{ marginRight: 8 }}>
              Close
            </button>
          </div>
        }
      >
      <Help/>
      {process.env.REACT_APP_NETWORK_NAME ? (
        ""
      ) : (
        <>
          <Col>
            <Faucet
              localProvider={props.kovanProvider}
              placeholder={"sidechain faucet"}
              price={props.price}
            />
          </Col>
        </>
      )}
      </Drawer>
    </div>
  );
}
