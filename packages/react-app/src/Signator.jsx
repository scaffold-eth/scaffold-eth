import { Alert, Button, Card, Checkbox, Input, notification, Radio, Space, Typography } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage, useOnBlock } from "./hooks";

const { Text } = Typography;
const codec = require("json-url")("lzw");

/*
    Welcome to the Signator!
*/

const eip712Example = {
  types: {
    Greeting: [
      {
        name: "salutation",
        type: "string",
      },
      {
        name: "target",
        type: "string",
      },
      {
        name: "born",
        type: "int32",
      },
    ],
  },
  message: {
    salutation: "Hello",
    target: "Ethereum",
    born: 2015,
  },
};

function Signator({ injectedProvider, mainnetProvider, address, loadWeb3Modal }) {
  const [messageText, setMessageText] = useLocalStorage("messageText","hello ethereum");
  // const [metaData, setMetaData] = useState("none");
  // const [messageDate, setMessageDate] = useState(new Date());
  const [hashMessage, setHashMessage] = useState(false);
  const [latestBlock, setLatestBlock] = useState();
  const [signing, setSigning] = useState(false);
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [manualTypedData, setManualTypedData] = useLocalStorage("manualTypedData");
  const [invalidJson, setInvalidJson] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "message");
  const [typedDataChecks, setTypedDataChecks] = useState({});

  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  const searchParams = useSearchParams();
  const history = useHistory();

  const getMessage = () => {
    const _message = messageText;

    /*
    if (metaData === "time") {
      _message = `${messageDate.toLocaleString()}: ${messageText}`;
    } else if (metaData == "block") {
      _message = `${latestBlock}: ${messageText}`;
    } else {
      _message = messageText;
    }
    */

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

  useEffect(() => {
    if (typedData) {
      const _checks = {};
      _checks.domain = "domain" in typedData;
      _checks.types = "types" in typedData;
      _checks.message = "message" in typedData;
      let _hash;
      try {
        _hash = ethers.utils._TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.message);
        _checks.hash = _hash;
      } catch (e) {
        console.log("failed to compute hash", e);
      }
      setTypedDataChecks(_checks);
    }
  }, [typedData]);

  const signMessage = async (sign = true) => {
    try {
      setSigning(true);
      const _message = getMessage();
      if (sign) console.log(`Signing: ${_message}`);

      const injectedSigner = sign && injectedProvider.getSigner();

      let _signature;
      if (type === "typedData") {
        const _typedData = { ...typedData };
        if (!_typedData.domain) _typedData.domain = {};
        if (!_typedData.domain.chainId) _typedData.domain.chainId = 1;

        if (sign)
          _signature = await injectedSigner._signTypedData(_typedData.domain, _typedData.types, _typedData.message);
        const _compressedData = await codec.compress(_typedData);

        searchParams.set("typedData", _compressedData);
      } else if (type === "message") {
        //const _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message;

        console.log(_message, ethers.utils.isBytesLike(_message));
        if(sign) _signature = await injectedProvider.send("personal_sign", [_message, address]);
        //_signature = await injectedSigner.signMessage(_messageToSign);

        searchParams.set("message", _message);
      }
      // console.log(_signature)
      console.log(`Success! ${_signature}`);
      if (sign) {
        searchParams.set("signatures", _signature);
        searchParams.set("addresses", address);
      }
      history.push(`/view?${searchParams.toString()}`);

      setSigning(false);
    } catch (e) {
      console.log(e);
      setSigning(false);
      if (e.message.indexOf('Provided chainId "100" must match the active chainId "1"') !== -1) {
        notification.open({
          message: "Incorrect network selected",
          description: `Error: ${e.message}`,
        });
      }
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

              <div>
                <Space>
                  {/* <Radio.Group
                    value={metaData}
                    buttonStyle="solid"
                    size="large"
                    onChange={e => {
                      setMetaData(e.target.value);
                    }}
                  >
                    <Radio.Button value="time">Time</Radio.Button>
                    <Radio.Button value="block" disabled={!latestBlock}>Block</Radio.Button>
                    <Radio.Button value="none">None</Radio.Button>
                  </Radio.Group> */}

                  <Button
                    size="large"
                    onClick={() => {
                      const _date = new Date();
                      setMessageText(`${_date.toLocaleString()}: ${messageText}`);
                    }}
                  >
                    Add time
                  </Button>
                  <Checkbox
                    style={{ fontSize: 18 }}
                    checked={hashMessage}
                    onChange={e => {
                      setHashMessage(e.target.checked);
                    }}
                  >
                    Hash message
                  </Checkbox>
                </Space>
              </div>

              {hashMessage && (
                <Card className="card-border">
                  <div
                    style={{
                      fontSize: 14,
                      wordWrap: "break-word",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <Text style={{ marginBottom: "0px" }}>{`${getMessage()}`}</Text>
                  </div>
                </Card>
              )}
            </>
          )}
          {type === "typedData" && (
            <>
              <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener noreferrer">
                Learn more about signing typed data
              </a>
              <Card style={{ textAlign: "left" }} className="card-border">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input.TextArea
                    size="large"
                    autoSize={{ minRows: 2 }}
                    value={manualTypedData || JSON.stringify(typedData)}
                    onChange={e => {
                      try {
                        setManualTypedData(e.target.value);
                        const _newTypedData = JSON.parse(e.target.value);
                        setTypedData(_newTypedData);
                        setInvalidJson(false);
                      } catch (error) {
                        console.log(error);
                        setInvalidJson(true);
                        setTypedDataChecks({});
                      }
                    }}
                  />
                  {invalidJson && <Alert message="Invalid Json" type="error" />}
                  {/* typedDataChecks.domain===false&&<Alert message="No domain specified" type="info" /> */}
                  {typedDataChecks.types === false && <Alert message="Missing types" type="error" />}
                  {typedDataChecks.message === false && <Alert message="Missing message" type="error" />}
                  {!invalidJson && !typedDataChecks.hash && <Alert message="Invalid input data" type="error" />}
                  <div>
                    <Button
                      onClick={() => {
                        setManualTypedData(JSON.stringify(typedData, null, "\t"));
                      }}
                      disabled={invalidJson}
                    >
                      {" "}
                      Prettify
                    </Button>
                    <Button
                      onClick={() => {
                        setManualTypedData(JSON.stringify(eip712Example, null, "\t"));
                        setTypedData(eip712Example);
                        setInvalidJson(false);
                      }}
                    >
                      {" "}
                      Reset
                    </Button>
                  </div>
                </Space>
              </Card>
            </>
          )}

          <Space>
            <Button
              size="large"
              type="primary"
              onClick={injectedProvider ? signMessage : loadWeb3Modal}
              disabled={(type === "typedData" && (!typedDataChecks.hash || invalidJson))}
              loading={signing}
              style={{ marginTop: 10 }}
            >
              {injectedProvider ? "Sign" : "Connect account to sign"}
            </Button>
            <Button
              size="large"
              onClick={() => {
                signMessage(false);
              }}
              disabled={signing || invalidJson}
              style={{ marginTop: 10 }}
            >
              Create message
            </Button>
            {signing && (
              <Button
                size="large"
                onClick={() => {
                  setSigning(false);
                }}
                style={{ marginTop: 10 }}
              >
                Cancel
              </Button>
            )}
          </Space>
        </Space>
      </Card>
    </div>
  );
}

export default Signator;
