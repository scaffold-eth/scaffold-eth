import React, { useState, useEffect } from 'react'
import { Row, Popover, Button, List, Form, Typography, Spin, Space } from 'antd';
import { AddressInput, Address } from "./components"
import { useContractReader, useContractLoader } from "./hooks"
import { Transactor } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import Blockies from 'react-blockies';

export default function InkInfo(props) {

  const [holders, setHolders] = useState()
  const [sends, setSends] = useState(0)
  const writeContracts = useContractLoader(props.injectedProvider);
  const tx = Transactor(props.injectedProvider)

  let inkChainInfo
  inkChainInfo = useContractReader(props.readContracts,'NFTINK',"inkInfoByJsonUrl",[props.ipfsHash],1777);

  let mintFlow
  let inkChainInfoDisplay

  const loadingTip = 'Connecting to the Ether webs...'

const mint = async (values) => {
console.log('Success:', values);
let result = await tx(writeContracts["NFTINK"].mint(values['to'], props.ipfsHash ))
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
      if (tokenOwnerAddress === props.address) {
        return (
      <Popover content={
        <SendInkForm tokenId={tokenId} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} sends={sends} setSends={setSends}/>
      }
      title="Send Ink" trigger="click">
        <Button>Send ink</Button>
      </Popover>
    )
    }
  }

      let mintDescription
      if(props.ink.attributes[0].value === 0) {
        mintDescription = (inkChainInfo[2] + ' minted')
      }
      else {mintDescription = (inkChainInfo[2] + '/' + props.ink.attributes[0].value + ' minted')}

      const nextHolders = (
        <Row style={{justifyContent: 'center', marginBottom: 50}}>
        <List
          header={<Row style={{justifyContent: 'center'}}> <Space><Typography.Title level={3}>{mintDescription}</Typography.Title> {mintFlow}</Space></Row>}
          itemLayout="horizontal"
          dataSource={holdersArray}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Blockies seed={item[0].toLowerCase()}/>}
                title={<>
                  <Typography.Text>{'Token ID: ' + item[1] + " owned by "}</Typography.Text>
                  <Typography.Text copyable={{ text: item[0]}}>{item[0].substring(0,6)}</Typography.Text>
                </>}
                description={sendInkButton(item[0], item[1])}
              />
            </List.Item>
          )}
        />
    </Row>)
        setHolders(nextHolders)
    }
  }
  loadHolders()
}, [props.ink, inkChainInfo])

if (!props.ipfsHash) {
  inkChainInfoDisplay = (
    <div>
      <Spin tip={loadingTip}/>
    </div>
  )
} else {

  if(inkChainInfo) {

  if(props.address === inkChainInfo[1] && (inkChainInfo[2] < props.ink.attributes[0].value || props.ink.attributes[0].value === 0)) {
  const mintForm = (
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
  mintFlow =       (
    <Popover content={mintForm}
        title="Mint" trigger="click">
          <Button type="primary" style={{ marginBottom: 12 }}>Mint ink</Button>
        </Popover>
  )
}
inkChainInfoDisplay = (
  <>
  <Row style={{justifyContent: 'center'}}>
  <Space>
  <Typography>
    <span style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
    <Typography.Text style={{color:"#222222"}} copyable={{ text: 'http://localhost:3000/' + props.ipfsHash}}>Ink #{inkChainInfo[0].toString()}</Typography.Text> {" by "}
    </span>
  </Typography>
  <Address value={inkChainInfo[1]} ensProvider={props.mainnetProvider}/>
  </Space>
  </Row>
  </>
)
}
}

let bottom = (
  <>
  <div style={{ marginTop: 16, margin: "auto" }}>
    {inkChainInfoDisplay}
    {holders}
  </div>
  </>
)

  return bottom
}
