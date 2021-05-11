import { CheckCircleTwoTone, CloseCircleTwoTone, QrcodeOutlined, TwitterOutlined } from "@ant-design/icons";
import { Alert, Button, Card, List, Modal, Row, Space, Typography } from "antd";
import { ethers } from "ethers";
import QR from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Address } from "./components";

const { Text } = Typography;
/*
    Welcome to the Signator Viewer!
*/

const checkEip1271 = async (provider, address, message, signature) => {
  const eip1271Spec = {
    magicValue: "0x1626ba7e",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_hash",
            type: "bytes32",
          },
          {
            name: "_sig",
            type: "bytes",
          },
        ],
        name: "isValidSignature",
        outputs: [
          {
            name: "magicValue",
            type: "bytes4",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
  };

  const _addressCode = provider.getCode(address);
  if (_addressCode === "0x") {
    return "MISMATCH";
  }
  const contract = new ethers.Contract(address, eip1271Spec.abi, provider);
  const returnValue = await contract.isValidSignature(
    ethers.utils.arrayify(
      ethers.utils.hashMessage(ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message),
    ),
    signature,
  );
  return returnValue === eip1271Spec.magicValue ? "MATCH" : "MISMATCH";
};

function SignatorViewer({ injectedProvider, mainnetProvider, address }) {
  function useSearchParams() {
    const _params = new URLSearchParams(useLocation().search);
    return _params;
  }

  const location = useLocation();
  const searchParams = useSearchParams();
  const history = useHistory();

  const [message, setMessage] = useState(searchParams.get("message"));
  const [signatures, setSignatures] = useState(
    searchParams.get("signatures") ? searchParams.get("signatures").split(",") : [],
  );
  const [addresses, setAddresses] = useState(
    searchParams.get("addresses") ? searchParams.get("addresses").split(",") : [],
  );
  const [addressChecks, setAddressChecks] = useState([]);

  const [signing, setSigning] = useState(false);

  const messageToCheck = ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message;

  if (!message) {
    console.log(searchParams.get("message"));
    history.push(`/`);
  }

  useEffect(() => {
    const checkAddresses = async () => {
      const _addressChecks = await signatures.map((sig, i) => {
        if (i + 1 > addresses.length) {
          return "INVALID";
        }
        if (!ethers.utils.isAddress(addresses[i])) {
          return "INVALID";
        }
        try {
          const _signingAddress = ethers.utils.verifyMessage(messageToCheck, sig);

          if (_signingAddress === addresses[i]) {
            return "MATCH";
          }
          try {
            const _eip1271Check = checkEip1271(mainnetProvider, addresses[i], message, sig);
            console.log(_eip1271Check);
            return _eip1271Check;
          } catch (e) {
            console.log(e);
            return "INVALID";
          }
        } catch (e) {
          console.log(`signature ${sig} failed`);
          return "INVALID";
        }
      });

      return Promise.all(_addressChecks);
    };

    checkAddresses().then(data => {
      setAddressChecks(data);
    });
  }, [signatures, message, messageToCheck, addresses]);

  const signMessage = async () => {
    try {
      setSigning(true);
      console.log(`Signing: ${message}`);
      const injectedSigner = injectedProvider.getSigner();
      // let _signature = await injectedSigner.signMessage(message)
      const _messageToSign = ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message;
      let _signature;
      if (injectedProvider.provider.wc) {
        _signature = await injectedProvider.send("personal_sign", [_messageToSign, address]);
      } else {
        _signature = await injectedSigner.signMessage(_messageToSign);
      }
      console.log(`Success! ${_signature}`);

      const _signatures = [...signatures];
      _signatures.indexOf(_signature) === -1
        ? _signatures.push(_signature)
        : console.log("This signature already exists");
      setSignatures(_signatures);
      const _addresses = [...addresses];
      _addresses.indexOf(address) === -1 ? _addresses.push(address) : console.log("This address already signed");
      setAddresses(_addresses);

      searchParams.set("signatures", _signatures.join());
      searchParams.set("addresses", _addresses.join());

      history.push(`${location.pathname}?${searchParams.toString()}`);
    } catch (e) {
      console.log(e);
      setSigning(false);
    }
  };

  const [qrModalVisible, setQrModalVisible] = useState(false);

  const showModal = () => {
    setQrModalVisible(true);
  };

  const closeModal = () => {
    setQrModalVisible(false);
  };

  return (
    <>
      <Modal title="Scan Signatorio" visible={qrModalVisible} onOk={closeModal} onCancel={closeModal}>
        <QR
          value={window.location.href}
          size="400"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </Modal>
      <Space direction="vertical">
        <Row justify="center" align="">
          <Card>
            <Space direction="vertical">
              <Card
                title={
                  <Row justify="center" align="middle">
                    <Text copyable={{ text: window.location.href }} style={{ fontSize: 20, padding: "4px 15px" }} />
                    <Button
                      type="link"
                      href={`https://twitter.com/intent/tweet?text=Verified%20on%20Signatorio&url=${encodeURIComponent(
                        window.location.href,
                      )}`}
                      target="_blank"
                    >
                      <TwitterOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                    </Button>
                    <Button type="link" onClick={showModal}>
                      <QrcodeOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                    </Button>
                  </Row>
                }
              >
                <div style={{ maxWidth: "400px", minWidth: "400px", wordWrap: "break-word", whiteSpace: "pre-line" }}>
                  <Text style={{ fontSize: 18, marginBottom: "0px" }}>{`${message}`}</Text>
                </div>
              </Card>

              <List
                header={<Text style={{ fontSize: 18 }}>Signatures</Text>}
                bordered
                locale={{ emptyText: "No signatures" }}
                dataSource={signatures}
                renderItem={(item, index) => {
                  let _signerAddress;
                  try {
                    _signerAddress = ethers.utils.verifyMessage(messageToCheck, item);
                  } catch (error) {
                    console.log(`${item} did not generate address`);
                  }

                  let _indicator;
                  if (addressChecks[index] === "MATCH") {
                    _indicator = <CheckCircleTwoTone style={{ fontSize: 32 }} twoToneColor="#52c41a" />;
                  } else if (addressChecks[index] === "MISMATCH") {
                    _indicator = <CloseCircleTwoTone style={{ fontSize: 32 }} twoToneColor="#ff4d4f" />;
                  } else {
                    _indicator = <Alert message="Invalid" type="error" />;
                  }

                  return (
                    <List.Item key={item}>
                      <div
                        style={{ maxWidth: "400px", minWidth: "400px", wordWrap: "break-word", whiteSpace: "pre-line" }}
                      >
                        <Space>
                          {addresses[index] && ethers.utils.isAddress(addresses[index]) && (
                            <Address address={addresses[index]} ensProvider={mainnetProvider} />
                          )}
                          {_indicator}
                        </Space>
                        <Text copyable style={{ marginBottom: "0px" }}>{`${item}`}</Text>
                      </div>
                    </List.Item>
                  );
                }}
              />

              {address && addresses.indexOf(address) === -1 && (
                <Button type="primary" size="large" onClick={signMessage} loading={signing}>
                  Sign
                </Button>
              )}
            </Space>
          </Card>
        </Row>
        <Row justify="center">
          <Button
            onClick={() => {
              history.push(`/`);
            }}
          >
            ✍️ Create new signator.io
          </Button>
        </Row>
      </Space>
    </>
  );
}

export default SignatorViewer;
