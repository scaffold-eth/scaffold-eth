import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, SaveOutlined, EditOutlined, DoubleRightOutlined, CloseCircleOutlined, QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Spin, Input, InputNumber, Form, Typography, Space, List, Popover } from 'antd';
import { useExchangePrice, useGasPrice, useLocalStorage, useContractLoader, useContractReader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, AddressInput, Contract, Address } from "./components"
import { Transactor } from "./helpers"
import CanvasDraw from "react-canvas-draw";
import { ChromePicker, TwitterPicker, CompactPicker, CirclePicker } from 'react-color';
import LZ from "lz-string";
import Blockies from 'react-blockies';

const ipfsAPI = require('ipfs-api');
const isIPFS = require('is-ipfs')
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })
const axios = require('axios');
const pickers = [CompactPicker, ChromePicker, TwitterPicker, CirclePicker]


const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")


function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const writeContracts = useContractLoader(injectedProvider);
  const tx = Transactor(injectedProvider)
  const readContracts = useContractLoader(localProvider);

  const [picker, setPicker] = useLocalStorage("picker", 0)
  const [color, setColor] = useLocalStorage("color", "#666666")
  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [drawingHash, setDrawingHash] = useState()
  const [mode, setMode] = useState("edit")

  const [admin, setAdmin] = useState(true)

  const carousel = useRef(null);
  const drawingCanvas = useRef(null);
  const calculatedVmin = Math.min(window.document.body.clientHeight, window.document.body.clientWidth)
  const [size, setSize] = useState([0.7 * calculatedVmin, 0.7 * calculatedVmin])//["70vmin", "70vmin"]) //["50vmin", "50vmin"][750, 500]

  const [ipfsHash, setIpfsHash] = useState()
  const [values, setValues] = useState({})
  const [image, setImage] = useState()
  const [imageHash, setImageHash] = useState()
  const [ink, setInk] = useState({})
  const [inkHash, setInkHash] = useState()

  const [holders, setHolders] = useState()

  let inkChainInfo
  inkChainInfo = useContractReader(readContracts,'NFTINK',"inkInfoByJsonUrl",[ipfsHash],1777);

  useEffect(() => {
    const loadPage = async () => {
    //on page load checking url path
    let ipfsHashRequest = window.location.pathname.replace("/", "")
    if (ipfsHashRequest && isIPFS.multihash(ipfsHashRequest)) {
      setMode("mint")
      setDrawing("")
      console.log("HASH:", ipfsHashRequest)
      ipfs.files.get(ipfsHashRequest, function (err, files) {
        files.forEach((file) => {
          console.log("LOADED", JSON.parse(file.content))
          setInk(JSON.parse(file.content))
          ipfs.files.get(JSON.parse(file.content)['drawing'], function (err, files) {
            files.forEach((file) => {
          let decompressed = LZ.decompressFromUint8Array(file.content)
          console.log("decompressed from ipfs", decompressed)
          if (decompressed) {
            //let compressed = LZ.compress(decompressed)
            let decompressedObject = JSON.parse(decompressed)
            setSize([decompressedObject['width'],decompressedObject['height']])
            setIpfsHash(ipfsHashRequest)
            drawingCanvas.current.loadSaveData(decompressed, false)
          }
        })
      })
    })
  })
} else {window.history.pushState({id: 'draw'}, 'draw', '/')}
}
loadPage()
  }, [])

  useEffect(()=>{

    const sendInkForm = (inkId) => {

      const sendInk = async (values) => {
      console.log('Success:', address, values, inkId);
      let result = await tx(writeContracts["NFTINK"].safeTransferFrom(address, values['to'], inkId))
      };

      return (
      <Form
      layout={'inline'}
      name="sendInk"
      initialValues={{ inkId: inkId }}
      onFinish={sendInk}
      onFinishFailed={onFinishFailed}
      >
      <Form.Item
      name="to"
      rules={[{ required: true, message: 'Which address should receive this artwork?' }]}
      >
      <AddressInput
        ensProvider={mainnetProvider}
        placeholder={"to address"}
      />
      </Form.Item>

      <Form.Item >
      <Button type="primary" htmlType="submit">
        Send
      </Button>
      </Form.Item>
      </Form>
    )
    }

    const loadHolders = async () => {
    if(ipfsHash && ink['attributes']) {
      inkChainInfo = await readContracts['NFTINK']["inkInfoByJsonUrl"](ipfsHash)
      let mintedCount = inkChainInfo[2]
      let holdersArray = []
      for(var i = 0; i < mintedCount; i++){
        let inkToken = await readContracts['NFTINK']["inkTokenByIndex"](ipfsHash, i)
        let ownerOf = await readContracts['NFTINK']["ownerOf"](inkToken)
        holdersArray.push([ownerOf, inkToken.toString()])
      }

      const sendInkButton = (tokenOwnerAddress, tokenId) => {
      if (tokenOwnerAddress == address) {
        return (
      <Popover content={sendInkForm(tokenId)} title="Send Ink" trigger="click">
        <Button>Send ink</Button>
      </Popover>
    )
    }
  }

      let mintDescription
      if(ink.attributes[0].value == 0) {
        mintDescription = (inkChainInfo[2] + ' minted')
      }
      else {mintDescription = (inkChainInfo[2] + '/' + ink.attributes[0].value + ' minted')}

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
}, [ink, inkChainInfo])

  useEffect(() => {
    if (drawing) {
      console.log("DECOMPRESSING", drawing)
      try {
        let decompressed = LZ.decompress(drawing)
        console.log(decompressed)
        drawingCanvas.current.loadSaveData(decompressed, false)
      } catch (e) {
        console.log(e)
      }
    }
  }, [mode])

  const PickerDisplay = pickers[picker % pickers.length]

  let adminWidgets

  if (admin) {
    adminWidgets = (
      <>
      <div style={{ position: 'fixed', textAlign: 'right', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Button style={{ marginTop: 16 }} shape="round" size="small" onClick={() => {
            setAdmin(false)
          }}><CloseCircleOutlined /></Button>
        </Row>
          <Row align="middle" gutter={4}>
            <Provider name={"mainnet"} provider={mainnetProvider} />
        </Row>
        <Row align="middle" gutter={4}>
            <Provider name={"local"} provider={localProvider} />
          </Row>
          <Row align="middle" gutter={4}>
            <Provider name={"injected"} provider={injectedProvider} />
        </Row>
          <Row align="middle" gutter={4}>
              <Ramp
                price={price}
                address={address}
              />
          </Row>
          <Row align="middle" gutter={4}>
              <Faucet
                localProvider={localProvider}
                price={price}
              />
          </Row>
      </div>
      </>
    )
  } else {
    adminWidgets = (
    <div style={{ position: 'fixed', textAlign: 'right', left: 0, bottom: 20, padding: 10 }}>
    <Button style={{ marginTop: 16 }} shape="round" size="large" onClick={() => {
      setAdmin(true)
    }}><QuestionCircleOutlined /></Button>
    </div>
  )
  }

  let newButton

  if (mode == 'mint') {

    newButton = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
    <Button style={{ marginRight: 8 }} shape="round" size="large" type="primary" onClick={() => {
      window.history.pushState({id: 'draw'}, 'draw', '/')
      setMode("edit")
      setDrawing("")
      setIpfsHash()
      setDrawingHash()
      setImageHash()
      setInkHash()
      setInk({})
    }}><PlusOutlined /> New Ink</Button>
    </div>
  )
  }

  const createInk = values => {
    console.log('Success:', values);

    let imageData = drawingCanvas.current.canvas.drawing.toDataURL("image/png");
    console.log(imageData)
    setImage(imageData)

    let decompressed = LZ.decompress(drawing)
    let compressedArray = LZ.compressToUint8Array(decompressed)

    console.log("compressedArray", compressedArray)

    let drawingBuffer = Buffer.from(compressedArray)
    let imageBuffer = Buffer.from(drawingCanvas.current.canvas.drawing.toDataURL("image/png").split(",")[1], 'base64')

    let currentInk = ink

    currentInk['attributes'] = [{
      "trait_type": "Limit",
      "value": values.limit
    }]
    currentInk['name'] = values.title

    setInk(currentInk)

    console.log("inking...")
    setIpfsHash()
    setMode("mint")

    setIpfsHash()
    setDrawingHash()
    setImageHash()
    setInkHash()
    //setMode("mint")

    console.log("SAVING BUFFER:", imageBuffer)
    let serverUrl = 'http://localhost:3001/save'

    axios.all(
      [axios.post(serverUrl, { buffer: drawingBuffer }),
       axios.post(serverUrl, { buffer: imageBuffer })])
      .then(axios.spread((...responses) => {
        console.log("Responses", responses);
        let currentInk = ink
        currentInk['drawing'] = responses[0].data
        currentInk['image'] = 'https://ipfs.io/ipfs/' + responses[1].data
        console.log("CurrentInk:", currentInk)
        setInk(currentInk)
        console.log("Ink:", ink)

        var inkStr = JSON.stringify(ink);
        // read json string to Buffer
        const inkBuffer = Buffer.from(inkStr);
        axios.post('http://localhost:3001/save', { buffer: inkBuffer })
        .then(async (response) => {
          console.log(response);
          console.log('limit', ink.attributes[0]['value'])
          setIpfsHash(response.data)
          let result = await tx(writeContracts["NFTINK"].createInk(response.data, ink.attributes[0]['value']))//eventually pass the JSON link not the Drawing link
          console.log("result", result)
          inkChainInfo = await readContracts['NFTINK']["inkInfoByJsonUrl"](response.data)
          window.history.pushState({id: response.data}, ink['name'], '/' + response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
      }))
      .catch(function (error) {
        console.log(error);
      });
  };

  const mint = async (values) => {
  console.log('Success:', values);
  let result = await tx(writeContracts["NFTINK"].mint(values['to'], ipfsHash ))//eventually pass the JSON link not the Drawing link
  console.log("result", result)
  };

  const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
  };

  let top, buttons, bottom
  if (mode == "edit") {

    top = (
      <div style={{ width: "90vmin", margin: "0 auto", marginBottom: 16}}>

      <Form
      layout={'inline'}
      name="createInk"
      initialValues={{ limit: 1 }}
      onFinish={createInk}
      onFinishFailed={onFinishFailed}
      labelAlign = {'middle'}
      style={{justifyContent: 'center'}}
      >
      <Form.Item
      name="title"
      rules={[{ required: true, message: 'What is this work of art called?' }]}
      >
      <Input placeholder={"name"} />
      </Form.Item>

      <Form.Item
      name="limit"
      rules={[{ required: true, message: 'How many inks can be made?' }]}
      >
      <InputNumber
      min={0}
      />
      </Form.Item>

      <Form.Item >
      <Button type="primary" htmlType="submit">
        Ink
      </Button>
      </Form.Item>
      </Form>

        <Button style={{ marginTop: 16 }} shape="round" size="large" type="primary" onClick={async () => {
          //setMode("mint")
          //setIpfsHash("QmaSZBLx7em4o3xwPuFvCVbr9EgDUyKxs3ULPaT7x39wUZ")
          //window.history.pushState({id: 'draw'}, 'draw', '/')
          //console.log(drawingCanvas.current.canvas.drawing.toDataURL("image/png"))
          let moonLink = "QmfCWSeGEBGxfVx71Pdjf18xh9ewByvJDd9u4yEcKXqEZK"
          let result = await tx(writeContracts["NFTINK"].createInk(moonLink, 5))//eventually pass the JSON link not the Drawing link
          console.log("result", result)
          inkChainInfo = await readContracts['NFTINK']["inkInfoByJsonUrl"](moonLink)
          window.history.pushState({id: moonLink}, ink['name'], '/' + moonLink)
        }}>Mint Moon</Button>
      </div>

    )

    buttons = (
      <div>
        <Button onClick={() => {
          drawingCanvas.current.undo()
        }}><UndoOutlined /> UNDO</Button>
        <Button onClick={() => {
          drawingCanvas.current.clear()
          setDrawing()
        }}><ClearOutlined /> CLEAR</Button>
        <Button onClick={() => {
          drawingCanvas.current.loadSaveData(LZ.decompress(drawing), false)
        }}><PlaySquareOutlined /> PLAY</Button>
      </div>
    )
    bottom = (
      <Row style={{ width: "90vmin", margin: "0 auto", justifyContent:'center'}}>
        <Space>
        <PickerDisplay
          color={color}
          onChangeComplete={setColor}
        />
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => {
            setPicker(picker + 1)
          }}><DoubleRightOutlined /></Button>
        </div>

        <div style={{margin:16}}>
          <a href={"http://localhost:3000/" + ipfsHash} target="_blank">{ipfsHash}</a>
        </div>
        </Space>
      </Row>
    )
  } else if (mode == "mint") {

    top = (
      <Typography copyable={{text:ink.name}}>
        <span style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
        <a style={{color:"#222222"}}>{ink.name}</a>
        </span>
      </Typography>
    )

    buttons = (
      <div>
        <Button onClick={() => {
          drawingCanvas.current.loadSaveData(LZ.decompress(drawing), false)
        }}><PlaySquareOutlined /> PLAY</Button>
      </div>
    )


    let ipfsDisplay
    let inkChainInfoDisplay
    if (!ipfsHash) {
      ipfsDisplay = (
        <div>
          <Spin /> Uploading to IPFS...
        </div>
      )
    } else {

      let link = "http://localhost:3000/" + ipfsHash

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
          <Address value={inkChainInfo[1]} ensProvider={mainnetProvider}/>
          </Space>
          </Row>
          <Row style={{justifyContent: 'center'}}>
          <Typography.Text copyable={{ text: 'http://localhost:3000/' + ipfsHash }} style={{color:"#222222"}}>{ipfsHash}</Typography.Text>
          </Row>
          </>
        )

      if(address == inkChainInfo[1] && (inkChainInfo[2] < ink.attributes[0].value || ink.attributes[0].value == 0)) {
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
            ensProvider={mainnetProvider}
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

    bottom = (
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
    )
  }

  return (
    <div className="App">

      <Header />

      <div id={'ACCOUNT_HEADER_ID'} style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          hideInterface={false}
          price={price}
        />
      </div>

      <div>
      {top}
          <div style={{ backgroundColor: "#666666", width: size[0], margin: "0 auto", border: "1px solid #999999", boxShadow: "2px 2px 8px #AAAAAA" }}>
            <CanvasDraw
              key={mode}
              ref={drawingCanvas}
              canvasWidth={size[0]}
              canvasHeight={size[1]}
              brushColor={color.hex}
              lazyRadius={4} å
              brushRadius={8}
              disabled={mode != "edit"}
              hideGrid={mode != "edit"}
              hideInterface={mode != "edit"}
              onChange={(newDrawing) => {
                let savedData = LZ.compress(newDrawing.getSaveData())
                setDrawing(savedData)
              }}
            />
          </div>
          <div style={{ padding: 8 }}>
            {buttons}
          </div>
          {bottom}
      </div>

      {adminWidgets}
      {newButton}

    </div>
  );
}

export default App;
