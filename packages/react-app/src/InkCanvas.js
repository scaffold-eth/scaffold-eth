import React, { useState, useRef, useEffect } from 'react'
import { ethers } from "ethers";
import 'antd/dist/antd.css';
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, HighlightOutlined } from '@ant-design/icons';
import { Row, Col, Button, Input, InputNumber, Form, Typography, Checkbox, notification, message } from 'antd';
import { useLocalStorage, useContractLoader, useBalance } from "./hooks"
import { Transactor, addToIPFS, getFromIPFS } from "./helpers"
import CanvasDraw from "react-canvas-draw";
import { CompactPicker, CirclePicker, GithubPicker, TwitterPicker } from 'react-color';
import LZ from "lz-string";
const Hash = require('ipfs-only-hash')
const axios = require('axios');
const pickers = [CirclePicker, TwitterPicker, GithubPicker, CompactPicker]


export default function InkCanvas(props) {

  const writeContracts = useContractLoader(props.injectedProvider);
  const metaWriteContracts = useContractLoader(props.metaProvider);
  //console.log("Transactor setup with gasprice ",props.gasPrice)
  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const balance = useBalance(props.address,props.metaProvider)

  const [picker, setPicker] = useLocalStorage("picker", 0)
  const [color, setColor] = useLocalStorage("color", "#666666")

  const drawingCanvas = useRef(null);
  const calculatedVmin = Math.min(window.document.body.clientHeight, window.document.body.clientWidth)
  const [size, setSize] = useState([0.7 * calculatedVmin, 0.7 * calculatedVmin])//["70vmin", "70vmin"]) //["50vmin", "50vmin"][750, 500]

  const [sending, setSending] = useState()

  useEffect(() => {
    const loadPage = async () => {
        if (props.ipfsHash) {
          console.log('ipfsHash Set')
        }
        else if (props.drawing && props.drawing !== "") {
          try {
            let decompressed = LZ.decompress(props.drawing)
            drawingCanvas.current.loadSaveData(decompressed, false)
          } catch (e) {
            console.log(e)
          }
        }
    }
    loadPage()
  }, [])

  useEffect(() => {
    const showDrawing = async () => {
    if (props.ipfsHash && props.drawing && props.drawing !== "") {
      try {
        let decompressed = LZ.decompress(props.drawing)
        drawingCanvas.current.loadSaveData(decompressed, false)
      } catch (e) {
        console.log(e)
      }
    } else if (props.ipfsHash) {
      let drawingContent = await getFromIPFS(props.ipfsHash, props.ipfsConfig)
      try{
        const arrays = new Uint8Array(drawingContent._bufs.reduce((acc, curr) => [...acc, ...curr], []));
        let decompressed = LZ.decompressFromUint8Array(arrays)
        if (decompressed) {
          let compressed = LZ.compress(decompressed)
          props.setDrawing(compressed)

          drawingCanvas.current.loadSaveData(decompressed, false)
        }
      }catch(e){console.log("Drawing Error:",e)}
    }
  }
  showDrawing()
}, [props.ipfsHash])

  const PickerDisplay = pickers[picker % pickers.length]

  const mintInk = async (inkUrl, jsonUrl) => {
    let result
    console.log("INK")
    let enough = ethers.utils.parseEther("0.0001")
    let needsGSN = balance.lt(enough)
    console.log("needsGSN",needsGSN)
    if(needsGSN){
      try {
        setSending(true)
        notification.open({
          message: '📡 ',
          description:
          'sending meta transaction...',
        });
        //no tx() here, we'll manually alert for meta tx for now
        result = await metaWriteContracts["NFTINK"].createInk(inkUrl, jsonUrl, props.ink.attributes[0]['value'])
        notification.open({
          message: '🛰',
          description:(
            <a href={"https://kovan.etherscan.io/tx/"+result.hash}>sent! view transaction.</a>
          ),
        });
        setSending(false)
      } catch {
        console.log('the old fashioned way')
        setSending(true)
        result = await tx(writeContracts["NFTINK"].createInk(inkUrl, jsonUrl, props.ink.attributes[0]['value'],{gasPrice: props.gasPrice}))
        setSending(false)
      }
    }else{
      setSending(true)
      result = await tx(writeContracts["NFTINK"].createInk(inkUrl, jsonUrl, props.ink.attributes[0]['value'],{gasPrice: props.gasPrice}))
    }

    console.log("result", result)
    return result
  }

  const createInk = async values => {
    console.log('Success:', values);

    let imageData = drawingCanvas.current.canvas.drawing.toDataURL("image/png");

    let decompressed = LZ.decompress(props.drawing)
    let compressedArray = LZ.compressToUint8Array(decompressed)

    let drawingBuffer = Buffer.from(compressedArray)
    let imageBuffer = Buffer.from(imageData.split(",")[1], 'base64')

    let currentInk = props.ink

    currentInk['attributes'] = [{
      "trait_type": "Limit",
      "value": values.limit.toString()
    }]
    currentInk['name'] = values.title
    let newEns
    try {
      newEns = await props.mainnetProvider.lookupAddress(props.address)
    } catch (e) { console.log(e) }
    const timeInMs = new Date()
    const addressForDescription = !newEns?props.address:newEns
    currentInk['description'] = 'A Nifty Ink by ' + addressForDescription + ' on ' + timeInMs.toUTCString()

    props.setIpfsHash()

    const drawingHash = await Hash.of(drawingBuffer)
    console.log("drawingHash", drawingHash)
    const imageHash = await Hash.of(imageBuffer)
    console.log("imageHash", imageHash)

    currentInk['drawing'] = drawingHash
    currentInk['image'] = 'https://ipfs.io/ipfs/' + imageHash
    currentInk['external_url'] = 'https://nifty.ink/' + drawingHash
    props.setInk(currentInk)
    console.log("Ink:", props.ink)

    var inkStr = JSON.stringify(props.ink);
    const inkBuffer = Buffer.from(inkStr);

    const jsonHash = await Hash.of(inkBuffer)
    console.log("jsonHash", jsonHash)

    //setMode("mint")
    /*notification.open({
      message: 'Saving Ink to the blockchain',
      description:
      'Contacting the smartcontract',
    });*/

    var mintResult = await mintInk(drawingHash, jsonHash);

    if(mintResult) {

      props.setMode("mint")
      props.setIpfsHash(drawingHash)
      window.history.pushState({id: drawingHash}, props.ink['name'], '/' + drawingHash)

      //setMode("mint")
      /*
      notification.open({
        message: 'Sending ink to IPFS',
        description:
        'Uploading to the distributed web',
      });*/

      message.loading('Uploading to IPFS...', 0);

      let serverUrl = "https://ipfs.nifty.ink:3001/save"//'http://localhost:3001/save'

      console.log("SAVING TO SERVER BUFFER:", drawingBuffer)
      axios.post(serverUrl, {buffer: drawingBuffer})
      .then(function (response) {
        console.log(" drawingBuffer SERVER RESPONSE LOCAL:",response);

      })
      .catch(function (error) {
        console.log(error);
      });

      console.log("SAVING TO SERVER BUFFER:", imageBuffer)
      axios.post(serverUrl,  {buffer: imageBuffer})
      .then(function (response) {
        console.log(" imageBuffer SERVER RESPONSE LOCAL:",response);

      })
      .catch(function (error) {
        console.log(error);
      });

      console.log("SAVING TO SERVER BUFFER:", inkBuffer)
      axios.post(serverUrl,  {buffer: inkBuffer})
      .then(function (response) {
        console.log("inkBuffer SERVER RESPONSE LOCAL:",response);

      })
      .catch(function (error) {
        console.log(error);
      });
      /*let buffer = Buffer.from(compressedArray) //we could fall back to going directly to IPFS if our server is down?
      console.log("ADDING TO IPFS...",buffer)
      ipfs.files.add(buffer, function (err, file) {
      console.log("ADDED!")
      if (err) {
      console.log(err);
    }
    console.log(file)
  })*/

  const drawingResult = addToIPFS(drawingBuffer, props.ipfsConfig)
  const imageResult = addToIPFS(imageBuffer, props.ipfsConfig)
  const inkResult = addToIPFS(inkBuffer, props.ipfsConfig)

  Promise.all([drawingResult, imageResult, inkResult]).then((values) => {
    console.log(values);
    message.destroy()
    //setMode("mint")
    notification.open({
      message: '💾  Ink saved!',
      description:
      ' 🍾  🎊   🎉   🥳  🎉   🎊  🍾 ',
    });
  });
}
};


const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};



