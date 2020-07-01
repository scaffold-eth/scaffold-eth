import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, List, Popover, Badge, Avatar, Empty, Tabs } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useContractReader } from "./hooks"
import SendInkForm from "./SendInkForm.js"
const { TabPane } = Tabs;

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

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
        let inkImageURI
        await ipfs.files.get(ipfsHash, function (err, files) {
            const inkJson = JSON.parse(files[0].content)
            tokens[i]['name'] = inkJson['name']
            const inkImageHash = inkJson.image.split('/').pop()
            ipfs.files.get(inkImageHash, function (err, files) {
                inkImageURI = 'data:image/png;base64,' + files[0].content.toString('base64')
                tokens[i]['image'] = inkImageURI
            })
          })


        return {tokenId: tokenId.toString(), jsonUrl: jsonUrl, url: linkUrl}
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
      let inkImageURI
      await ipfs.files.get(ipfsHash, function (err, files) {
          const inkJson = JSON.parse(files[0].content)
          inks[i]['name'] = inkJson['name']
          inks[i]['limit'] = inkJson['attributes'][0]['value']
          const inkImageHash = inkJson.image.split('/').pop()
          ipfs.files.get(inkImageHash, function (err, files) {
              inkImageURI = 'data:image/png;base64,' + files[0].content.toString('base64')
              inks[i]['image'] = inkImageURI
          })
        })


      return {inkId: inkId.toString(), inkCount: inkInfo[2], url: linkUrl}
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
        <Button type="primary" onClick={showModal} style={{verticalAlign:"top",marginLeft:8,marginTop:4}} size={"large"}>
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
