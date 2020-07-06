import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, List, Popover, Badge, Avatar, Empty, Tabs } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useContractReader } from "./hooks"
import SendInkForm from "./SendInkForm.js"
const { TabPane } = Tabs;

const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
const BufferList = require('bl/BufferList')

export default function NftyWallet(props) {

  const [visible, setVisible] = useState(false)
  const [sends, setSends] = useState(0)
  let tokens
  let inks
  const [tokenData, setTokenData] = useState()
  const [inkData, setInkData] = useState()

  let tokenView
  let inkView

  let nftyBalance
  nftyBalance = useContractReader(props.readContracts,'NFTINK',"balanceOf",[props.address],1777);
  let inksCreatedBy
  inksCreatedBy = useContractReader(props.readContracts,'NFTINK',"inksCreatedBy",[props.address],1777);

  const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    return content
  }
}

  let displayBalance
  if(nftyBalance) {
    displayBalance = nftyBalance.toString()
  }
  let displayInksCreated
  if(inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString()
  }

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = e => {
    console.log(e);
    setVisible(false);
  };

  const handleCancel = e => {
    console.log(e);
    setVisible(false);
  };


  useEffect(()=>{
    if(visible) {
    if(props.readContracts && props.address) {

    const loadTokens = async () => {
      nftyBalance = await props.readContracts['NFTINK']["balanceOf"](props.address)
      tokens = new Array(nftyBalance)
      //console.log(tokens)

      const getTokenInfo = async (i) => {
        let tokenId = await props.readContracts['NFTINK']["tokenOfOwnerByIndex"](props.address, i)
        let jsonUrl = await props.readContracts['NFTINK']["tokenURI"](tokenId)

        let parts = jsonUrl.split('/');
        let ipfsHash = parts.pop();

        const urlArray = window.location.href.split("/");
        const linkUrl = urlArray[0] + "//" + urlArray[2] + "/" + ipfsHash
        const jsonContent = await getFromIPFS(ipfsHash)
        const inkJson = JSON.parse(jsonContent)
        const inkImageHash = inkJson.image.split('/').pop()
        const imageContent = await getFromIPFS(inkImageHash)
        const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

        return {tokenId: tokenId.toString(), jsonUrl: jsonUrl, url: linkUrl, name: inkJson['name'], image: inkImageURI}
      }

      for(var i = 0; i < nftyBalance; i++){
        let tokenInfo = await getTokenInfo(i)
        tokens[i] = tokenInfo
      }

      setTokenData(tokens)
    }

  const loadInks = async () => {
    inksCreatedBy = await props.readContracts['NFTINK']["inksCreatedBy"](props.address)
    inks = new Array(inksCreatedBy)
    console.log("inks", inks)
    console.log(inksCreatedBy.toString())

    const getInkInfo = async (i) => {
      let inkId = await props.readContracts['NFTINK']["inkOfArtistByIndex"](props.address, i)
      let inkInfo = await props.readContracts['NFTINK']["inkInfoById"](inkId)

      let ipfsHash = inkInfo[0]

      const urlArray = window.location.href.split("/");
      const linkUrl = urlArray[0] + "//" + urlArray[2] + "/" + ipfsHash

      const jsonContent = await getFromIPFS(ipfsHash)
      const inkJson = JSON.parse(jsonContent)
      console.log(inkJson)
      const inkImageHash = inkJson.image.split('/').pop()
      const imageContent = await getFromIPFS(inkImageHash)
      const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

      return {inkId: inkId.toString(), inkCount: inkInfo[2], url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI}
    }

    for(var i = 0; i < inksCreatedBy; i++){
      let inkInfo = await getInkInfo(i)
      inks[i] = inkInfo
    }

    setInkData(inks)
  }

  loadTokens()
  loadInks()

}
}
},[visible, sends])

useEffect(()=>{
  if(tokens) {
  setTokenData(tokens)
}
},[tokens])

useEffect(()=>{
  if(inks) {
  setInkData(inks)
  console.log(inkData)
}
},[inks])

if(nftyBalance > 0) {
tokenView = (
  <List
    itemLayout="horizontal"
    dataSource={tokenData}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={item['image']?<a href={item['url']}><img src={item['image']} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
          title={<a href={item['url']}>{item['name'] + ": Token #" + item['tokenId']}</a>}
          description={<Popover content={
            <SendInkForm tokenId={item['tokenId']} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} sends={sends} setSends={setSends}/>
          }
          title="Send Ink" trigger="click">
            <Button>Send ink</Button>
          </Popover>}
        />
      </List.Item>
    )}
  />)
} else { tokenView = (<Empty
    description={
      <span>
        You don't have any inks :(
      </span>
    }
  />
  )}

  if(inksCreatedBy > 0 && inkData) {
  inkView = (
    <List
      itemLayout="horizontal"
      dataSource={inkData}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={item['image']?<a href={item['url']}><img src={item['image']} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
            title={<a href={item['url']}>{item['name'] + ": Ink #" + item['inkId']}</a>}
            description={item['inkCount'].toString() + (item['limit']>0?'/' + item['limit']:'') + ' minted'}
          />
        </List.Item>
      )}
    />)
  } else { inkView = (<Empty
      description={
        <span>
          You haven't drawn any inks :(
        </span>
      }
    />
    )}

    return (
      <>
        <Button type="primary" onClick={showModal} size={"large"}>
          My Inks
        </Button>
        <Modal
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
        <Tabs defaultActiveKey="1">
          <TabPane tab={<><span>My wallet</span> <Badge count={displayBalance} showZero/></>} key="1">
          {tokenView}
          </TabPane>
          <TabPane tab={<><span>My creations</span> <Badge count={displayInksCreated} showZero/></>} key="2">
          {inkView}
          </TabPane>
        </Tabs>
        </Modal>
      </>
    );

}
