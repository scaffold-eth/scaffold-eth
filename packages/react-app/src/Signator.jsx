import { Button, Card, Checkbox, Input, Radio, Space, Typography } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import ReactJson from "react-json-view";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage, useOnBlock } from "./hooks";

const { Text } = Typography;
const codec = require("json-url")("lzw");

/*
    Welcome to the Signator!
*/

const eip712Example = {
  domain: {
    name: "Demo",
    version: "1",
    chainId: 1,
  },
  types: {
    Person: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "location",
        type: "string",
      },
      {
        name: "dogs",
        type: "int32",
      },
    ],
  },
  primaryType: "Person",
  message: {
    name: "Adam",
    location: "Earth",
    dogs: 1,
  },
};

function Signator({ injectedProvider, mainnetProvider, address }) {
  const [messageText, setMessageText] = useState("hello ethereum");
  const [addDate, setAddDate] = useState(true);
  const [metaData, setMetaData] = useState("time");
  const [messageDate, setMessageDate] = useState(new Date());
  const [hashMessage, setHashMessage] = useState(false);
  const [latestBlock, setLatestBlock] = useState();
  const [signing, setSigning] = useState(false);
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [type, setType] = useLocalStorage("signingType", "message");

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  const searchParams = useSearchParams();
  const history = useHistory();

  const getMessage = () => {
    let _message = addDate ? `${messageDate.toLocaleString("en", { hour12: false })}: ${messageText}` : messageText;

    if (metaData === "time") {
      _message = `${messageDate.toLocaleString("en", { hour12: false })}: ${messageText}`;
    } else if (metaData == "block") {
      _message = `${latestBlock}: ${messageText}`;
    } else {
      _message = messageText;
    }

    if (hashMessage) {
      return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message)); // _message//ethers.utils.hashMessage(_message)
    }
    return _message;
  };

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider.blockNumber}`);
    setLatestBlock(mainnetProvider.blockNumber);
  });

  const signMessage = async () => {
    try {
      setSigning(true);
      const _message = getMessage();
      console.log(`Signing: ${_message}`);
      const injectedSigner = injectedProvider.getSigner();

      let _signature;
      if (type === "typedData") {
        _signature = await injectedSigner._signTypedData(typedData.domain, typedData.types, typedData.message);

        const _compressedData = await codec.compress(typedData);

        searchParams.set("typedData", _compressedData);
      } else if (type === "message") {
        const _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message;

        console.log(_messageToSign, ethers.utils.isBytesLike(_message));

        if (injectedProvider.provider.wc) {
          _signature = await injectedProvider.send("personal_sign", [_messageToSign, address]);
        } else {
          _signature = await injectedSigner.signMessage(_messageToSign);
        }

        searchParams.set("message", _message);
      }
      // console.log(_signature)
      console.log(`Success! ${_signature}`);
      searchParams.set("signatures", _signature);
      searchParams.set("addresses", address);
      history.push(`/view?${searchParams.toString()}`);

      setSigning(false);
    } catch (e) {
      console.log(e);
      setSigning(false);
    }
  };

  return (
    <div className="container">
      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Radio.Group
            value={type}
            buttonStyle="solid"
            size="large"
            onChange={e => {
              setType(e.target.value);
            }}
          >
            <Radio.Button value="message">Message</Radio.Button>
            <Radio.Button value="typedData">Typed Data</Radio.Button>
          </Radio.Group>

          {type === "message" && (
            <>
              <Input.TextArea
                style={{ fontSize: 18 }}
                size="large"
                rows={2}
                value={messageText}
                onChange={e => {
                  setMessageText(e.target.value);
                }}
              />

              <div style={{ marginTop: 20 }}>
                <Space>
                  <Radio.Group
                    value={metaData}
                    buttonStyle="solid"
                    size="large"
                    onChange={e => {
                      setMetaData(e.target.value);
                    }}
                  >
                    <Radio.Button value="time">Time</Radio.Button>
                    <Radio.Button value="block">Block</Radio.Button>
                    <Radio.Button value="none">None</Radio.Button>
                  </Radio.Group>

                  {metaData === "time" && (
                    <Button
                      size="large"
                      onClick={() => {
                        const _date = new Date();
                        setMessageDate(_date);
                      }}
                    >
                      Refresh time
                    </Button>
                  )}
                </Space>
              </div>
              <div style={{ marginTop: 20 }}>
                <Checkbox
                  style={{ fontSize: 18 }}
                  checked={hashMessage}
                  onChange={e => {
                    setHashMessage(e.target.checked);
                  }}
                >
                  Hash message
                </Checkbox>
              </div>

              <Card className="card-border">
                <div
                  style={{
                    fontSize: 18,
                    wordWrap: "break-word",
                    whiteSpace: "pre-line",
                  }}
                >
                  <Text style={{ marginBottom: "0px" }}>{`${getMessage()}`}</Text>
                </div>
              </Card>
            </>
          )}
          {type === "typedData" && (
            <>
              <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener noreferrer">
                Learn more about signing typed data
              </a>
              <Card style={{ textAlign: "left" }} className="card-border">
                <ReactJson
                  src={typedData}
                  onEdit={o => {
                    setTypedData(o.updated_src);
                  }}
                  onAdd={o => {
                    setTypedData(o.updated_src);
                  }}
                  onDelete={o => {
                    setTypedData(o.updated_src);
                  }}
                  enableClipboard={false}
                  displayObjectSize={false}
                  theme="monokai"
                />
              </Card>
            </>
          )}

          <Button
            size="large"
            type="primary"
            onClick={signMessage}
            disabled={!injectedProvider}
            loading={signing}
            style={{ marginTop: 10 }}
          >
            {injectedProvider ? "Sign" : "Connect account to sign"}
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default Signator;
