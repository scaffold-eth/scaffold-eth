import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Button, Input, Checkbox, Radio, Typography, Card, Space } from "antd";
import { useOnBlock } from "./hooks";
import { ethers } from "ethers";
const { Text, Paragraph } = Typography;
/*
    Welcome to the Signator!
*/


function Signator({injectedProvider, mainnetProvider, address}) {

  const [messageText, setMessageText] = useState('hello world')
  const [addDate, setAddDate] = useState(true)
  const [metaData, setMetaData] = useState('time')
  const [messageDate, setMessageDate] = useState(new Date())
  const [hashMessage, setHashMessage] = useState(false)
  const [latestBlock, setLatestBlock] = useState()
  const [signing, setSigning] = useState(false)

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
      //let _signature = await injectedProvider.send("personal_sign", [_message, address])
      //let _signature = await injectedProvider.send("eth_sign", [address, _message])
      //console.log(_personalSignature)

      let _messageToSign = ethers.utils.isBytesLike(_message) ? ethers.utils.arrayify(_message) : _message

      console.log(_messageToSign)

      let _signature
      if(injectedProvider.provider.wc) {
        _signature = await injectedProvider.send("personal_sign", [_messageToSign, address])
      } else {
        _signature = await injectedSigner.signMessage(_messageToSign)
      }
      //console.log(_signature)
      console.log(`Success! ${_signature}`)
      searchParams.set("message", _message)
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

                  {<Button size="large" type="primary" onClick={signMessage} disabled={!injectedProvider} loading={signing}>
                    {injectedProvider?'Sign':'Connect account to sign'}
                  </Button>}
              </Space>
            </Card>
            </Row>
  );
}

export default Signator;
