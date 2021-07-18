import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers"
import { Row, Popover, Button, List, Form, Typography, Spin, Space, Descriptions, notification, message, Badge, Skeleton, InputNumber, Input, Tabs } from 'antd';
import { AddressInput, Address, Loader } from "./components"
import { SendOutlined, QuestionCircleOutlined, RocketOutlined, StarTwoTone, LikeTwoTone, ShoppingCartOutlined, ShopOutlined, SyncOutlined, LinkOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { Transactor, getFromIPFS, getSignature, transactionHandler } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import LikeButton from "./LikeButton.js"
import NiftyShop from "./NiftyShop.js"
import UpgradeInkButton from "./UpgradeInkButton.js"
import axios from 'axios';
import { useQuery } from "react-apollo";
import { INK_QUERY, INK_MAIN_QUERY } from "./apollo/queries"
import CanvasDraw from "react-canvas-draw";
import LZ from "lz-string";
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { useHistory } from "react-router-dom";

const uint8arrays = require('uint8arrays')
const { TabPane } = Tabs;

const mainClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_MAINNET,
  cache: new InMemoryCache(),
})

export default function ViewInk(props) {

  let history = useHistory();

  let { hash } = useParams();

  const drawingCanvas = useRef(null);
  const [canvasKey, setCanvasKey] = useState(Date.now());
  const [size, setSize] = useState([0.8 * props.calculatedVmin, 0.8 * props.calculatedVmin])//["70vmin", "70vmin"]) //["50vmin", "50vmin"][750, 500]
  const [drawingSize, setDrawingSize] = useState(10000)
  const drawnLines = useRef([])
  const totalLines = useRef([])
  const [canvasState, setCanvasState] = useState('downloading')

  const [holders, setHolders] = useState(<Spin/>)
  const [minting, setMinting] = useState(false)
  const [buying, setBuying] = useState(false)
  const [mintForm] = Form.useForm();
  const [priceForm] = Form.useForm();
  const [buyButton, setBuyButton] = useState()
  const [mintFlow, setMintFlow] = useState()

//  const [inkChainInfo, setInkChainInfo] = useState()
  const [targetId, setTargetId] = useState()
//  const [inkPrice, setInkPrice] = useState(0)
  //const [mintedCount, setMintedCount] = useState()

  const [inkJson, setInkJson] = useState({})
  const [mainnetTokens, setMainnetTokens] = useState({})
  const [blockNumber, setBlockNumber] = useState(0)
  const [data, setData] = useState()
  const [tokenTxs, setTokenTxs] = useState([]);
  const [inkTokenTransfers, setInkTokenTransfers] = useState([]);

  const [drawing, setDrawing] = useState()

  const { loading: loadingMain, error: errorMain, data: dataMain } = useQuery(INK_MAIN_QUERY, {
    variables: { inkUrl: hash },
    pollInterval: 2500,
    client: mainClient
  });

  const { loading, error, data: dataRaw } = useQuery(INK_QUERY, {
    variables: { inkUrl: hash, liker: props.address ? props.address.toLowerCase() : '' },
    pollInterval: 2500
  });

  useEffect(() => {

    const getInk = async (_data) => {
      let _blockNumber = parseInt(_data.metaData.value)
      //console.log(blockNumber, _blockNumber)
      if(_blockNumber >= blockNumber) {
      let tIpfsConfig = {...props.ipfsConfig}
      tIpfsConfig['timeout'] = 10000
      let newInkJson = await getFromIPFS(_data.ink.jsonUrl, tIpfsConfig)

      setData(_data)
      setBlockNumber(_blockNumber)
      setInkJson(JSON.parse(uint8arrays.toString(newInkJson)))
    }
    };

    (dataRaw && dataRaw.ink) ? getInk(dataRaw) : console.log("loading");
    (dataRaw && dataRaw.ink) ? setInkTokenTransfers(dataRaw.ink.tokenTransfers) : console.log()
  }, [dataRaw, props.address]);

  useEffect(() => {
    if((props.address && data && data.ink && props.address.toLowerCase() === data.ink.artist.id) && (parseInt(data.ink.count) < parseInt(data.ink.limit) || data.ink.limit === "0")) {
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
          setMintFlow(
            <Popover content={mintInkForm}
            title="Mint">
            <Button type="secondary" loading={minting}><SendOutlined/> Mint</Button>
            </Popover>
          )
        }
    (data && data.ink) ? setBuyButton(<NiftyShop
                                        injectedProvider={props.injectedProvider}
                                        metaProvider={props.metaProvider}
                                        type={'ink'}
                                        ink={inkJson}
                                        itemForSale={hash}
                                        gasPrice={props.gasPrice}
                                        address={props.address?props.address.toLowerCase():null}
                                        ownerAddress={data.ink.artist.id}
                                        priceNonce={data.ink.mintPriceNonce?data.ink.mintPriceNonce:"0"}
                                        price={data.ink.mintPrice}
                                        transactionConfig={props.transactionConfig}
                                        visible={data.ink.count?(parseInt(data.ink.count) < parseInt(data.ink.limit) || data.ink.limit === "0"):false}
                                        />) : console.log('waiting')

  }, [data, props.address, inkJson]);

  useEffect(() => {
    if(dataMain) {
      let tempMainnetTokens = {}
      for (let i of dataMain.tokens) {
        console.log(i)
        tempMainnetTokens[i['id']] = i['owner']
        }

      setMainnetTokens(tempMainnetTokens)
    }
  }, [dataMain]);

  let mintDescription
  let inkChainInfoDisplay
  let detailContent
  let likeButtonDisplay
  let detailsDisplay
  let nextHolders
  let tokenTransfers

  let mint = async (values) => {
    setMinting(true)

    let contractName = "NiftyToken"
    let regularFunction = "mint"
    let regularFunctionArgs = [values['to'], hash]
    let signatureFunction = "mintFromSignature"
    let signatureFunctionArgs = [values['to'], hash]
    let getSignatureTypes = ['bytes','bytes','address','address','string','uint256']
    let getSignatureArgs = ['0x19','0x00',require('./contracts/NiftyToken.address.js'),values['to'],hash,parseInt(data.ink.count)]

    let mintInkConfig = {
      ...props.transactionConfig.current,
      contractName,
      regularFunction,
      regularFunctionArgs,
      signatureFunction,
      signatureFunctionArgs,
      getSignatureTypes,
      getSignatureArgs,
    }

    console.log(mintInkConfig)

    const bytecode = await props.transactionConfig.current.localProvider.getCode(values['to']);
    const mainnetBytecode = await props.mainnetProvider.getCode(values['to']);
    let result
    if ((!bytecode || bytecode === "0x" || bytecode === "0x0" || bytecode === "0x00") && (!mainnetBytecode || mainnetBytecode === "0x" || mainnetBytecode === "0x0" || mainnetBytecode === "0x00")) {
      result = await transactionHandler(mintInkConfig)
      notification.open({
          message: '🙌 Minting successful!',
          description:
          "👀 Minted to " + values['to'],
        });
    } else {
      notification.open({
          message: '📛 Sorry! Unable to mint to this address',
          description:
          "This address is a smart contract 📡",
        });
    }

    mintForm.resetFields();
    setMinting(false)
    console.log("result", result)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const viewArtist = (address) => {
    props.setArtist(address)
    props.setTab('inks')
  }

const [copyWord, setCopyWord] = useState()

const clickAndSave = (
  <Popover trigger="click"
      content={
        <div>
        <Input value={copyWord} onChange={(e)=>{
          setCopyWord(e.target.value)
        }}/>
        {(copyWord===process.env.REACT_APP_COPY_WORD)&&<Button onClick={()=>{
          let _savedData = LZ.compress(drawing)
          props.setDrawing(_savedData)
          console.log('saved')
        }}><StarTwoTone/>
        </Button>}
        </div>
      }>
                <QuestionCircleOutlined />
                </Popover>
)

  useEffect(()=>{
    setCanvasKey(Date.now());
    const showDrawing = async () => {
    if (hash) {
      let tIpfsConfig = {...props.ipfsConfig}
      tIpfsConfig['timeout'] = 100000
      let drawingContent
      try {
        console.log(`fetching from ipfs ${new Date().toISOString()}`)
        drawingContent = await getFromIPFS(hash, tIpfsConfig)
        console.log(`received from ipfs ${new Date().toISOString()}`)
      } catch (e) { console.log("Loading error:",e)}
      try{
        setCanvasState('decompressing')
        console.log(`decompressing ${new Date().toISOString()}`)
        let decompressed = LZ.decompressFromUint8Array(drawingContent)
        //console.log(decompressed)

        console.log(`finding length ${new Date().toISOString()}`)
        let points = 0
        for (const line of JSON.parse(decompressed)['lines']){
          points = points + line.points.length
        }

        console.log(`saving ${new Date().toISOString()}`)

        setDrawingSize(points)
        totalLines.current = JSON.parse(decompressed)['lines'].length
        if(points < 10000) {
          setCanvasState('drawing')
          drawingCanvas.current.loadSaveData(decompressed, false)
          setDrawing(decompressed)
        } else {
          setCanvasState('ready')
          setDrawing(decompressed)
        }
        console.log(`done ${new Date().toISOString()}`)

      }catch(e){console.log("Drawing Error:",e)}
    }
    }
    showDrawing()

  }, [hash])

    if (!inkJson || !inkJson.name || !data ) {
      inkChainInfoDisplay =   <div style={{marginTop:32}}>
          <Spin/>
          {(drawing)&&clickAndSave}
        </div>
    } else {
      const sendInkButton = (tokenOwnerAddress, tokenId) => {
        if (props.address && tokenOwnerAddress.toLowerCase() === props.address.toLowerCase()) {
          return (
            <Popover content={
              <SendInkForm tokenId={tokenId} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} transactionConfig={props.transactionConfig}/>
            }
            title="Send Ink">
              <Button type="secondary" style={{margin:4,marginBottom:12}}><SendOutlined/> Send</Button>
            </Popover>
          )
        }
      }

      const relayTokenButton = (relayed, tokenOwnerAddress, tokenId) => {
        if (props.address && tokenOwnerAddress.toLowerCase() === props.address.toLowerCase() && relayed === false) {
          return (
            <UpgradeInkButton
              tokenId={tokenId}
              injectedProvider={props.injectedProvider}
              gasPrice={props.gasPrice}
              upgradePrice={props.upgradePrice}
              transactionConfig={props.transactionConfig}
            />
          )
        }
      }


      if(data.ink && data.ink.limit === "0") {
        mintDescription = ((data.ink.count?data.ink.count:'0') + ' minted')
      }
      else if (data.ink) {mintDescription = ((data.ink.count?data.ink.count:'0') + '/' + data.ink.limit + ' minted')}


      if(data && data.ink) {
      nextHolders = (
        <Row style={{justifyContent: 'center'}}>
        <List
        header={<Row style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}> <Space><Typography.Title level={3} style={{marginBottom: '0px'}}>{mintDescription}</Typography.Title> {mintFlow}{buyButton}</Space></Row>}
        itemLayout="horizontal"
        dataSource={data.ink.tokens}
        renderItem={item => {

          const openseaButton = (
            <Button type="primary" style={{ margin:8, background: "#722ed1", borderColor: "#722ed1"  }} onClick={()=>{
              console.log("item",item)
              window.open("https://opensea.io/assets/0xc02697c417ddacfbe5edbf23edad956bc883f4fb/"+item.id)
            }}>
             <RocketOutlined />  View on OpenSea
            </Button>
          )


          return (
            <List.Item>
              <Link to={`/holdings/${mainnetTokens[item.id]?mainnetTokens[item.id]:item.owner.id}`}>
              <Address value={mainnetTokens[item.id]?mainnetTokens[item.id]:item.owner.id} ensProvider={props.mainnetProvider} clickable={false} notCopyable={true}/>
              </Link>
              <a style={{padding:8,fontSize:32}} href={"https://blockscout.com/poa/xdai/tokens/0xCF964c89f509a8c0Ac36391c5460dF94B91daba5/instance/"+item.id} target="_blank"><LinkOutlined /></a>
              {mainnetTokens[item.id]?openseaButton:(item.network === 'mainnet'?(<Typography.Title level={4} style={{marginLeft:16}}>Upgrading to Ethereum <SyncOutlined spin /></Typography.Title>):<></>)}
              {sendInkButton(item.owner.id, item.id)}
              {relayTokenButton(item.network === 'mainnet', item.owner.id, item.id)}
              <div style={{marginLeft:4,marginTop:4}}>
              <NiftyShop
              injectedProvider={props.injectedProvider}
              metaProvider={props.metaProvider}
              type={'token'}
              ink={inkJson}
              itemForSale={item.id}
              gasPrice={props.gasPrice}
              address={props.address?props.address.toLowerCase():null}
              ownerAddress={item.owner.id}
              price={item.price}
              visible={!(item.network === 'mainnet')}
              transactionConfig={props.transactionConfig}
              />
              </div>
            </List.Item>
          )
        }}
        />
        </Row>)


          detailContent = (
            <Descriptions>
              <Descriptions.Item label="Name">{inkJson.name}</Descriptions.Item>
              <Descriptions.Item label="Artist">{data.ink.artist.id}</Descriptions.Item>
              <Descriptions.Item label="drawingHash">{hash} {clickAndSave}</Descriptions.Item>
              <Descriptions.Item label="id">{data.ink.inkNumber}</Descriptions.Item>
              <Descriptions.Item label="jsonUrl">{data.ink.jsonUrl}</Descriptions.Item>
              <Descriptions.Item label="Image">{<a href={inkJson.image} target="_blank">{inkJson.image}</a>}</Descriptions.Item>
              <Descriptions.Item label="Count">{data.ink.count?data.ink.count:'0'}</Descriptions.Item>
              <Descriptions.Item label="Limit">{data.ink.limit}</Descriptions.Item>
              <Descriptions.Item label="Description">{inkJson.description}</Descriptions.Item>
              <Descriptions.Item label="Price">{(data.ink.mintPrice > 0)?ethers.utils.formatEther(data.ink.mintPrice):"No price set"}</Descriptions.Item>
            </Descriptions>
          )

        likeButtonDisplay = (
          <div style={{marginLeft:props.calculatedVmin*0.8,marginTop:-20}}>
            <LikeButton
              metaProvider={props.metaProvider}
              metaSigner={props.metaSigner}
              injectedGsnSigner={props.injectedGsnSigner}
              signingProvider={props.injectedProvider}
              localProvider={props.kovanProvider}
              contractAddress={props.readKovanContracts?props.readKovanContracts['NiftyInk']['address']:''}
              targetId={data.ink.inkNumber}
              likerAddress={props.address}
              transactionConfig={props.transactionConfig}
              likeCount={data.ink.likeCount}
              hasLiked={data.ink&&data.ink.likes.length>0}
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
            <Link to={`/artist/${data.ink.artist.id}`}>

            <Typography>
            <span style={{verticalAlign:"middle",fontSize:16}}>
            {" artist: "}
            </span>
            </Typography>
            <Address value={data.ink.artist.id} ensProvider={props.mainnetProvider} clickable={false} notCopyable={true}/>
            <Typography>
            <span style={{verticalAlign:"middle",fontSize:16}}>
            {data.ink.createdAt&&(new Date(parseInt(data.ink.createdAt) * 1000)).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            </Typography>
            </Link>
            </Space>

            </Row>
          </>
        )

        tokenTransfers = (
          inkTokenTransfers && inkTokenTransfers.length > 0 ?
            <div style={{maxWidth: "700px", margin: "0 auto", textAlign: "left"}}>
                   <ul style={{listStyle: "none", padding: "5px", margin: "0"}}>
                      <li style={{padding: "2px 6px", display: "flex", justifyContent: "space-between", fontWeight: "bold", background: "#f5f5f5"}}>
                        <span style={{flexBasis: "10%", flexGrow: "1", fontWeight: "bold"}}>Edition</span>
                        <span style={{flexBasis: "10%", flexGrow: "1", fontWeight: "bold"}}>Action</span>
                        <span style={{flexBasis: "25%", flexGrow: "1", fontWeight: "bold"}}>From</span>
                        <span style={{flexBasis: "25%", flexGrow: "1", fontWeight: "bold"}}>To</span>
                        <span style={{flexBasis: "8%", flexGrow: "1", fontWeight: "bold"}}>Price</span>
                        <span style={{flexBasis: "12%", flexGrow: "1", fontWeight: "bold"}}>Date</span>
                    </li>
                  </ul>
                  {inkTokenTransfers.map((transfer, transferIndex) =>
                    <li key={transfer.id} style={{padding: "2px 6px", display: "flex", justifyContent: "space-between"}}>
                      <span style={{flexBasis: "10%", flexGrow: "1", fontWeight: "bold"}}>{transfer.token.edition}</span>
                      <span style={{flexBasis: "10%", flexGrow: "1"}}>
                        <Link to={{ pathname: `https://blockscout.com/xdai/mainnet/tx/${transfer.transactionHash}` }} target="_blank" rel="noopener noreferrer">
                          { (transfer.sale && transfer.sale.id)
                            ? "Purchase"
                            : (transfer.to.id=== "0x0000000000000000000000000000000000000000" || transfer.to.id=== "0x000000000000000000000000000000000000dead")
                            ? "Burn"
                            : (transfer.from.id=== "0x0000000000000000000000000000000000000000")
                            ? "Mint"
                            : (transfer.to.id=== "0x73ca9c4e72ff109259cf7374f038faf950949c51")
                            ? "Upgrade"
                            : "Transfer"}
                        </Link>
                        </span>
                      <span style={{flexBasis: "25%", flexGrow: "1"}} className="token-transfer-table-address">
                          {transfer.from.id=== "0x0000000000000000000000000000000000000000" ?
                            null
                          :
                            <Link to={`/holdings/${transfer.from.id}`}>
                              <Address value={transfer.from.id} ensProvider={props.mainnetProvider} clickable={false} notCopyable={true}/>
                            </Link>
                          }
                        </span>
                      <span style={{flexBasis: "25%", flexGrow: "1"}} className="token-transfer-table-address">
                          {
                            <Link to={`/holdings/${transfer.to.id}`}>
                              <Address value={transfer.to.id} ensProvider={props.mainnetProvider} clickable={false} notCopyable={true}/>
                            </Link>
                          }
                      </span>
                      <span style={{flexBasis: "8%", flexGrow: "1"}}>{transfer.sale&&transfer.sale.price ? "$"+(parseInt(transfer.sale.price) / 1e18).toFixed(2) : "-"}</span>
                      <span style={{flexBasis: "12%", flexGrow: "1"}}>{transfer.createdAt&&(new Date(parseInt(transfer.createdAt) * 1000)).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </li>
                  )}
            </div> : null
        )
    }
  }

    let imageFromIpfsToHelpWithNetworking
    if(inkJson){
      imageFromIpfsToHelpWithNetworking = <img width={1} height={1} src={inkJson.image} />
    }

    let bottom = (
      <div>
        {likeButtonDisplay}
        {detailsDisplay}
        <div style={{ marginTop: 16, margin: "auto" }}>
          {inkChainInfoDisplay}
        </div>

        <div style={{marginTop:20}}>
        <Tabs defaultActiveKey="1" size="large" type="card">
          <TabPane tab="Details" key="1">
            {nextHolders}
          </TabPane>
          <TabPane tab="History" key="2">
            {tokenTransfers}
          </TabPane>
        </Tabs>
        </div>
        {imageFromIpfsToHelpWithNetworking}
      </div>
    )

    let top = (
      <div>
        <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"1vh", justifyContent:'center'}}>

          {(data&&data.ink.burned)?<Typography.Text style={{color:"#222222"}} style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
            <span
              role="img"
              aria-label="Fire"
            >
              🔥🔥This ink has been burned🔥🔥
            </span>
          </Typography.Text>
          :
          <Typography.Text style={{color:"#222222"}} copyable={{ text: inkJson?inkJson.external_url:''}} style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
            <a href={'/' + hash} style={{color:"#222222"}}>{inkJson?inkJson.name:<Spin/>}</a>
          </Typography.Text>
        }

          <Button loading={canvasState!=='ready'} disabled={canvasState!=='ready'} style={{marginTop:4,marginLeft:4}} onClick={() => {
            setDrawingSize(0)
            drawingCanvas.current.loadSaveData(drawing, false)
            setCanvasState('drawing')
          }}><PlaySquareOutlined /> {canvasState==='ready'?'PLAY':canvasState}</Button>

          {(data&&data.ink&&props.address&&props.address.toLowerCase()==data.ink.artist.id)&&<Button style={{marginTop:4,marginLeft:4}} onClick={() => {
            let _savedData = LZ.compress(drawing)
            props.setDrawing(_savedData)
            history.push('/create')
          }}><span
            style={{ marginRight: 12 }}
            role="img"
            aria-label="Fork"
          >🍴</span> FORK</Button>}

        </Row>
      </div>

    )

    return (
      <div style={{textAlign:"center"}}>
      {top}
      <div style={{ backgroundColor: "#666666", width: size[0], height: size[0], margin: "0 auto", border: "1px solid #999999", boxShadow: "2px 2px 8px #AAAAAA" }}>
      <div style={{position: "relative"}}>
      {(drawingSize >= 10000)&&<div style={{width:"100%", position: "absolute", zIndex: 90, margin: 'auto' }}>
        {inkJson.image?<img width="100%" height="100%" src={inkJson.image} />:<Loader/>}
      </div>}
      <div style={{ width: "100%", height:"100%", position: "absolute" }}>
      {<CanvasDraw
        key={canvasKey}
        ref={drawingCanvas}
        canvasWidth={size[0]}
        canvasHeight={size[1]}
        lazyRadius={4}
        disabled={true}
        hideGrid={true}
        hideInterface={true}
        //saveData={drawing}
        immediateLoading={drawingSize >= 10000}
        loadTimeOffset={3}
        onChange={()=>{
          try {
          drawnLines.current = drawingCanvas.current.lines.length
          if (drawnLines.current>=totalLines.current && canvasState!=='ready') {
            console.log('enabling it!')
            setCanvasState('ready')
          }} catch (e){
            console.log(e)
          }
        }}
        />}
      </div>
      </div>
      </div>
      {bottom}
      </div>
    )
  }