let top, buttons, bottom
if (props.mode === "edit") {

  const onFormLimitCheckboxChange = e => {
    props.setFormLimit(e.target.checked);
  };

  top = (
    <div style={{ width: "90vmin", margin: "0 auto", marginBottom: 16}}>



    <Form
    layout={'inline'}
    name="createInk"
    initialValues={{ limit: 0 }}
    onFinish={createInk}
    onFinishFailed={onFinishFailed}
    labelAlign = {'middle'}
    style={{justifyContent: 'center'}}
    >

    <Form.Item >

    </Form.Item>

    <Form.Item
    name="title"
    rules={[{ required: true, message: 'What is this work of art called?' }]}
    >
    <Input placeholder={"name"} />
    </Form.Item>

    <Form.Item>
    <Checkbox checked={props.formLimit} onChange={onFormLimitCheckboxChange}>
    limit
    </Checkbox>
    </Form.Item>

    <Form.Item
    name="limit"
    hidden={!props.formLimit}
    rules={[{ required: true, message: 'How many inks can be minted?' }]}
    >
    <InputNumber
    min={0}
    />
    </Form.Item>

    <Form.Item >
    <Button loading={sending} type="primary" htmlType="submit">
    Ink!
    </Button>
    </Form.Item>
    </Form>

      <div style={{marginTop: 16}}>
        <Button onClick={() => {
          drawingCanvas.current.undo()
        }}><UndoOutlined /> UNDO</Button>
        <Button onClick={() => {
          drawingCanvas.current.clear()
          props.setDrawing()
        }}><ClearOutlined /> CLEAR</Button>
        <Button onClick={() => {
          drawingCanvas.current.loadSaveData(LZ.decompress(props.drawing), false)
        }}><PlaySquareOutlined /> PLAY</Button>
      </div>
    </div>

  )

  buttons = (
    <div>

    </div>
  )
  bottom = (
    <div style={{ marginTop: 16 }}>
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", justifyContent:'center'}}>
    <PickerDisplay
    color={color}
    onChangeComplete={setColor}
    />
    </Row>
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", justifyContent:'center'}}>
    <Button onClick={() => {
      setPicker(picker + 1)
    }}><HighlightOutlined /></Button>
    </Row>
    </div>
  )
} else if (props.mode === "mint") {

  top = (
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", justifyContent:'center'}}>
    <a style={{fontSize:28, opacity:0.5}} onClick={() => {
       drawingCanvas.current.loadSaveData(LZ.decompress(props.drawing), false)
    }}><PlaySquareOutlined /></a>
    <Typography.Text style={{color:"#222222"}} copyable={{ text: props.ink.external_url}} style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
    <a href={'/' + props.ipfsHash} style={{color:"#222222"}}>{props.ink.name}</a>
    </Typography.Text>

    </Row>
  )


  bottom = (<></>)
}

return (
  <div style={{textAlign:"center"}}>
  {top}
  <div style={{ backgroundColor: "#666666", width: size[0], margin: "0 auto", border: "1px solid #999999", boxShadow: "2px 2px 8px #AAAAAA" }}>
  <CanvasDraw
  key={props.mode+""+props.canvasKey}
  ref={drawingCanvas}
  canvasWidth={size[0]}
  canvasHeight={size[1]}
  brushColor={color.hex}
  lazyRadius={4} å
  brushRadius={8}
  disabled={props.mode !== "edit"}
  hideGrid={props.mode !== "edit"}
  hideInterface={props.mode !== "edit"}
  onChange={(newDrawing) => {
    let savedData = LZ.compress(newDrawing.getSaveData())
    props.setDrawing(savedData)
  }}
  loadTimeOffset={3}
  />
  </div>
  {bottom}
  </div>
);
}
