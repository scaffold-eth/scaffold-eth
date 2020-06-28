import React, { useState, useEffect } from 'react'
import { Modal, Button, List, Spin, Popover } from 'antd';
import { AddressInput } from "./components"
import { Transactor } from "./helpers"
import { useContractReader, useContractLoader } from "./hooks"
import Blockies from 'react-blockies';
import SendInkForm from "./SendInkForm.js"

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

export default function NftyWallet(props) {

  const [visible, setVisible] = useState(false)
  let tokens
  const [tokenData, setTokenData] = useState()

  let tokenView

  let nftyBalance
  nftyBalance = useContractReader(props.readContracts,'NFTINK',"balanceOf",[props.address],1777);

  let displayBalance
  if(nftyBalance) {
    displayBalance = nftyBalance.toString()
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

  const getIPFSFile = async (hash) => {
    let ifpsFile
    await ipfs.files.get(hash, function (err, files) {
      ifpsFile = files[0].content
      console.log(ifpsFile)
    })
    return ifpsFile
  }


  useEffect(()=>{
    if(visible) {
    if(props.readContracts && props.address) {

    const loadTokens = async () => {
      nftyBalance = await props.readContracts['NFTINK']["balanceOf"](props.address)
      tokens = new Array(nftyBalance)
      console.log(tokens)

      const getTokenInfo = async (i) => {
        let tokenId = await props.readContracts['NFTINK']["tokenOfOwnerByIndex"](props.address, i)
        let jsonUrl = await props.readContracts['NFTINK']["tokenURI"](tokenId)

        let parts = jsonUrl.split('/');
        let ipfsHash = parts.pop();

        const urlArray = window.location.href.split("/");
        const linkUrl = urlArray[0] + "//" + urlArray[2] + "/" + ipfsHash
        console.log(window.location.protocol + window.location.hostname + "/" + ipfsHash)
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
        console.log(tokenInfo)
        tokens[i] = tokenInfo
      }

      setTokenData(tokens)
    }
  loadTokens()
}
}
},[visible])

useEffect(()=>{
  setTokenData(tokens)
},[tokens])

tokenView = (
  <List
    itemLayout="horizontal"
    dataSource={tokenData}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<a href={item['url']}><img src={item['image']} height="50" width="50"/></a>}
          title={<a href={item['url']}>{item['name'] + ": Token #" + item['tokenId']}</a>}
          description={<Popover content={
            <SendInkForm tokenId={item['tokenId']} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider}/>
          }
          title="Send Ink" trigger="click">
            <Button>Send ink</Button>
          </Popover>}
        />
      </List.Item>
    )}
  />)

    return (
      <>
        <Button type="primary" onClick={showModal} style={{verticalAlign:"top",marginLeft:8,marginTop:4}} size={"large"}>
          NFTY Wallet
        </Button>
        <Modal
          title="My inks"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {tokenView}
        </Modal>
      </>
    );

}
