import React, { useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { Row, Button, Input, Checkbox, Radio, Typography, Card, Space } from "antd";
import { useOnBlock, useLocalStorage } from "./hooks";
import { ethers } from "ethers";
import ReactJson from 'react-json-view'
const { Text, Paragraph } = Typography;
const codec = require('json-url')('lzw');

/*
    Welcome to the Signator!
*/

let eip712Example = {
    "domain": {
      "name": "Demo",
      "version": "1",
      "chainId": 1,
    },
    "types": {
      "Person": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "dogs",
          "type": "int32"
        }
      ],
    },
    "primaryType": "Person",
    "message": {
        "name": "Adam",
        "location": "Earth",
        "dogs": 1
      }
  }


function Signator({injectedProvider, mainnetProvider, address}) {

  const [messageText, setMessageText] = useState('hello ethereum')
  const [addDate, setAddDate] = useState(true)
  const [metaData, setMetaData] = useState('time')
  const [messageDate, setMessageDate] = useState(new Date())
  const [hashMessage, setHashMessage] = useState(false)
  const [latestBlock, setLatestBlock] = useState()
  const [signing, setSigning] = useState(false)
  const [typedData, setTypedData] = useLocalStorage('typedData', eip712Example)
  const [type, setType] = useLocalStorage('signingType','message')

  function useSearchParams() {
    let _params = new URLSearchParams(useLocation().search);
    return _params
  }

  let location = useLocation();
  let searchParams = useSearchParams()
  let history = useHistory()

  const getMessage = () => {
    let _message = addDate ? `${messageDate.toLocaleString('en', { hour12: false })}: ${messageText}` : messageText

    if(metaData === 'time') {
      _message = `${messageDate.toLocaleString('en', { hour12: false })}: ${messageText}`
    } else if (metaData == 'block') {
      _message = `${latestBlock}: ${messageText}`
    } else {
      _message = messageText
    }

    if(hashMessage) {
      return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_message))//_message//ethers.utils.hashMessage(_message)
    } else {
      return _message
    }
  }

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider.blockNumber}`)
    setLatestBlock(mainnetProvider.blockNumber)
  })

  const signMessage = async () => {
    try {
      setSigning(true)
      let _message = getMessage()
      console.log(`Signing: ${_message}`)
      let injectedSigner = injectedProvider.getSigner()

      let _signature
      if(type === 'typedData' ) {

        _signature = await injectedSigner._signTypedData(typedData.domain, typedData.types, typedData.message)

        let _compressedData = await codec.compress(typedData)

        searchParams.set("typedData", _compressedData)

      } else if(type ==='message') {

        let _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message

        console.log(_messageToSign, ethers.utils.isBytesLike(_message))

        if(injectedProvider.provider.wc) {
          _signature = await injectedProvider.send("personal_sign", [_messageToSign, address])
        } else {
          _signature = await injectedSigner.signMessage(_messageToSign)
        }

        searchParams.set("message", _message)

      }
      //console.log(_signature)
      console.log(`Success! ${_signature}`)
      searchParams.set("signatures", _signature)
      searchParams.set("addresses", address)
      history.push(`/view?${searchParams.toString()}`);

      setSigning(false)
    } catch (e) {
      console.log(e)
      setSigning(false)
    }
  };

  return (
            <Row justify="center">
            <Card>
            <Space direction='vertical'>

                  <Radio.Group value={type} buttonStyle="solid" size="large" onChange={(e)=> {
                    setType(e.target.value) }}>
                    <Radio.Button value="message">Message</Radio.Button>
                    <Radio.Button value="typedData">Typed Data</Radio.Button>
                  </Radio.Group>

                  {type==='message'&&<>
                  <Input.TextArea style={{fontSize: 18}} size="large" rows={2} value={messageText} onChange={(e)=> {
                    setMessageText(e.target.value) }} />

                  <div>
                  <Space>

                      <Radio.Group value={metaData} buttonStyle="solid" size="large" onChange={(e)=> {
                        setMetaData(e.target.value) }}>
                        <Radio.Button value="time">Time</Radio.Button>
                        <Radio.Button value="block">Block</Radio.Button>
                        <Radio.Button value="none">None</Radio.Button>
                      </Radio.Group>

                      {metaData==='time'&&<Button size="large" onClick={()=>{
                        let _date = new Date();
                        setMessageDate(_date)
                      }}>Refresh time</Button>}

                  </Space>
                  </div>
                  <div>
                      <Checkbox style={{fontSize: 18}} checked={hashMessage} onChange={(e)=>{
                        setHashMessage(e.target.checked)
                      }}>Hash message</Checkbox>
                  </div>

                  <Card>
                   <div style={{fontSize: 18, maxWidth: '400px', minWidth: '400px', wordWrap: 'break-word', whiteSpace: 'pre-line'}}>
                    <Text style={{marginBottom: '0px'}}>{`${getMessage()}`}</Text>
                  </div>
                  </Card>
                  </>
                 }
                 {type==='typedData'&&
                  <>
                    <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank">Learn more about signing typed data</a>
                    <Card style={{textAlign:'left'}}>
                    <ReactJson src={typedData} onEdit={(o)=>{setTypedData(o.updated_src)}} onAdd={(o)=>{setTypedData(o.updated_src)}} onDelete={(o)=>{setTypedData(o.updated_src)}}
                      enableClipboard={false} displayObjectSize={false}/>
                    </Card>
                  </>
                }

                  {<Button size="large" type="primary" onClick={signMessage} disabled={!injectedProvider} loading={signing}>
                    {injectedProvider?'Sign':'Connect account to sign'}
                  </Button>}
              </Space>
            </Card>
            </Row>
  );
}

export default Signator;
