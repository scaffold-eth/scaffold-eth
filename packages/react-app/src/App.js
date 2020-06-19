import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, SaveOutlined, EditOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Row, Col, Button, Spin, Input, InputNumber } from 'antd';
import { useExchangePrice, useGasPrice, useLocalStorage, useContractLoader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, AddressInput, Contract } from "./components"
import { Transactor } from "./helpers"
import CanvasDraw from "react-canvas-draw";
import { ChromePicker, TwitterPicker, CompactPicker, SwatchesPicker } from 'react-color';
import LZ from "lz-string";

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })
const axios = require('axios');
const pickers = [CompactPicker, ChromePicker, TwitterPicker, SwatchesPicker]


const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")


function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const writeContracts = useContractLoader(injectedProvider);
  const tx = Transactor(injectedProvider)

  const [picker, setPicker] = useLocalStorage("picker", 0)
  const [color, setColor] = useLocalStorage("color", "#666666")
  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [drawingHash, setDrawingHash] = useState()
  //console.log("drawing",drawing)
  const [mode, setMode] = useState("edit")

  const carousel = useRef(null);
  const drawingCanvas = useRef(null);
  const size = [750, 500]

  const [ipfsHash, setIpfsHash] = useState()
  const [values, setValues] = useState({})
  const [image, setImage] = useState()
  const [imageHash, setImageHash] = useState()
  const [ink, setInk] = useState({})
  const [inkHash, setInkHash] = useState()

  useEffect(() => {
    //on page load checking url path
    let ipfsHashRequest = window.location.pathname.replace("/", "")
    if (ipfsHashRequest) {
      setMode("view")
      setDrawing("")
      console.log("HASH:", ipfsHashRequest)
      ipfs.files.get(ipfsHashRequest, function (err, files) {
        files.forEach((file) => {
          console.log("LOADED", JSON.parse(file.content))
          setInk(file.content)
          ipfs.files.get(JSON.parse(file.content)['drawing'], function (err, files) {
            files.forEach((file) => {
          let decompressed = LZ.decompressFromUint8Array(file.content)
          console.log("decompressed frim ipfs", decompressed)
          if (decompressed) {
            let compressed = LZ.compress(decompressed)
            drawingCanvas.current.loadSaveData(decompressed, false)
          }
        })
      })
    })
  })
    }
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

  let buttons, bottom
  if (mode == "edit") {
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
        <Button onClick={() => {
          //var image = drawingCanvas.current.canvas.drawing.toDataURL("image/png").replace("image/png", "image/octet-stream");
          //window.location.href=image;
          console.log(drawingCanvas.current.canvas.drawing.toDataURL("image/png"))
        }}><UndoOutlined /> To Image</Button>
      </div>
    )
    bottom = (
      <div style={{ width: 225, margin: "0 auto", marginTop: 16 }}>
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

        <div>

          <Input
            size={"large"}
            placeholder={"name"}
            value={ink['name']}
            onChange={(e) => {
              let currentInk = ink
              currentInk['name'] = e.target.value
              setInk(currentInk)
            }}
          />

          <Input
            size={"large"}
            placeholder={"description"}
            value={ink['description']}
            onChange={(e) => {
              let currentInk = ink
              currentInk['description'] = e.target.value
              setInk(currentInk)
            }}
          />

          <InputNumber
            size={"large"}
            //value={ink['limit']}
            defaultValue={1}
            min={1}
            onChange={(e) => {
              let currentInk = ink
              currentInk['attributes'] = [{
                "trait_type": "Limit",
                "value": e
              }]
              setInk(currentInk)
              console.log(currentInk)
            }}
          />


          <Button style={{ marginTop: 16 }} shape="round" size="large" type="primary" onClick={async () => {
            console.log("inking...")
            setIpfsHash()
            setMode("mint")

            setIpfsHash()
            setDrawingHash()
            setImageHash()
            setInkHash()
            //setMode("mint")

            let imageData = drawingCanvas.current.canvas.drawing.toDataURL("image/png");
            console.log(imageData)
            setImage(imageData)

            let decompressed = LZ.decompress(drawing)
            let compressedArray = LZ.compressToUint8Array(decompressed)

            console.log("compressedArray", compressedArray)

            let drawingBuffer = Buffer.from(compressedArray)
            let imageBuffer = Buffer.from(imageData.split(",")[1], 'base64')

            console.log("SAVING BUFFER:", imageBuffer)
            axios.all(
              [axios.post('http://localhost:3001/save', { buffer: drawingBuffer }),
               axios.post('http://localhost:3001/save', { buffer: imageBuffer })])
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
                })
                .catch(function (error) {
                  console.log(error);
                });
              }))
              .catch(function (error) {
                console.log(error);
              });


          }}>Ink</Button>
        </div>
      </div>
    )
  } else if (mode == "mint") {
    buttons = (
      <div>
        <Button style={{ marginRight: 8 }} shape="round" size="large" type="primary" onClick={() => {
          setMode("edit")
        }}><EditOutlined /> EDIT</Button>

        <Button onClick={() => {
          drawingCanvas.current.loadSaveData(LZ.decompress(drawing), false)
        }}><PlaySquareOutlined /> PLAY</Button>
      </div>
    )


    let ipfsDisplay
    if (!ipfsHash) {
      ipfsDisplay = (
        <div>
          <Spin /> Uploading to IPFS...
        </div>
      )
    } else {

      let link = "http://localhost:3000/" + ipfsHash

      ipfsDisplay = (
        <div>

          <div style={{margin:16}}>
            <a href={link} target="_blank">{ipfsHash}</a>
          </div>

          <Input
            size={"large"}
            placeholder={"name"}
            value={ink['name']}
            onChange={(e) => {
              let currentInk = ink
              currentInk['name'] = e.target.value
              setInk(currentInk)
            }}
          />

          <Input
            size={"large"}
            placeholder={"description"}
            value={ink['description']}
            onChange={(e) => {
              let currentInk = ink
              currentInk['description'] = e.target.value
              setInk(currentInk)
            }}
          />

          <InputNumber
            size={"large"}
            value={ink['limit']}
            defaultValue={1}
            min={1}
            onChange={(e) => {
              console.log(e)
              //let currentInk = ink
              //currentInk['limit'] = e.target.value
              //setInk(currentInk)
            }}
          />

/*
          <AddressInput
            value={values['to']}
            ensProvider={mainnetProvider}
            placeholder={"to address"}
            onChange={(address) => {
              let currentValues = values
              currentValues['to'] = address
              setValues(currentValues)
            }}
          />
          */


          <Button style={{ marginTop: 16 }} shape="round" size="large" type="primary" onClick={async () => {
            console.log("minting...")
            let result = await tx(writeContracts["NFTINK"].mint(values['to'], link ))//eventually pass the JSON link not the Drawing link
            console.log("result", result)
          }}>Mint</Button>
        </div>
      )
    }

    bottom = (
      <div style={{ marginTop: 16, width: 255, margin: "auto" }}>
        {ipfsDisplay}
        { <Contract
          name={"NFTINK"}
          provider={injectedProvider}
          address={address}
        /> }
      </div>
    )
  } else if (mode == "view") {
    buttons = (
      <Button onClick={() => {
        drawingCanvas.current.loadSaveData(LZ.decompress(drawing), false)
      }}><PlaySquareOutlined /> PLAY</Button>
    )
  }

  return (
    <div className="App">

      <Header />

      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
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
        <Row>
          <Col span={16}>
          <div style={{ padding: 16 }}>
            {buttons}
          </div>
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
          </Col>
          <Col span={8}>
          {bottom}
          </Col>
        </Row>


        <div style={{ marginTop: 16 }}>

        </div>
      </div>

      <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Col span={10}>
            <Provider name={"mainnet"} provider={mainnetProvider} />
          </Col>
          <Col span={6}>
            <Provider name={"local"} provider={localProvider} />
          </Col>
          <Col span={8}>
            <Provider name={"injected"} provider={injectedProvider} />
          </Col>
        </Row>
      </div>

      <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Col span={9}>
            <Ramp
              price={price}
              address={address}
            />
          </Col>
          <Col span={15}>
            <Faucet
              localProvider={localProvider}
              price={price}
            />
          </Col>
        </Row>
      </div>

    </div>
  );
}

export default App;
