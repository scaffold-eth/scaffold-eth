import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Popover, Button, List, Form, Typography, Spin, Space, Descriptions, notification, message, Badge, Skeleton, InputNumber } from 'antd';
import { AddressInput, Address } from "./components"
import { SendOutlined, QuestionCircleOutlined, StarTwoTone, LikeTwoTone, ShoppingCartOutlined, ShopOutlined, SyncOutlined } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { Transactor, getFromIPFS, getSignature } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import LikeButton from "./LikeButton.js"
import NiftyShop from "./NiftyShop.js"
import UpgradeInkButton from "./UpgradeInkButton.js"
var _ = require('lodash');

export default function InkInfo(props) {

  const [holders, setHolders] = useState(<Spin/>)
  const [minting, setMinting] = useState(false)
  const [buying, setBuying] = useState(false)
  const [mintForm] = Form.useForm();
  const [priceForm] = Form.useForm();

  const writeContracts = useContractLoader(props.injectedProvider);
  const metaWriteContracts = useContractLoader(props.metaProvider);
  const tx = Transactor(props.injectedProvider,props.gasPrice)
  const [referenceInkChainInfo, setReferenceInkChainInfo] = useState()

  const [inkChainInfo, setInkChainInfo] = useState()
  const [targetId, setTargetId] = useState()
  const [inkPrice, setInkPrice] = useState(0)
  const [mintedCount, setMintedCount] = useState()

  let mintDescription
  let mintFlow
  let priceFlow
  let buyButton
  let inkChainInfoDisplay
  let detailContent
  let likeButtonDisplay
  let detailsDisplay

  const mint = async (values) => {
    setMinting(true)

    let signature = await getSignature(
      props.injectedProvider, props.address,
      ['bytes','bytes','address','address','string','uint256'],
      ['0x19','0x0',metaWriteContracts["NiftyToken"].address,values['to'],props.ipfsHash,mintedCount])

    console.log("MINT OVERRIDE WITH GAS:",values,props.gasPrice)
    let result = await tx(metaWriteContracts["NiftyToken"].mintFromSignature(values['to'], props.ipfsHash, signature, { gasPrice:props.gasPrice } ))
    mintForm.resetFields();
    setMinting(false)
    console.log("result", result)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  usePoller(() => {
    const getChainInfo = async () => {
      if(props.ipfsHash && props.readKovanContracts ){
        try {
        const newChainInfo = await props.readKovanContracts['NiftyInk']["inkInfoByInkUrl"](props.ipfsHash)
        const newMintedCount = await props.readKovanContracts['NiftyToken']["inkTokenCount"](props.ipfsHash)
        setMintedCount(newMintedCount.toString())
        setInkChainInfo(newChainInfo)
        setTargetId(newChainInfo[0])
        setInkPrice(newChainInfo[4].toString())
      } catch(e){ console.log(e)}
      }
    }
    getChainInfo()
  }, 4000
)

  useEffect(()=>{
    setHolders(<Spin/>)
    setInkChainInfo()
  }, [props.ipfsHash])

  useEffect(()=>{

    const loadHolders = async () => {
      if(props.ipfsHash && props.ink['attributes'] && inkChainInfo) {
        let holdersArray = []
        for(var i = 0; i < mintedCount; i++){
          let inkToken = await props.readKovanContracts['NiftyToken']["inkTokenByIndex"](props.ipfsHash, i)
          let ownerOf = await props.readKovanContracts['NiftyToken']["ownerOf"](inkToken)
          let priceOf = await props.readKovanContracts['NiftyToken']["tokenPrice"](inkToken)
          let mainOwnerOf
          let relayed = ownerOf === props.readKovanContracts['NiftyMediator'].address
          if (relayed) {
            try {
            mainOwnerOf = await props.readContracts['NiftyMain']["ownerOf"](inkToken)
          } catch (e) {
            console.log(e)
          }
          }
          holdersArray.push([ownerOf, inkToken.toString(), priceOf.toString(), mainOwnerOf, relayed])
        }

        const sendInkButton = (tokenOwnerAddress, tokenId) => {
          if (tokenOwnerAddress === props.address) {
            return (
              <Popover content={
                <SendInkForm tokenId={tokenId} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider}/>
              }
              title="Send Ink">
                <Button type="secondary" style={{margin:4,marginBottom:12}}><SendOutlined/> Send</Button>
              </Popover>
            )
          }
        }

        const relayTokenButton = (relayed, tokenOwnerAddress, tokenId) => {
          if (tokenOwnerAddress === props.address && relayed === false) {
            return (
              <UpgradeInkButton
                tokenId={tokenId}
                injectedProvider={props.injectedProvider}
                gasPrice={props.gasPrice}
                upgradePrice={props.upgradePrice}
              />
            )
          }
        }


        if(props.ink.attributes[0].value === "0") {
          mintDescription = (mintedCount + ' minted')
        }
        else {mintDescription = (mintedCount + '/' + props.ink.attributes[0].value + ' minted')}

        const nextHolders = (
          <Row style={{justifyContent: 'center', marginBottom: 50}}>
          <List
          header={<Row style={{justifyContent: 'center'}}> <Space><Typography.Title level={3}>{mintDescription}</Typography.Title> {mintFlow}{priceFlow}{buyButton}</Space></Row>}
          itemLayout="horizontal"
          dataSource={holdersArray.reverse()}
          renderItem={item => (
            <List.Item>
              <Address value={item[3]?item[3]:item[0]} />
              {item[4]===true?(item[3]?<Typography.Title level={4}>Upgraded <StarTwoTone /></Typography.Title>:<Typography.Title level={4}>Upgrading to Ethereum <SyncOutlined spin /></Typography.Title>):<></>}
              {sendInkButton(item[0], item[1])}
              {relayTokenButton(item[4], item[0], item[1])}
              <div style={{marginLeft:4,marginTop:4}}>
              <NiftyShop
              injectedProvider={props.injectedProvider}
              metaProvider={props.metaProvider}
              type={'token'}
              ink={props.ink}
              itemForSale={item[1]}
              gasPrice={props.gasPrice}
              address={props.address}
              ownerAddress={item[0]}
              price={item[2]}
              visible={!item[4]}
              />
              </div>
            </List.Item>
          )}
          />
          </Row>)
          setHolders(nextHolders)
        } else {

        }
      }
      loadHolders()
    }, [inkChainInfo])

useEffect(()=>{
  const updateInk = async () => {
    if (props.readContracts) {
    if(inkChainInfo && !(_.isEqual(inkChainInfo,referenceInkChainInfo))) {
    let jsonUrl = inkChainInfo[2]
    let inkContent = await getFromIPFS(jsonUrl, props.ipfsConfig)
    console.log(JSON.parse(inkContent))
    props.setInk(JSON.parse(inkContent))
    setReferenceInkChainInfo(inkChainInfo)
  }
  }
}
  updateInk()
}, [inkChainInfo])


    if (!inkChainInfo || !props.ink.attributes) {
      inkChainInfoDisplay = (
        <div style={{marginTop:32}}>
          <Spin/>
        </div>
      )
    } else {
      if(inkChainInfo && props.ink.attributes) {

          detailContent = (
            <Descriptions>
              <Descriptions.Item label="Name">{props.ink.name}</Descriptions.Item>
              <Descriptions.Item label="Artist">{inkChainInfo[1]}</Descriptions.Item>
              <Descriptions.Item label="drawingHash">{props.ipfsHash}</Descriptions.Item>
              <Descriptions.Item label="id">{inkChainInfo[0].toString()}</Descriptions.Item>
              <Descriptions.Item label="jsonUrl">{inkChainInfo[2]}</Descriptions.Item>
              <Descriptions.Item label="Image">{props.ink.image}</Descriptions.Item>
              <Descriptions.Item label="Count">{mintedCount}</Descriptions.Item>
              <Descriptions.Item label="Limit">{props.ink.attributes[0].value}</Descriptions.Item>
              <Descriptions.Item label="Description">{props.ink.description}</Descriptions.Item>
              <Descriptions.Item label="signature">{inkChainInfo[3]}</Descriptions.Item>
              <Descriptions.Item label="Price">{(inkPrice > 0)?ethers.utils.formatEther(inkPrice):"No price set"}</Descriptions.Item>
            </Descriptions>
          )

    buyButton = (<NiftyShop
                  injectedProvider={props.injectedProvider}
                  metaProvider={props.metaProvider}
                  type={'ink'}
                  ink={props.ink}
                  itemForSale={props.ipfsHash}
                  gasPrice={props.gasPrice}
                  address={props.address}
                  ownerAddress={inkChainInfo[1]}
                  priceNonce={inkChainInfo[7]}
                  price={inkPrice}
                  visible={(mintedCount < Number(props.ink.attributes[0].value) || props.ink.attributes[0].value === "0")}
                  />)

      if(props.address === inkChainInfo[1]) {

          if(mintedCount < Number(props.ink.attributes[0].value) || props.ink.attributes[0].value === "0") {

          const mintInkForm = (
            <Row style={{justifyContent: 'center'}}>

            <Form
            form={mintForm}
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
            <Button type="primary" htmlType="submit" loading={minting}>
            Mint
            </Button>
            </Form.Item>
            </Form>

            </Row>
          )
          mintFlow =       (
            <Popover content={mintInkForm}
            title="Mint">
            <Button type="secondary" style={{ marginBottom: 12 }}><SendOutlined/> Mint</Button>
            </Popover>
          )
        }


    }

        likeButtonDisplay = (
          <div style={{marginRight:-props.calculatedVmin*0.8,marginTop:-20}}>
            <LikeButton
              metaProvider={props.metaProvider}
              signingProvider={props.injectedProvider}
              localProvider={props.kovanProvider}
              contractAddress={props.readKovanContracts['NiftyInk']['address']}
              targetId={targetId}
              likerAddress={props.address}
            />
          </div>

        )

        detailsDisplay = (
          <div style={{marginLeft:-props.calculatedVmin*0.77,marginTop:-20,opacity:0.5}}>
            <Popover content={detailContent} title="Ink Details">
            <QuestionCircleOutlined />
            </Popover>
          </div>
        )

        inkChainInfoDisplay = (
          <>
            <Row style={{justifyContent: 'center',marginTop:-16}}>
            <Space>
            <Typography>
            <span style={{verticalAlign:"middle",fontSize:16}}>
            {" artist: "}
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
      <div>
        {likeButtonDisplay}
        {detailsDisplay}
        <div style={{ marginTop: 16, margin: "auto" }}>
          {inkChainInfoDisplay}
        </div>

        <div style={{marginTop:20}}>
          {holders}
        </div>

      </div>
    )

    return bottom
  }
