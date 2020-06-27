import React, { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Row, Popover, Button, List, Form, Typography, Spin, Space } from 'antd';
import { AddressInput, Address } from "./components"
import { useContractReader, useContractLoader } from "./hooks"
import { Transactor } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import Blockies from 'react-blockies';

export default function InkInfo(props) {

  const [holders, setHolders] = useState()
  const writeContracts = useContractLoader(props.injectedProvider);
  const tx = Transactor(props.injectedProvider)

  let inkChainInfo
  inkChainInfo = useContractReader(props.readContracts,'NFTINK',"inkInfoByJsonUrl",[props.ipfsHash],1777);

  const newButton = (
  <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
  <Button style={{ marginRight: 8 }} shape="round" size="large" type="primary" onClick={() => {
    window.history.pushState({id: 'draw'}, 'draw', '/')
    props.setMode("edit")
    props.setDrawing("")
    props.setIpfsHash()
    props.setDrawingHash()
    props.setImageHash()
    props.setInkHash()
    props.setInk({})
  }}><PlusOutlined /> New Ink</Button>
  </div>
)

const mint = async (values) => {
console.log('Success:', values);
let result = await tx(writeContracts["NFTINK"].mint(values['to'], props.ipfsHash ))//eventually pass the JSON link not the Drawing link
console.log("result", result)
};

const onFinishFailed = errorInfo => {
console.log('Failed:', errorInfo);
};

  useEffect(()=>{

    const loadHolders = async () => {
    if(props.ipfsHash && props.ink['attributes']) {
      inkChainInfo = await props.readContracts['NFTINK']["inkInfoByJsonUrl"](props.ipfsHash)
      let mintedCount = inkChainInfo[2]
      let holdersArray = []
      for(var i = 0; i < mintedCount; i++){
        let inkToken = await props.readContracts['NFTINK']["inkTokenByIndex"](props.ipfsHash, i)
        let ownerOf = await props.readContracts['NFTINK']["ownerOf"](inkToken)
        holdersArray.push([ownerOf, inkToken.toString()])
      }

      const sendInkButton = (tokenOwnerAddress, tokenId) => {
      if (tokenOwnerAddress == props.address) {
        return (
      <Popover content={
        <SendInkForm tokenId={tokenId} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider}/>
      }
      title="Send Ink" trigger="click">
        <Button>Send ink</Button>
      </Popover>
    )
    }
  }

      let mintDescription
      if(props.ink.attributes[0].value == 0) {
        mintDescription = (inkChainInfo[2] + ' minted')
      }
      else {mintDescription = (inkChainInfo[2] + '/' + props.ink.attributes[0].value + ' minted')}

      const nextHolders = (
        <List
          header={<div>{mintDescription}</div>}
          itemLayout="horizontal"
          dataSource={holdersArray}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Blockies seed={item[0].toLowerCase()}/>}
                title={item[0]}
                description={'Token ID: ' + item[1]}
              />
              {sendInkButton(item[0], item[1])}
            </List.Item>
          )}
        />)
        setHolders(nextHolders)
    }
  }
  loadHolders()
}, [props.ink, inkChainInfo])

let ipfsDisplay
let inkChainInfoDisplay
if (!props.ipfsHash) {
  ipfsDisplay = (
    <div>
      <Spin /> Uploading to IPFS...
    </div>
  )
} else {

  let link = "http://localhost:3000/" + props.ipfsHash

  if(inkChainInfo) {
    inkChainInfoDisplay = (
      <>
      <Row style={{justifyContent: 'center'}}>
      <Space>
      <Typography>
        <span style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
        <Typography.Text style={{color:"#222222"}}>Ink #{inkChainInfo[0].toString() + " by "}</Typography.Text>
        </span>
      </Typography>
      <Address value={inkChainInfo[1]} ensProvider={props.mainnetProvider}/>
      </Space>
      </Row>
      <Row style={{justifyContent: 'center'}}>
      <Typography.Text copyable={{ text: 'http://localhost:3000/' + props.ipfsHash }} style={{color:"#222222"}}>{props.ipfsHash}</Typography.Text>
      </Row>
      </>
    )

  if(props.address == inkChainInfo[1] && (inkChainInfo[2] < props.ink.attributes[0].value || props.ink.attributes[0].value == 0)) {
  ipfsDisplay = (
    <Row style={{justifyContent: 'center'}}>

      <Form
      layout={'inline'}
      name="mintInk"
      onFinish={mint}
      onFinishFailed={onFinishFailed}
      >
      <Form.Item
      name="to"
      rules={[{ required: true, message: 'Which address should receive this artwork?' }]}
      >
      <AddressInput
        ensProvider={props.mainnetProvider}
        placeholder={"to address"}
      />
      </Form.Item>

      <Form.Item >
      <Button type="primary" htmlType="submit">
        Mint
      </Button>
      </Form.Item>
      </Form>

    </Row>
  )
}
}
}

let bottom = (
  <>
  <div style={{ marginTop: 16, width: "90vmin", margin: "auto" }}>
    {inkChainInfoDisplay}
    {ipfsDisplay}
    {holders}

    {/* <Contract
      name={"NFTINK"}
      provider={injectedProvider}
      address={address}
    /> */}
  </div>
  {newButton}
  </>
)

  return bottom
}
