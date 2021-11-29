import { Alert, Button, Card, Checkbox, Input, notification, Radio, Space, Typography, Collapse, Select } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLocalStorage } from "./hooks";
import { AddressInput } from "./components";

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
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

function Signator({ injectedProvider, address, loadWeb3Modal, chainList, mainnetProvider }) {
  const [messageText, setMessageText] = useLocalStorage("messageText", "hello ethereum");
  // const [metaData, setMetaData] = useState("none");
  // const [messageDate, setMessageDate] = useState(new Date());
  const [hashMessage, setHashMessage] = useState(false);
  // const [latestBlock, setLatestBlock] = useState();
  const [signing, setSigning] = useState(false);
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [manualTypedData, setManualTypedData] = useLocalStorage(
    "manualTypedData",
    JSON.stringify(eip712Example, null, "\t"),
  );
  const [invalidJson, setInvalidJson] = useState(false);
  const [type, setType] = useLocalStorage("signingType", "message");
  const [typedDataChecks, setTypedDataChecks] = useState({});
  const [chainId, setChainId] = useState(
    typedData && typedData.domain && typedData.domain.chainId ? parseInt(typedData.domain.chainId, 10) : 1,
  );
  const [action, setAction] = useState("sign");
  const [manualSignature, setManualSignature] = useState();
  const [manualAddress, setManualAddress] = useState();

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
  /*
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider.blockNumber}`);
    setLatestBlock(mainnetProvider.blockNumber);
  });
  */

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

  const signMessage = async () => {
    try {
      setSigning(true);

      const injectedSigner = action === "sign" && injectedProvider.getSigner();

      let _signature;
      if (type === "typedData") {
        const _typedData = { ...typedData };
        if (!_typedData.domain && action !== "verify") _typedData.domain = {};
        if (!_typedData.domain.chainId && action !== "verify") _typedData.domain.chainId = chainId;
        console.log(`${action}: ${_typedData}`);

        if (action === "sign")
          _signature = await injectedSigner._signTypedData(_typedData.domain, _typedData.types, _typedData.message);
        const _compressedData = await codec.compress(_typedData);

        searchParams.set("typedData", _compressedData);
      } else if (type === "message") {
        // const _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message;
        const _message = getMessage();
        console.log(`${action}: ${_message}`);
        if (action === "sign") _signature = await injectedProvider.send("personal_sign", [_message, address]);
        // _signature = await injectedSigner.signMessage(_messageToSign);

        searchParams.set("message", _message);
      }
      // console.log(_signature)

      if (action === "sign") console.log(`Success! ${_signature}`);

      if (action === "sign") {
        searchParams.set("signatures", _signature);
        searchParams.set("addresses", address);
      } else if (action === "verify") {
        searchParams.set("signatures", manualSignature);
        searchParams.set("addresses", manualAddress);
      }

      history.push(`/view?${searchParams.toString()}`);

      setSigning(false);
    } catch (e) {
      console.log(e);
      setSigning(false);
      if (e.message.indexOf("Provided chainId") !== -1) {
        notification.open({
          message: "Incorrect network selected in Metamask",
          description: `${chainId && `Select ${chainList.find(element => element.chainId === chainId).name}`}. Error: ${
            e.message
          }`,
        });
      }
    }
  };

  return (
    <div className="container">
      <Card>
        {type === "message" && (
          <Input.TextArea
            style={{ fontSize: 18 }}
            size="large"
            autoSize={{ minRows: 1 }}
            value={messageText}
            onChange={e => {
              setMessageText(e.target.value);
            }}
          />
        )}

        {type === "typedData" && (
          <>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input.TextArea
                size="large"
                autoSize={{ minRows: 2 }}
                value={manualTypedData}
                onChange={e => {
                  try {
                    setManualTypedData(e.target.value);
                    const _newTypedData = JSON.parse(e.target.value);
                    setTypedData(_newTypedData);
                    setInvalidJson(false);
                    if (_newTypedData.domain && _newTypedData.domain.chainId) {
                      setChainId(parseInt(_newTypedData.domain.chainId, 10));
                    }
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
              {!invalidJson && !typedDataChecks.hash && <Alert message="Invalid EIP-712 input data" type="error" />}
            </Space>
          </>
        )}

        <Collapse ghost>
          <Panel header="Advanced" key="1">
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
                  <Space>
                    <Button
                      size="large"
                      onClick={() => {
                        setManualTypedData(JSON.stringify(typedData, null, "\t"));
                      }}
                      disabled={invalidJson}
                    >
                      {" "}
                      Prettify
                    </Button>
                    <Button
                      size="large"
                      onClick={() => {
                        setManualTypedData(JSON.stringify(eip712Example, null, "\t"));
                        setTypedData(eip712Example);
                        setInvalidJson(false);
                      }}
                    >
                      {" "}
                      Reset
                    </Button>
                  </Space>
                  <Select
                    showSearch
                    value={chainId}
                    size="large"
                    disabled={typedData && typedData.domain && typedData.domain.chainId}
                    onChange={value => {
                      console.log(`selected ${value}`);
                      setChainId(value);
                    }}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    optionFilterProp="children"
                  >
                    {chainList.map(chain => (
                      <Option key={chain.chainId} value={chain.chainId}>{`${chain.name} (${chain.chainId})`}</Option>
                    ))}
                  </Select>
                </>
              )}

              <Radio.Group
                value={action}
                onChange={e => {
                  setAction(e.target.value);
                }}
                style={{ marginTop: 10 }}
              >
                <Radio value="sign">Sign</Radio>
                <Radio value="create">Create</Radio>
                <Radio value="verify">Verify</Radio>
              </Radio.Group>
              {action === "verify" && (
                <>
                  <AddressInput
                    value={manualAddress}
                    onChange={v => setManualAddress(v)}
                    ensProvider={mainnetProvider}
                  />
                  <Input
                    placeholder="signature"
                    value={manualSignature}
                    onChange={e => setManualSignature(e.target.value)}
                  />
                </>
              )}
            </Space>
          </Panel>
        </Collapse>

        <Space>
          <Button
            size="large"
            type="primary"
            onClick={action !== "sign" ? signMessage : injectedProvider ? signMessage : loadWeb3Modal}
            disabled={
              (type === "typedData" && (!typedDataChecks.hash || invalidJson)) ||
              (action === "verify" && (!ethers.utils.isAddress(manualAddress) || !manualSignature))
            }
            loading={signing}
            style={{ marginTop: 10 }}
          >
            {action !== "sign" ? action : injectedProvider ? action : "Connect account to sign"}
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
      </Card>
    </div>
  );
}

export default Signator;
