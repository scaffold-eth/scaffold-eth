import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import {
  Row,
  Popover,
  Button,
  List,
  Form,
  Typography,
  Spin,
  Space,
  Descriptions,
  notification,
} from "antd";
import { AddressInput, Address } from "./components";
import {
  SendOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  SyncOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useContractLoader } from "./hooks";
import {
  getFromIPFS,
  transactionHandler,
} from "./helpers";
import SendInkForm from "./SendInkForm.js";
import LikeButton from "./LikeButton.js";
import NiftyShop from "./NiftyShop.js";
import UpgradeInkButton from "./UpgradeInkButton.js";
import { useQuery } from "react-apollo";
import { INK_QUERY, INK_MAIN_QUERY } from "./apollo/queries";
import ApolloClient, { InMemoryCache } from "apollo-boost";

const mainClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_MAINNET,
  cache: new InMemoryCache(),
});

export default function ViewInk(props) {
  let { hash } = useParams();

  const drawingCanvas = useRef(null);
  const [canvasKey, setCanvasKey] = useState(Date.now());
  const [size, setSize] = useState([
    0.8 * props.calculatedVmin,
    0.8 * props.calculatedVmin,
  ]); //["70vmin", "70vmin"]) //["50vmin", "50vmin"][750, 500]
  const [drawingSize, setDrawingSize] = useState(0);

  const [holders, setHolders] = useState(<Spin />);
  const [minting, setMinting] = useState(false);
  const [buying, setBuying] = useState(false);
  const [mintForm] = Form.useForm();
  const [priceForm] = Form.useForm();
  const [buyButton, setBuyButton] = useState();
  const [mintFlow, setMintFlow] = useState();

  const metaWriteContracts = useContractLoader(
    props.metaProvider ? props.metaProvider : props.kovanProvider
  );

  //  const [inkChainInfo, setInkChainInfo] = useState()
  const [targetId, setTargetId] = useState();
  //  const [inkPrice, setInkPrice] = useState(0)
  //const [mintedCount, setMintedCount] = useState()

  const [inkJson, setInkJson] = useState({});
  const [mainnetTokens, setMainnetTokens] = useState({});
  const [blockNumber, setBlockNumber] = useState(0);
  const [data, setData] = useState();

  const [drawing, setDrawing] = useState();

  const { loading: loadingMain, error: errorMain, data: dataMain } = useQuery(
    INK_MAIN_QUERY,
    {
      variables: { inkUrl: hash },
      pollInterval: 2500,
      client: mainClient,
    }
  );

  const { loading, error, data: dataRaw } = useQuery(INK_QUERY, {
    variables: { inkUrl: hash },
    pollInterval: 2500,
  });

  useEffect(() => {
    const getInk = async (_data) => {
      let _blockNumber = parseInt(_data.metaData.value);
      console.log(blockNumber, _blockNumber);
      if (_blockNumber >= blockNumber) {
        let tIpfsConfig = { ...props.ipfsConfig };
        tIpfsConfig["timeout"] = 10000;
        let newInkJson = await getFromIPFS(_data.ink.jsonUrl, tIpfsConfig);

        setData(_data);
        setBlockNumber(_blockNumber);
        setInkJson(JSON.parse(newInkJson));
      }
    };

    dataRaw && dataRaw.ink ? getInk(dataRaw) : console.log("loading");
  }, [dataRaw, props.address]);

  useEffect(() => {
    if (
      props.address &&
      data &&
      data.ink &&
      props.address.toLowerCase() === data.ink.artist.id &&
      (parseInt(data.ink.count) < parseInt(data.ink.limit) ||
        data.ink.limit === "0")
    ) {
      const mintInkForm = (
        <Row style={{ justifyContent: "center" }}>
          <Form
            form={mintForm}
            layout={"inline"}
            name="mintInk"
            onFinish={mint}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="to"
              rules={[
                {
                  required: true,
                  message: "Which address should receive this artwork?",
                },
              ]}
            >
              <AddressInput
                ensProvider={props.mainnetProvider}
                placeholder={"to address"}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={minting}>
                Mint
              </Button>
            </Form.Item>
          </Form>
        </Row>
      );
      setMintFlow(
        <Popover content={mintInkForm} title="Mint">
          <Button type="secondary">
            <SendOutlined /> Mint
          </Button>
        </Popover>
      );
    }
    data && data.ink
      ? setBuyButton(
          <NiftyShop
            injectedProvider={props.injectedProvider}
            metaProvider={props.metaProvider}
            type={"ink"}
            ink={inkJson}
            itemForSale={hash}
            gasPrice={props.gasPrice}
            address={props.address ? props.address.toLowerCase() : null}
            ownerAddress={data.ink.artist.id}
            priceNonce={data.ink.mintPriceNonce ? data.ink.mintPriceNonce : "0"}
            price={data.ink.mintPrice}
            transactionConfig={props.transactionConfig}
            visible={
              data.ink.count
                ? parseInt(data.ink.count) < parseInt(data.ink.limit) ||
                  data.ink.limit === "0"
                : false
            }
          />
        )
      : console.log("waiting");
  }, [data, props.address, inkJson]);

  useEffect(() => {
    console.log("running dataMain", dataMain);
    if (dataMain) {
      let tempMainnetTokens = {};
      for (let i of dataMain.tokens) {
        console.log(i);
        tempMainnetTokens[i["id"]] = i["owner"];
      }

      setMainnetTokens(tempMainnetTokens);
    }
  }, [dataMain]);

  let mintDescription;
  let inkChainInfoDisplay;
  let detailContent;
  let likeButtonDisplay;
  let detailsDisplay;
  let nextHolders;

  const mint = async (values) => {
    setMinting(true);

    let contractName = "NiftyToken";
    let regularFunction = "mint";
    let regularFunctionArgs = [values["to"], hash];
    let signatureFunction = "mintFromSignature";
    let signatureFunctionArgs = [values["to"], hash];
    let getSignatureTypes = [
      "bytes",
      "bytes",
      "address",
      "address",
      "string",
      "uint256",
    ];
    let getSignatureArgs = [
      "0x19",
      "0x0",
      metaWriteContracts["NiftyToken"].address,
      values["to"],
      hash,
      parseInt(data.ink.count),
    ];

    let mintInkConfig = {
      ...props.transactionConfig,
      contractName,
      regularFunction,
      regularFunctionArgs,
      signatureFunction,
      signatureFunctionArgs,
      getSignatureTypes,
      getSignatureArgs,
    };

    console.log(mintInkConfig);

    const bytecode = await props.transactionConfig.localProvider.getCode(
      values["to"]
    );
    const mainnetBytecode = await props.mainnetProvider.getCode(values["to"]);
    let result;
    if (
      (!bytecode ||
        bytecode === "0x" ||
        bytecode === "0x0" ||
        bytecode === "0x00") &&
      (!mainnetBytecode ||
        mainnetBytecode === "0x" ||
        mainnetBytecode === "0x0" ||
        mainnetBytecode === "0x00")
    ) {
      result = await transactionHandler(mintInkConfig);
      notification.open({
        message: "🙌 Minting successful!",
        description: "👀 Minted to " + values["to"],
      });
    } else {
      notification.open({
        message: "📛 Sorry! Unable to mint to this address",
        description: "This address is a smart contract 📡",
      });
    }

    mintForm.resetFields();
    setMinting(false);
    console.log("result", result);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const viewArtist = (address) => {
    props.setArtist(address);
    props.setTab("inks");
  };

  if (!inkJson || !inkJson.name || !data) {
    inkChainInfoDisplay = (
      <div style={{ marginTop: 32 }}>
        <Spin />
      </div>
    );
  } else {
    const sendInkButton = (tokenOwnerAddress, tokenId) => {
      if (
        props.address &&
        tokenOwnerAddress.toLowerCase() === props.address.toLowerCase()
      ) {
        return (
          <Popover
            content={
              <SendInkForm
                tokenId={tokenId}
                address={props.address}
                mainnetProvider={props.mainnetProvider}
                injectedProvider={props.injectedProvider}
                transactionConfig={props.transactionConfig}
              />
            }
            title="Send Ink"
          >
            <Button type="secondary" style={{ margin: 4, marginBottom: 12 }}>
              <SendOutlined /> Send
            </Button>
          </Popover>
        );
      }
    };

    const relayTokenButton = (relayed, tokenOwnerAddress, tokenId) => {
      if (
        props.address &&
        tokenOwnerAddress.toLowerCase() === props.address.toLowerCase() &&
        relayed === false
      ) {
        return (
          <UpgradeInkButton
            tokenId={tokenId}
            injectedProvider={props.injectedProvider}
            gasPrice={props.gasPrice}
            upgradePrice={props.upgradePrice}
            transactionConfig={props.transactionConfig}
          />
        );
      }
    };

    if (data.ink && data.ink.limit === "0") {
      mintDescription = (data.ink.count ? data.ink.count : "0") + " minted";
    } else if (data.ink) {
      mintDescription =
        (data.ink.count ? data.ink.count : "0") +
        "/" +
        data.ink.limit +
        " minted";
    }

    if (data && data.ink) {
      nextHolders = (
        <Row style={{ justifyContent: "center" }}>
          <List
            header={
              <Row
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <Space>
                  <Typography.Title level={3} style={{ marginBottom: "0px" }}>
                    {mintDescription}
                  </Typography.Title>{" "}
                  {mintFlow}
                  {buyButton}
                </Space>
              </Row>
            }
            itemLayout="horizontal"
            dataSource={data.ink.tokens}
            renderItem={(item) => {
              const openseaButton = (
                <Button
                  type="primary"
                  style={{
                    margin: 8,
                    background: "#722ed1",
                    borderColor: "#722ed1",
                  }}
                  onClick={() => {
                    console.log("item", item);
                    window.open(
                      "https://opensea.io/assets/0xc02697c417ddacfbe5edbf23edad956bc883f4fb/" +
                        item.id
                    );
                  }}
                >
                  <RocketOutlined /> View on OpenSea
                </Button>
              );

              return (
                <List.Item>
                  <Address
                    value={
                      mainnetTokens[item.id]
                        ? mainnetTokens[item.id]
                        : item.owner
                    }
                    ensProvider={props.mainnetProvider}
                  />
                  <a
                    style={{ padding: 8, fontSize: 32 }}
                    href={
                      "https://blockscout.com/poa/xdai/tokens/0xCF964c89f509a8c0Ac36391c5460dF94B91daba5/instance/" +
                      item[1]
                    }
                    target="_blank"
                  >
                    <LinkOutlined />
                  </a>
                  {mainnetTokens[item.id] ? (
                    openseaButton
                  ) : item.network === "mainnet" ? (
                    <Typography.Title level={4} style={{ marginLeft: 16 }}>
                      Upgrading to Ethereum <SyncOutlined spin />
                    </Typography.Title>
                  ) : (
                    <></>
                  )}
                  {sendInkButton(item.owner, item.id)}
                  {relayTokenButton(
                    item.network === "mainnet",
                    item.owner,
                    item.id
                  )}
                  <div style={{ marginLeft: 4, marginTop: 4 }}>
                    <NiftyShop
                      injectedProvider={props.injectedProvider}
                      metaProvider={props.metaProvider}
                      type={"token"}
                      ink={inkJson}
                      itemForSale={item.id}
                      gasPrice={props.gasPrice}
                      address={
                        props.address ? props.address.toLowerCase() : null
                      }
                      ownerAddress={item.owner}
                      price={item.price}
                      visible={!(item.network === "mainnet")}
                      transactionConfig={props.transactionConfig}
                    />
                  </div>
                </List.Item>
              );
            }}
          />
        </Row>
      );

      detailContent = (
        <Descriptions>
          <Descriptions.Item label="Name">{inkJson.name}</Descriptions.Item>
          <Descriptions.Item label="Artist">
            {data.ink.artist.id}
          </Descriptions.Item>
          <Descriptions.Item label="drawingHash">{hash}</Descriptions.Item>
          <Descriptions.Item label="id">{data.ink.inkNumber}</Descriptions.Item>
          <Descriptions.Item label="jsonUrl">
            {data.ink.jsonUrl}
          </Descriptions.Item>
          <Descriptions.Item label="Image">{inkJson.image}</Descriptions.Item>
          <Descriptions.Item label="Count">
            {data.ink.count ? data.ink.count : "0"}
          </Descriptions.Item>
          <Descriptions.Item label="Limit">{data.ink.limit}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {inkJson.description}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            {data.ink.mintPrice > 0
              ? ethers.utils.formatEther(data.ink.mintPrice)
              : "No price set"}
          </Descriptions.Item>
        </Descriptions>
      );

      likeButtonDisplay = (
        <div
          style={{ marginRight: -props.calculatedVmin * 0.8, marginTop: -20 }}
        >
          <LikeButton injectedProvider={props.injectedProvider}
            metaProvider={props.metaProvider}
            metaSigner={props.metaSigner}
            injectedGsnSigner={props.injectedGsnSigner}
            signingProvider={props.injectedProvider}
            localProvider={props.kovanProvider}
            contractAddress={
              props.readKovanContracts
                ? props.readKovanContracts["NiftyInk"]["address"]
                : ""
            }
            targetId={data.ink.inkNumber}
            likerAddress={props.address}
                      fileUrl={data.ink.id}
            transactionConfig={props.transactionConfig}
          />
        </div>
      );

      detailsDisplay = (
        <div
          style={{
            marginLeft: -props.calculatedVmin * 0.77,
            marginTop: -20,
            opacity: 0.5,
          }}
        >
          <Popover content={detailContent} title="Ink Details">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      );

      inkChainInfoDisplay = (
        <>
          <Row style={{ justifyContent: "center", marginTop: -16 }}>
            <Space>
              <Link to={`/artist/${data.ink.artist.id}`}>
                <Typography>
                  <span style={{ verticalAlign: "middle", fontSize: 16 }}>
                    {" artist: "}
                  </span>
                </Typography>
                <Address
                  value={data.ink.artist.id}
                  ensProvider={props.mainnetProvider}
                  clickable={false}
                />
              </Link>
            </Space>
          </Row>
        </>
      );
    }
  }

  let imageFromIpfsToHelpWithNetworking;
  if (inkJson) {
    imageFromIpfsToHelpWithNetworking = (
      <img width={1} height={1} src={inkJson.image} />
    );
  }

  let bottom = (
    <div>
      {likeButtonDisplay}
      {detailsDisplay}
      <div style={{ marginTop: 16, margin: "auto" }}>{inkChainInfoDisplay}</div>

      <div style={{ marginTop: 20 }}>{nextHolders}</div>
      {imageFromIpfsToHelpWithNetworking}
    </div>
  );

  let top = (
    <div>
      <Row
        style={{
          width: "90vmin",
          margin: "0 auto",
          marginTop: "1vh",
          justifyContent: "center",
        }}
      >
        <Typography.Text
          style={{ color: "#222222" }}
          copyable={{ text: inkJson ? inkJson.external_url : "" }}
          style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: 28 }}
        >
          <a href={"/" + hash} style={{ color: "#222222" }}>
            {inkJson ? inkJson.name : <Spin />}
          </a>
        </Typography.Text>

      </Row>
    </div>
  );

  return (
    <div style={{ textAlign: "center" }}>
      {top}
      <div
        style={{
          backgroundColor: "#666666",
          width: size[0],
          margin: "0 auto",
          border: "1px solid #999999",
          boxShadow: "2px 2px 8px #AAAAAA",
        }}
      >
        <img src={inkJson.image} style={{ width: "100%", display: "block"}}/>
      </div>
      {bottom}
    </div>
  );
}
