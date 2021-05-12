import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Button, Alert, Typography, Card, Space, List, Modal } from "antd";
import { TwitterOutlined, CheckCircleTwoTone, QrcodeOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { Address } from "./components";
import { ethers } from "ethers";
import QR from "qrcode.react";
import ReactJson from 'react-json-view'
const codec = require('json-url')('lzw');
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

  let _addressCode = provider.getCode(address)
  if(_addressCode === '0x') {
    return 'MISMATCH'
  } else {
    let contract = new ethers.Contract(address, eip1271Spec.abi, provider)
      let returnValue = await contract.isValidSignature(
        message,
        signature,
      );
      return returnValue === eip1271Spec.magicValue ? 'MATCH' : 'MISMATCH'
  }

}


function SignatorViewer({injectedProvider, mainnetProvider, address}) {

  function useSearchParams() {
    let _params = new URLSearchParams(useLocation().search);
    return _params
  }

  let location = useLocation();
  let searchParams = useSearchParams()
  let history = useHistory()

  const [message, setMessage] = useState(searchParams.get("message"))
  const [compressedTypedData, setCompressedTypedData] = useState(searchParams.get("typedData"))
  const [typedData, setTypedData] = useState()
  const [signatures, setSignatures] = useState(searchParams.get("signatures") ? searchParams.get("signatures").split(',') : [])
  const [addresses, setAddresses] = useState(searchParams.get("addresses") ? searchParams.get("addresses").split(',') : [])
  const [addressChecks, setAddressChecks] = useState([])

  const [signing, setSigning] = useState(false)

  let messageToCheck
  let decompressedJson

  if(message) {
    messageToCheck = ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message
  }

  if(!message && !compressedTypedData) {
    console.log(searchParams.get("message"))
    history.push(`/`)
  }

  useEffect(()=>{
    const decompressTypedData = async () => {

      if(compressedTypedData) {
        let _typedData = await codec.decompress(compressedTypedData)
        console.log(_typedData)
        setTypedData(_typedData)
      }
    }

    decompressTypedData()

  },[compressedTypedData])

  useEffect(()=> {

    const checkAddresses = async () => {

      let _addressChecks = await signatures.map((sig, i) => {
        if((i + 1) > addresses.length) {
          return 'INVALID'
        }
        if(!ethers.utils.isAddress(addresses[i])) {
          return 'INVALID'
        }
        try {
          let _signingAddress

          if(message) _signingAddress = ethers.utils.verifyMessage( messageToCheck , sig )
          if(typedData) _signingAddress = ethers.utils.verifyTypedData(typedData.domain, typedData.types, typedData.message, sig)
          console.log(_signingAddress)

          if(_signingAddress === addresses[i]) {
            return 'MATCH'
          }
          else {
              try {
                console.log(ethers.utils._TypedDataEncoder.hash(
                  typedData.domain, typedData.types, typedData.message))

              let _message
              if(message) _message = ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message))
              if(typedData) _message = ethers.utils._TypedDataEncoder.hash(
                typedData.domain, typedData.types, typedData.message)

              let _eip1271Check = checkEip1271(
                mainnetProvider,
                addresses[i],
                _message,
                sig)
              console.log(_eip1271Check)
              return _eip1271Check
            } catch (e) {
              console.log(e)
              return 'MISMATCH'
            }
            }
          }
          catch (e) {
          console.log(`signature ${sig} failed: ${e}`)
          return 'INVALID'
        }
      });

      return Promise.all(_addressChecks)
    }

    if(message || typedData) {
      checkAddresses().then(data => {
        setAddressChecks(data)
      })
    }
  },[signatures, message, typedData, addresses])

  const signMessage = async () => {
    try {
      setSigning(true)
      console.log(`Signing: ${message}`)
      let injectedSigner = injectedProvider.getSigner()

      let _messageToSign = ethers.utils.isBytesLike(message) ? ethers.utils.arrayify(message) : message
      let _signature

      if(typedData) {

        _signature = await injectedProvider.send(
          "eth_signTypedData_v4",
          [address.toLowerCase(),
            JSON.stringify(ethers.utils._TypedDataEncoder.getPayload(
              typedData.domain, typedData.types, typedData.message))])

      } else if(message) {

        if(injectedProvider.provider.wc) {
          _signature = await injectedProvider.send("personal_sign", [_messageToSign, address])
        } else {
          _signature = await injectedSigner.signMessage(_messageToSign)
        }
      }
      console.log(`Success! ${_signature}`)

      let _signatures = [...signatures]
      _signatures.indexOf(_signature) === -1 ? _signatures.push(_signature) : console.log("This signature already exists");
      setSignatures(_signatures)
      let _addresses = [...addresses]
      _addresses.indexOf(address) === -1 ? _addresses.push(address) : console.log("This address already signed");
      setAddresses(_addresses)

      searchParams.set("signatures", _signatures.join())
      searchParams.set("addresses", _addresses.join())

      history.push(`${location.pathname}?${searchParams.toString()}`);
    } catch(e) {
      console.log(e)
      setSigning(false)
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
    <Space direction='vertical'>
          <Row justify="center" align="">
            <Card>
            <Space direction='vertical'>
                  <Card title={<Row justify="center" align="middle">
                                    {<Text copyable={{ text: window.location.href }} style={{fontSize: 20, padding: '4px 15px'}}></Text>}
                                    <Button type="link" href={`https://twitter.com/intent/tweet?text=Verified%20on%20Signatorio&url=${encodeURIComponent(window.location.href)}`} target="_blank">
                                        <TwitterOutlined style={{fontSize: 28, color: "#1890ff"}}/>
                                    </Button>
                                      <Button type="link" onClick={showModal}>
                                        <QrcodeOutlined style={{fontSize: 24, color: "#1890ff"}} />
                                      </Button>
                                    </Row>}>
                   {message?
                      <div style={{maxWidth: '400px', minWidth: '400px', wordWrap: 'break-word', whiteSpace: 'pre-line'}}>
                        <Text style={{fontSize: 18, marginBottom: '0px'}}>{`${message}`}</Text>
                      </div>:
                      <div style={{textAlign:'left', maxWidth: '400px', minWidth: '400px'}}>
                        <ReactJson src={typedData&&{message: typedData.message, domain: typedData.domain}} enableClipboard={false} displayDataTypes={false} displayObjectSize={false}/>
                      </div>}
                  </Card>

                  <List
                    header={<Text style={{fontSize: 18}}>{`Signatures`}</Text>}
                    bordered
                    locale={{emptyText: 'No signatures'}}
                    dataSource={signatures}
                    renderItem={(item, index) => {

                      let _indicator
                      if(addressChecks[index]==="MATCH") {
                        _indicator = (<CheckCircleTwoTone style={{fontSize: 32}} twoToneColor="#52c41a" />)
                      } else if(addressChecks[index]==="MISMATCH") {
                        _indicator = (<CloseCircleTwoTone style={{fontSize: 32}} twoToneColor="#ff4d4f" />)
                      } else {
                        _indicator = (<Alert message="Invalid" type="error" />)
                      }

                      return (
                      <List.Item key={item}>
                        <div style={{maxWidth: '400px', minWidth: '400px', wordWrap: 'break-word', whiteSpace: 'pre-line'}}>
                        <Space>
                         {addresses[index]&&ethers.utils.isAddress(addresses[index])&&<Address address={addresses[index]} ensProvider={mainnetProvider} />}
                         {_indicator}
                         </Space>
                         <Text copyable style={{marginBottom: '0px'}}>{`${item}`}</Text>
                       </div>
                      </List.Item>
                    )
                    }}
                  />

                  {(address && addresses.indexOf(address) === -1)&&<Button type="primary" size="large" onClick={signMessage} loading={signing}>
                    {`Sign`}
                  </Button>}
              </Space>
            </Card>
          </Row>
          <Row justify="center">
              {<Button onClick={()=>{
                history.push(`/`);
              }}>
                ✍️ Create new signator.io
              </Button>}
          </Row>
    </Space>
    </>
  );
}

export default SignatorViewer;
