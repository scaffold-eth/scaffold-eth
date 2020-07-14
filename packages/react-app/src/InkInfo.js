import React, { useState, useEffect } from 'react'
import { Row, Popover, Button, List, Form, Typography, Spin, Space, Descriptions } from 'antd';
import { AddressInput, Address } from "./components"
import { SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { Transactor, getFromIPFS } from "./helpers"
import SendInkForm from "./SendInkForm.js"
var _ = require('lodash');

export default function InkInfo(props) {

  const [holders, setHolders] = useState(<></>)
  const [sends, setSends] = useState(0)
  const [minting, setMinting] = useState(false)
  const [form] = Form.useForm();

  const writeContracts = useContractLoader(props.injectedProvider);
  //console.log("inkinfo transctor setup with props.gasPrice",props.gasPrice)
  const tx = Transactor(props.injectedProvider,props.gasPrice)
  const [referenceInkChainInfo, setReferenceInkChainInfo] = useState()

  //let inkChainInfo
  //inkChainInfo = useContractReader(props.readContracts,'NFTINK',"inkInfoByInkUrl",[props.ipfsHash],1777);
  const [inkChainInfo, setInkChainInfo] = useState()

  let mintFlow
  let inkChainInfoDisplay
  let detailContent

  const loadingTip = ''

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
      if(props.ipfsHash){
        try {
        const newChainInfo = await props.readContracts['NFTINK']["inkInfoByInkUrl"](props.ipfsHash)
        setInkChainInfo(newChainInfo)
      } catch(e){ console.log(e)}
      }
    }
    getChainInfo()
  }, 1777
)

  useEffect(()=>{

    const loadHolders = async () => {
      if(props.ipfsHash && props.ink['attributes'] && inkChainInfo) {
        //inkChainInfo = await props.readContracts['NFTINK']["inkInfoByInkUrl"](props.ipfsHash)
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
        //<Typography.Text>{'Token ID: ' + item[1] + " owned by "}</Typography.Text>
        let mintDescription
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
          <Spin tip={loadingTip}/>
        </div>
      )
    } else {
      if(inkChainInfo && props.ink.attributes) {

          detailContent = (
            <Descriptions>
              <Descriptions.Item label="Name">{props.ink.name}</Descriptions.Item>
              <Descriptions.Item label="Artist">{inkChainInfo[1]}</Descriptions.Item>
              <Descriptions.Item label="jsonUrl">{inkChainInfo[3]}</Descriptions.Item>
              <Descriptions.Item label="Image">{props.ink.image}</Descriptions.Item>
              <Descriptions.Item label="Count">{inkChainInfo[2].toString()}</Descriptions.Item>
              <Descriptions.Item label="Limit">{props.ink.attributes[0].value}</Descriptions.Item>
              <Descriptions.Item label="Description">{props.ink.description}</Descriptions.Item>
            </Descriptions>
          )

      if(props.address === inkChainInfo[1] && (inkChainInfo[2] < Number(props.ink.attributes[0].value) || props.ink.attributes[0].value === "0")) {
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
