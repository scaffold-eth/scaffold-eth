import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Popover, Button, List, Form, Typography, Spin, Space, Descriptions, notification, Badge } from 'antd';
import { AddressInput, Address } from "./components"
import { SendOutlined, QuestionCircleOutlined, StarTwoTone, LikeTwoTone } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { Transactor, getFromIPFS, signInk, signLike } from "./helpers"
import SendInkForm from "./SendInkForm.js"
var _ = require('lodash');

export default function InkInfo(props) {

  const [holders, setHolders] = useState(<></>)
  const [sends, setSends] = useState(0)
  const [minting, setMinting] = useState(false)
  const [form] = Form.useForm();

  const writeContracts = useContractLoader(props.injectedProvider);
  const metaWriteContracts = useContractLoader(props.metaProvider);
  const tx = Transactor(props.injectedProvider,props.gasPrice)
  const [referenceInkChainInfo, setReferenceInkChainInfo] = useState()

  const [inkChainInfo, setInkChainInfo] = useState()
  const [inkMainChainInfo, setinkMainChainInfo] = useState()
  const [upgraded, setUpgraded] = useState()
  const [likes, setLikes] = useState()
  const [hasLiked, setHasLiked] = useState()

  let mintDescription
  let mintFlow
  let inkChainInfoDisplay
  let detailContent
  let getPatronageButton
  let upgradeButton
  let providePatronageButton
  let likeButton

  let displayLikes
  if(likes) {
    displayLikes = likes.toString()
  }

  const mint = async (values) => {
    setMinting(true)
    console.log("MINT OVERRIDE WITH GAS:",values,props.gasPrice)
    let result = await tx(writeContracts["NFTINK"].mint(values['to'], props.ipfsHash , { gasPrice:props.gasPrice } ))
    form.resetFields();
    setMinting(false)
    console.log("result", result)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  usePoller(() => {
    const getChainInfo = async () => {
      if(props.ipfsHash && props.readContracts && props.readKovanContracts ){
        try {
        const newChainInfo = await props.readKovanContracts['NFTINK']["inkInfoByInkUrl"](props.ipfsHash)
        console.log("newChainInfo",newChainInfo)
        setInkChainInfo(newChainInfo)
        let niftyAddress = props.readKovanContracts['NFTINK']['address']
        console.log("niftyAddress",niftyAddress)
        const newInkLikes = await props.readKovanContracts['Liker']['getLikesByTarget'](niftyAddress, newChainInfo[0])
        console.log("newInkLikes",newInkLikes)
        setLikes(newInkLikes)
        console.log("CHECKING HAS LIKED",niftyAddress, newChainInfo[0], props.address)
        const newHasLiked = await props.readKovanContracts['Liker']['checkLike'](niftyAddress, newChainInfo[0], props.address)
        console.log("newHasLiked",newHasLiked)
        setHasLiked(newHasLiked)
        const mainChainInkId = await props.readContracts['NFTINK']['inkIdByUrl'](props.ipfsHash)
        console.log("mainChainInkId",mainChainInkId)
        if(mainChainInkId.toString()=="0") {
          setUpgraded(false)
        } else {
          setUpgraded(true)
          const newMainChainInkInfo = await props.readContracts['NFTINK']['inkInfoByInkUrl'](props.ipfsHash)
          setinkMainChainInfo(newMainChainInkInfo)
        }
      } catch(e){ console.log(e)}
      }
    }
    getChainInfo()
  }, 3000
)

  useEffect(()=>{
    setHolders()
    setInkChainInfo()
    setinkMainChainInfo()
    setUpgraded(false)
  }, [props.ipfsHash])

  useEffect(()=>{

    const loadHolders = async () => {
      if(props.ipfsHash && props.ink['attributes'] && inkMainChainInfo) {
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
              <a href="#"><SendOutlined style={{fontSize:26,marginLeft:4,verticalAlign:"middle"}}/></a>
              </Popover>
            )
          }
        }
        if(props.ink.attributes[0].value === "0") {
          mintDescription = (inkChainInfo[2] + ' minted')
        }
        else {mintDescription = (inkChainInfo[2] + '/' + props.ink.attributes[0].value + ' minted')}

        const nextHolders = (
          <Row style={{justifyContent: 'center', marginBottom: 50}}>
          <List
          header={<Row style={{justifyContent: 'center'}}> <Space><Typography.Title level={3}>{mintDescription}</Typography.Title> {mintFlow}</Space></Row>}
          itemLayout="horizontal"
          dataSource={holdersArray.reverse()}
          renderItem={item => (
            <List.Item>
              <Address value={item[0]} /> {sendInkButton(item[0], item[1])}
            </List.Item>
          )}
          />
          </Row>)
          setHolders(nextHolders)
        } else {
          setHolders(<Row style={{justifyContent: 'center'}}> <Space>{upgradeButton}</Space><Space>{getPatronageButton}</Space>{providePatronageButton}</Row>)

        }
      }
      loadHolders()
    }, [inkChainInfo])

