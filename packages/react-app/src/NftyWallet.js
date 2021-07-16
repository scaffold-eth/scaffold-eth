import React, { useState, useRef, useEffect } from "react";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { Button, Badge, Tabs, Row, Col, Drawer, Layout, Menu } from "antd";
import { MenuOutlined } from '@ant-design/icons';
import { PlusOutlined } from "@ant-design/icons";
import { useContractReader, useLocalStorage } from "./hooks";
import { RelayProvider } from "@opengsn/gsn";
import { Account, Faucet } from "./components";
import { createClient } from '@supabase/supabase-js'
import Holdings from "./Holdings.js";
import AllInks from "./AllInks.js";
import Artist from "./Artist.js";
import Leaderboard from "./Leaderboard.js";
import CreateInk from "./CreateInk.js";
import ViewInk from "./ViewInk.js";
import Help from "./Help.js";
import Explore from "./Explore.js";
const { TabPane } = Tabs;

const { Header, Content } = Layout;

const Web3HttpProvider = require("web3-providers-http");

const ipfsConfigInfura = {
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  timeout: 250000
};
const ipfsConfig = {
  host: "ipfs.nifty.ink",
  port: "3001",
  protocol: "https",
  timeout: 250000
};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
let supabase

export default function NftyWallet(props) {
  const calculatedVmin = Math.min(
    window.document.body.clientHeight,
    window.document.body.clientWidth
  );

  const [tab, setTab] = useState("explore");

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

  if(process.env.REACT_APP_SUPABASE_KEY) {
    supabase = createClient(supabaseUrl, supabaseKey)
  }

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
    7123
  );

  let nftyMainBalance = useContractReader(
    props.readContracts,
    "NiftyMain",
    "balanceOf",
    [props.address],
    10011
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
      </Row>
    </div>
  );

  let menuFontSize = 24
  let menuButtonStyle = {border:"0px", fontSize: menuFontSize}

  return (
    <Layout style={{background: "#fff"}}>
    <Header className="header" style={{background: "#fff", textAlign:'center', padding:0}}>
      <Menu mode="horizontal" overflowedIndicator={<MenuOutlined style={{fontSize:menuFontSize}} />} defaultSelectedKeys={[tab]} style={{fontSize: menuFontSize}}
        onClick={({key}) => {
                console.log(key)
                setTab(key);
              }}>
        <Menu.Item key="explore">
          <NavLink to="/explore">
            <span
              style={{ fontSize: 24, padding: 8 }}
              role="img"
              aria-label="Artist Palette"
            >
              🎨 Nifty Ink
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="create">
          <NavLink to="/create">
             <span style={{ marginRight: 12 }}>🖌</span> create
         </NavLink>
        </Menu.Item>
        <Menu.Item key="artist" disabled={!props.address}>
          <NavLink to={"/artist/"+props.address}>
            <span>
              <span style={{ padding: 8 }} role="img" aria-label="Painting">
                🖼
              </span>{" "}
              inks
            </span>{" "}
          </NavLink>
        </Menu.Item>
        <Menu.Item key="holdings">
          <NavLink to={"/holdings/"+props.address}>
            <span>
              <span style={{ padding: 8 }} role="img" aria-label="Purse">
                👛
              </span>{" "}
              holdings
            </span>{" "}
            <Badge style={badgeStyle} count={displayBalance} showZero />
          </NavLink>
        </Menu.Item>
        <Menu.Item key="leaderboard">
          <NavLink to={"/leaderboard"}>
            <span>
              <span style={{ padding: 8 }} role="img" aria-label="Trophy">
              🏆
              </span>
              leaderboard
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="help">
          <Button
            style={menuButtonStyle}
            size="large"
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
        </Menu.Item>
        <Menu.Item key="chat">
          <Button
            style={menuButtonStyle}
            size="large"
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
        </Menu.Item>
        <Menu.Item key="about">
          <Button
            style={menuButtonStyle}
            size="large"
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
        </Menu.Item>
      </Menu>
    </Header>
    <Content style={{background: "#fff", padding: 20}}>
    <div>

      {accountWithCreateButton}

      <Switch>

        <Route path="/explore">
          <Explore
            metaProvider={props.metaProvider}
            metaSigner={props.metaSigner}
            injectedGsnSigner={injectedGsnSigner}
            signingProvider={props.injectedProvider}
            localProvider={props.kovanProvider}
            contractAddress={props.readKovanContracts?props.readKovanContracts['NiftyInk']['address']:''}
            address={props.address}
            transactionConfig={transactionConfig}
            supabase={supabase}
            ipfsConfig={ipfsConfig}
          />
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
          <Artist {...props} supabase={supabase} />
        </Route>

        <Route path="/leaderboard">
          <Leaderboard {...props} supabase={supabase} />
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
              <Redirect to="/explore" />
        </Route>

        <Route path="/allinks">
              <Redirect to="/explore" />
              {/*<AllInks />*/}
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
      <Help injectedProvider={props.injectedProvider} />
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
    </Content>
    </Layout>
  );
}
