import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Button, Badge, Tabs, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useContractReader, useLocalStorage } from "./hooks";
import { ethers } from "ethers";
import { RelayProvider } from "@opengsn/gsn";
import { Account, Contract } from "./components";
import InkCanvas from "./InkCanvas.js";
import InkInfo from "./InkInfo.js";
import MyNiftyHoldings from "./MyNiftyHoldings.js";
import MyNiftyInks from "./MyNiftyInks.js";
import AllNiftyInks from "./AllNiftyInks.js";
import Holdings from "./Holdings.js";
import AllInks from "./AllInks.js";
import Artist from "./Artist.js";
const { TabPane } = Tabs;

const Web3HttpProvider = require("web3-providers-http");

const isIPFS = require("is-ipfs");
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

  let transactionConfig = {
    address: props.address,
    localProvider: props.kovanProvider,
    injectedProvider: props.injectedProvider,
    injectedGsnSigner: injectedGsnSigner,
    metaSigner: props.metaProvider
  };

  let nftyBalance = useContractReader(
    props.readKovanContracts,
    "NiftyToken",
    "balanceOf",
    [props.address],
    2777
  );
  let nftyMainBalance = useContractReader(
    props.readContracts,
    "NiftyMain",
    "balanceOf",
    [props.address],
    2777
  );
  let inksCreatedBy = useContractReader(
    props.readKovanContracts,
    "NiftyInk",
    "inksCreatedBy",
    [props.address],
    2777
  );
  let totalInks = useContractReader(
    props.readKovanContracts,
    "NiftyInk",
    "totalInks",
    2777
  );
  let upgradePrice = useContractReader(
    props.readKovanContracts,
    "NiftyMediator",
    "relayPrice",
    9999
  );

  let displayBalance;
  if (nftyMainBalance && nftyBalance) {
    displayBalance = Number(nftyMainBalance.toString()) + Number(nftyBalance.toString());
  }
  let displayInksCreated;
  if (inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString();
  }

  const showInk = (newIpfsHash) => {
    console.log(newIpfsHash);
    if (newIpfsHash === ipfsHash) {
      setTab("create");
    } else {
      // window.history.pushState(
      //   { id: newIpfsHash },
      //   newIpfsHash,
      //   "/" + newIpfsHash
      // );
      setViewDrawing();
      setInk({});
      setIpfsHash(newIpfsHash);
      setMode("mint");
      setTab("create");
      setCanvasKey(Date.now());
      return false;
    }
  };

  const newInk = () => {
    if (mode === "mint") {
      window.history.pushState({ id: "draw" }, "draw", "/");
      setMode("edit");
      setIpfsHash();
      setViewDrawing("");
      setInk({});
      setTab("create");
      setCanvasKey(Date.now());
    } else {
      setTab("create");
    }
  };

  const badgeStyle = {
    backgroundColor: "#fff",
    color: "#999",
    boxShadow: "0 0 0 1px #d9d9d9 inset"
  };

  useEffect(() => {
    const loadPage = async () => {
      // let ipfsHashRequest = window.location.pathname.replace("/", "");
      // let urlComponents = window.location.pathname.split("/");
      //
      // if (ipfsHashRequest && isIPFS.multihash(ipfsHashRequest)) {
      //   setMode("mint");
      //   setTab("create");
      //   setIpfsHash(ipfsHashRequest);
      // } else if (urlComponents[1] === "artistt") {
      //   try {
      //     // const newAddress = ethers.utils.getAddress(urlComponents[2]);
      //     // setArtist(newAddress);
      //     setTab("artistt");
      //   } catch (e) {
      //     console.log("not an address");
      //     window.history.pushState({ id: "edit" }, "edit", "/");
      //   }
      // } else {
      //   if (ipfsHashRequest) {
      //     window.history.pushState({ id: "edit" }, "edit", "/");
      //   }
      // }

      let relayHubAddress;
      let stakeManagerAddress;
      let paymasterAddress;
      if (process.env.REACT_APP_NETWORK_NAME === "xdai") {
        relayHubAddress = "0xA58B6fC9264ce507d0B0B477ceE31674341CB27e";
        stakeManagerAddress = "0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B";
        paymasterAddress = "0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC";
      } else if (process.env.REACT_APP_NETWORK_NAME === "sokol") {
        relayHubAddress = "0xA17C8F25668a5748E9B80ED8Ff842f8909258bF6";
        stakeManagerAddress = "0xbE9B5be78bdB068CaE705EdF1c18F061698B6F83";
        paymasterAddress = "0x205091FE2AFAEbCB8843EDa0A8ee28B170aa0619";
      } else {
        relayHubAddress = require("./gsn/RelayHub.json").address;
        stakeManagerAddress = require("./gsn/StakeManager.json").address;
        paymasterAddress = require("./gsn/Paymaster.json").address;
        console.log(
          "local GSN addresses",
          relayHubAddress,
          stakeManagerAddress,
          paymasterAddress
        );
      }

      let newGsnConfig = {
        relayHubAddress,
        stakeManagerAddress,
        paymasterAddress
      };

      newGsnConfig.chainId = 100; //31337
      newGsnConfig.relayLookupWindowBlocks = 1e5;
      newGsnConfig.verbose = true;

      let origProvider;
      if (process.env.REACT_APP_NETWORK_NAME === "xdai") {
        origProvider = new Web3HttpProvider("https://dai.poa.network");
      } else if (process.env.REACT_APP_NETWORK_NAME === "sokol") {
        origProvider = new ethers.providers.InfuraProvider(
          "kovan",
          "9ea7e149b122423991f56257b882261c"
        );
      } else {
        origProvider = new ethers.providers.JsonRpcProvider(
          "http://localhost:8546"
        );
      }
      const gsnProvider = new RelayProvider(origProvider, newGsnConfig);

      const account = await gsnProvider.newAccount();
      let from = account.address;

      const provider = new ethers.providers.Web3Provider(gsnProvider);
      const signer = provider.getSigner(from);

      props.setMetaProvider(signer);
    };
    loadPage();
  }, []);

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
    />
  );

  let accountWithCreateButton = (
    <Link to="create">
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
          <Button
            style={{ marginRight: 8, marginTop: 8 }}
            shape="round"
            size="large"
            type="primary"
            onClick={() => {
              newInk();
            }}
          >
            <span style={{ marginRight: 12 }}>🖌</span>
          </Button>
        </Col>
      </Row>
    </div>
    </Link>
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
      <Row gutter={16} align={"middle"}>
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
      </Row>
    </div>
  );

  let inkInfo = <></>;
  if (mode === "mint") {
    inkInfo = (
      <InkInfo
        address={props.address}
        mainnetProvider={props.mainnetProvider}
        metaProvider={props.metaProvider}
        injectedProvider={props.injectedProvider}
        kovanProvider={props.kovanProvider}
        readContracts={props.readContracts}
        readKovanContracts={props.readKovanContracts}
        ink={ink}
        setInk={setInk}
        ipfsHash={ipfsHash}
        ipfsConfig={ipfsConfig}
        ipfsConfigInfura={ipfsConfigInfura}
        gasPrice={props.gasPrice}
        calculatedVmin={calculatedVmin}
        upgradePrice={upgradePrice}
        transactionConfig={transactionConfig}
        artist={artist}
        setArtist={setArtist}
        setTab={setTab}
      />
    );
  }

  return (
    <div>
      <Tabs
        activeKey={tab}
        onChange={(t) => {
          // window.history.pushState({ id: "draw" }, "draw", "/");
          setTab(t);
        }}
        style={{ marginTop: 0, padding: 8, textAlign: "center" }}
        tabBarExtraContent={""}
        defaultActiveKey="create"
      >

        <TabPane tab={
          <Link to="/allinks">
          <>
            <span
              style={{ fontSize: 24, padding: 8 }}
              role="img"
              aria-label="Artist Palette"
            >
              🎨 Nifty Ink
            </span>
          </>
          </Link>
          }
          key="1">
        </TabPane>

        <TabPane
          disabled={!(nftyBalance && nftyBalance.toString && nftyMainBalance && nftyMainBalance.toString)}
          tab={
            <Link to="/holdings">
            <>
              <span>
                <span style={{ padding: 8 }} role="img" aria-label="Purse">
                  👛
                </span>{" "}
                holdings
              </span>{" "}
              <Badge style={badgeStyle} count={displayBalance} showZero />
            </>
          </Link>
          }
          key="holdings"
        >
        </TabPane>

        <TabPane
          tab={
             <Link to="/create">
            <Button
              style={{ marginBottom: 8 }}
              shape="round"
              size="large"
              type={
                tab === "create" && mode === "edit" ? "secondary" : "primary"
              }
              onClick={() => {
                newInk();
              }}
            >
              <PlusOutlined /> Create
            </Button>
            </Link>
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

        <Route path="/holdings">
            <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <Holdings {...props}
              address={props.address}
            />
            </div>
        </Route>


        <Route path="/create">
              <div>
              <InkCanvas {...props}
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
              {inkInfo}
            </div>
        </Route>

        <Route path="/artist/:address">
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <Artist {...props} />
          </div>
        </Route>

        <Route path="/ink/:hash">
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <InkInfo {...props}
            address={props.address}
            mainnetProvider={props.mainnetProvider}
            metaProvider={props.metaProvider}
            injectedProvider={props.injectedProvider}
            kovanProvider={props.kovanProvider}
            readContracts={props.readContracts}
            readKovanContracts={props.readKovanContracts}
            ink={ink}
            setInk={setInk}
            ipfsHash={ipfsHash}
            ipfsConfig={ipfsConfig}
            ipfsConfigInfura={ipfsConfigInfura}
            gasPrice={props.gasPrice}
            calculatedVmin={calculatedVmin}
            upgradePrice={upgradePrice}
            transactionConfig={transactionConfig}
            artist={artist}
            setArtist={setArtist}
            setTab={setTab}
          />
          </div>
        </Route>

        <Route path="/">
              <div>
              <InkCanvas {...props}
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
              {inkInfo}
            </div>
        </Route>


      </Switch>
    </div>
  );
}
