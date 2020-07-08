import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, HighlightOutlined } from '@ant-design/icons';
import { Row, Col, Button, Input, InputNumber, Form, Typography, Space, Checkbox, notification, message } from 'antd';
import { useLocalStorage, useContractLoader } from "./hooks"
import { Transactor } from "./helpers"
import CanvasDraw from "react-canvas-draw";
import { ChromePicker, TwitterPicker, CompactPicker, CirclePicker } from 'react-color';
import LZ from "lz-string";

const ipfsAPI = require('ipfs-http-client');
const isIPFS = require('is-ipfs')
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
const Hash = require('ipfs-only-hash')
const BufferList = require('bl/BufferList')
const axios = require('axios');
const pickers = [CirclePicker, ChromePicker]


export default function InkCanvas(props) {

  const writeContracts = useContractLoader(props.injectedProvider);
  const tx = Transactor(props.injectedProvider)

  const [picker, setPicker] = useLocalStorage("picker", 0)
  const [color, setColor] = useLocalStorage("color", "#666666")


  const drawingCanvas = useRef(null);
  const calculatedVmin = Math.min(window.document.body.clientHeight, window.document.body.clientWidth)
  const [size, setSize] = useState([0.7 * calculatedVmin, 0.7 * calculatedVmin])//["70vmin", "70vmin"]) //["50vmin", "50vmin"][750, 500]

  const getFromIPFS = async hashToGet => {
    for await (const file of ipfs.get(hashToGet)) {
      console.log(file.path)
      if (!file.content) continue;
      const content = new BufferList()
      for await (const chunk of file.content) {
        content.append(chunk)
      }
      console.log(content)
      return content
    }
  }

  const addToIPFS = async fileToUpload => {
    for await (const result of ipfs.add(fileToUpload)) {
      return result
    }
  }

  useEffect(() => {
    const loadPage = async () => {
      //on page load checking url path
      let ipfsHashRequest = window.location.pathname.replace("/", "")
      if (ipfsHashRequest && isIPFS.multihash(ipfsHashRequest)) {
        props.setMode("mint")
        props.setDrawing("")

        let inkContent = await getFromIPFS(ipfsHashRequest)
        console.log(JSON.parse(inkContent))
        props.setInk(JSON.parse(inkContent))

        let drawingContent = await getFromIPFS(JSON.parse(inkContent)['drawing'])
        console.log("drawingContent:", drawingContent)
        props.setIpfsHash(ipfsHashRequest)
        try{
          let decompressed = LZ.decompressFromUint8Array(drawingContent._bufs[0])
          //console.log(decompressed)
          if (decompressed) {
            let compressed = LZ.compress(decompressed)
            props.setDrawing(compressed)
            //let decompressedObject = JSON.parse(decompressed)
            //setSize([decompressedObject['width'],decompressedObject['height']])

            drawingCanvas.current.loadSaveData(decompressed, false)
          }
        }catch(e){console.log("RROROROROROROROROROROR",e)}

      } else {window.history.pushState({id: 'edit'}, 'edit', '/')}
    }
    loadPage()
  }, [])

  useEffect(() => {
    if (props.drawing) {
      //console.log("DECOMPRESSING", props.drawing)
      try {
        let decompressed = LZ.decompress(props.drawing)
        //console.log(decompressed)
        drawingCanvas.current.loadSaveData(decompressed, false)
      } catch (e) {
        console.log(e)
      }
    }
  }, [props.mode, props.ink])

  const PickerDisplay = pickers[picker % pickers.length]

  const mintInk = async (hashToMint) => {
    let result = await tx(writeContracts["NFTINK"].createInk(hashToMint, props.ink.attributes[0]['value']))//eventually pass the JSON link not the Drawing link
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
      "value": values.limit
    }]
    currentInk['name'] = values.title

    props.setIpfsHash()

    const drawingHash = await Hash.of(drawingBuffer)
    console.log("drawingHash", drawingHash)
    const imageHash = await Hash.of(imageBuffer)
    console.log("imageHash", imageHash)

    currentInk['drawing'] = drawingHash
    currentInk['image'] = 'https://ipfs.io/ipfs/' + imageHash
    props.setInk(currentInk)
    console.log("Ink:", props.ink)

    var inkStr = JSON.stringify(props.ink);
    const inkBuffer = Buffer.from(inkStr);

    const inkHash = await Hash.of(inkBuffer)
    console.log("jsonHash", inkHash)

    props.setIpfsHash(inkHash)

    //setMode("mint")
    notification.open({
      message: 'Saving Ink to the blockchain',
      description:
      'Contacting the smartcontract',
    });

    var mintResult = await mintInk(inkHash);

    if(mintResult) {

      props.setMode("mint")
      window.history.pushState({id: inkHash}, props.ink['name'], '/' + inkHash)

      //setMode("mint")
      notification.open({
        message: 'Sending ink to IPFS',
        description:
        'Uploading to the distributed web',
      });

      message.loading('Uploading to IPFS...', 0);

      let serverUrl = "https://ipfs.nifty.ink:3001/save"//'http://localhost:3001/save'

      let buffer = Buffer.from(compressedArray)

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

  const drawingResult = addToIPFS(drawingBuffer)
  const imageResult = addToIPFS(imageBuffer)
  const inkResult = addToIPFS(inkBuffer)

  Promise.all([drawingResult, imageResult, inkResult]).then((values) => {
    console.log(values);
    message.destroy()
    //setMode("mint")
    notification.open({
      message: 'Ink saved in IPFS',
      description:
      'Your ink is now InterPlanetary',
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
    <Button type="primary" htmlType="submit">
    Ink!
    </Button>
    </Form.Item>
    </Form>

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

    <Typography.Text style={{color:"#222222"}} copyable={{ text: 'http://localhost:3000/' + props.ipfsHash}} style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
    <a href={'http://localhost:3000/' + props.ipfsHash} style={{color:"#222222"}}>{props.ink.name}</a>
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
  key={props.mode}
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
  />
  </div>
  {bottom}
  </div>
);
}
