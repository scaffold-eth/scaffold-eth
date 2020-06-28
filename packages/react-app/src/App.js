import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, SaveOutlined, EditOutlined, DoubleRightOutlined, CloseCircleOutlined, QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Spin, Input, InputNumber, Form, Typography, Space, List, Popover } from 'antd';
import { useExchangePrice, useGasPrice, useLocalStorage, useContractLoader, useContractReader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, AddressInput, Contract, Address, AdminWidget } from "./components"
import InkInfo from "./InkInfo.js"
import NftyWallet from "./NftyWallet.js"
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
            //setSize([decompressedObject['width'],decompressedObject['height']])
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

    bottom = <InkInfo
      address={address}
      mainnetProvider={mainnetProvider}
      injectedProvider={injectedProvider}
      ink={ink}
      ipfsHash={ipfsHash}
      readContracts={readContracts}
      setMode={setMode}
      setDrawing={setDrawing}
      setIpfsHash={setIpfsHash}
      setDrawingHash={setDrawingHash}
      setImageHash={setImageHash}
      setInkHash={setInkHash}
      setInk={setInk}
      />
  }

  return (
    <div className="App">

      <Header />

      <Row id={'ACCOUNT_HEADER_ID'} style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
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
        <NftyWallet address={address} readContracts={readContracts}/>
      </Row>

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

      <AdminWidget
      address={address}
      localProvider={localProvider}
      injectedProvider={injectedProvider}
      mainnetProvider={mainnetProvider}
      price={price}/>

    </div>
  );
}

export default App;