useEffect(()=>{
  const updateInk = async () => {
    if (props.readContracts) {
    if(inkChainInfo && !(_.isEqual(inkChainInfo,referenceInkChainInfo))) {
    let jsonUrl = inkChainInfo[3]
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

          likeButton = (<>
            <Badge style={{ backgroundColor: '#2db7f5' }} count={displayLikes} showZero>
            <Button loading={minting} shape={"circle"} disabled={hasLiked} onClick={async ()=>{
              setMinting(true)
              try {
                let contractAddress = props.readKovanContracts['NFTINK']['address']
                let target = inkChainInfo[0]
                let liker = props.address
                let signature = await signLike(contractAddress, target, liker, props.injectedProvider, props.readKovanContracts["Liker"])
                let result = await metaWriteContracts["Liker"].likeWithSignature(contractAddress, target, liker, signature)
                if(result) {
                  notification.open({
                    message: 'You liked this ink!',
                    description:(
                      <a target="_blank" href={"https://kovan.etherscan.io/tx/"+result.hash}>liked! view transaction.</a>
                    ),
                  });
                setMinting(false)
                console.log(result)
              }
              } catch(e) {
                notification.open({
                  message: 'Like unsuccessful',
                  description:
                  e.message,
                });
                setMinting(false)
                console.log(e.message)
              }
            }} style={{ marginBottom: 12 }}><LikeTwoTone /></Button>
            </Badge>
            </>
          )

          detailContent = (
            <Descriptions>
              <Descriptions.Item label="Name">{props.ink.name}</Descriptions.Item>
              <Descriptions.Item label="Artist">{inkChainInfo[1]}</Descriptions.Item>
              <Descriptions.Item label="drawingHash">{props.ipfsHash}</Descriptions.Item>
              <Descriptions.Item label="id">{inkChainInfo[0].toString()}</Descriptions.Item>
              <Descriptions.Item label="jsonUrl">{inkChainInfo[3]}</Descriptions.Item>
              <Descriptions.Item label="Image">{props.ink.image}</Descriptions.Item>
              <Descriptions.Item label="Count">{inkChainInfo[2].toString()}</Descriptions.Item>
              <Descriptions.Item label="Limit">{props.ink.attributes[0].value}</Descriptions.Item>
              <Descriptions.Item label="Description">{props.ink.description}</Descriptions.Item>
              <Descriptions.Item label="signature">{inkChainInfo[4]}</Descriptions.Item>
              <Descriptions.Item label="status">{upgraded?"Upgraded":"Not upgraded"}</Descriptions.Item>
              <Descriptions.Item label="likes">{displayLikes}</Descriptions.Item>
            </Descriptions>
          )

      if(props.address === inkChainInfo[1]) {
          if(upgraded && inkMainChainInfo) {
          if(inkChainInfo[2] < Number(props.ink.attributes[0].value) || props.ink.attributes[0].value === "0") {
          const mintForm = (
            <Row style={{justifyContent: 'center'}}>

            <Form
            form={form}
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
            <Popover content={mintForm}
            title="Mint" trigger="click">
            <Button type="primary" style={{ marginBottom: 12 }}>Mint ink</Button>
            </Popover>
          )
        }
      } else {

        getPatronageButton = (
          <Button type="secondary" loading={minting} disabled={inkChainInfo[4] !== "0x"} onClick={async ()=>{
            setMinting(true)
            console.log("PATRONAGE",inkChainInfo,props.ipfsHash)
            let artist = inkChainInfo[1]
            let inkUrl = props.ipfsHash
            let jsonUrl = inkChainInfo[3]
            let limit = props.ink.attributes[0].value

            let signature = await signInk(artist, inkUrl, jsonUrl, limit, props.injectedProvider, props.readKovanContracts["NFTINK"])

            notification.open({
              message: '📡 ',
              description:
              'sending meta transaction...',
            });
            console.log("allowPatronization on metaWriteContracts",metaWriteContracts,inkUrl, signature)
            let result = await metaWriteContracts["NFTINK"].allowPatronization(inkUrl, signature)
            notification.open({
              message: '🛰',
              description:(
                <a target="_blank" href={"https://kovan.etherscan.io/tx/"+result.hash}>sent! view transaction.</a>
              ),
            });
            console.log("Patronizing signature SAVED on lower value chain:",result)
            setMinting(false)

          }} style={{ marginBottom: 12 }}>{(inkChainInfo[4] == "0x")?"Allow Patronage":"Patronage Requested"}</Button>
        )
        upgradeButton = (
          <Button loading={minting} type="primary" onClick={async ()=>{
            setMinting(true)
            try {
              let inkUrl = props.ipfsHash
              let jsonUrl = inkChainInfo[3]
              let limit = props.ink.attributes[0].value
              let result = await writeContracts["NFTINK"].createInk(inkUrl, jsonUrl, limit)
              if(result) {
              console.log(result)
              setMinting(false)
            }
            } catch(e) {
              setMinting(false)
              console.log(e)
            }
          }} style={{ marginBottom: 12 }}>Upgrade</Button>
        )
      }

    } else {
      if(inkChainInfo && inkChainInfo[4] !== "0x") {
        providePatronageButton = (
          <Button loading={minting} type="primary" onClick={async ()=>{
            setMinting(true)
            try {
              let inkUrl = props.ipfsHash
              let jsonUrl = inkChainInfo[3]
              let limit = props.ink.attributes[0].value
              let artist = inkChainInfo[1]
              let signature = inkChainInfo[4]
              let result = await writeContracts["NFTINK"].patronize(inkUrl, jsonUrl, limit, artist, signature)
              if(result) {
              console.log(result)
              setMinting(false)
            }
            } catch(e) {
              setMinting(false)
              console.log(e)
            }
          }} style={{ marginBottom: 12 }}>Upgrade this ink: provide patronage</Button>
        )
      }
    }
        inkChainInfoDisplay = (
          <>
          <Row style={{justifyContent: 'center',marginTop:16}}>
          <Space>
          <Typography>
          <span style={{verticalAlign:"middle",fontSize:16}}>
          {" artist: "}
          </span>
          </Typography>
          <Address value={inkChainInfo[1]} ensProvider={props.mainnetProvider}/>
          </Space>
          <Popover content={detailContent} title="Ink Details">
          <QuestionCircleOutlined />
          </Popover>
          {upgraded?<StarTwoTone />:<></>}
          {likeButton}
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
