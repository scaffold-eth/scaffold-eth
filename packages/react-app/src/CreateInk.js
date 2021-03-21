import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import 'antd/dist/antd.css';
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, HighlightOutlined, BgColorsOutlined, BorderOutlined } from '@ant-design/icons';
import { Row, Button, Input, InputNumber, Form, message, Col, Slider, Space } from 'antd';
import { useLocalStorage } from "./hooks"
import { addToIPFS, transactionHandler } from "./helpers"
import CanvasDraw from "react-canvas-draw";
import { SketchPicker, CirclePicker, TwitterPicker, AlphaPicker } from 'react-color';
import LZ from "lz-string";

const Hash = require('ipfs-only-hash')
const pickers = [CirclePicker, TwitterPicker, SketchPicker ]

export default function CreateInk(props) {

  let history = useHistory();

  const [picker, setPicker] = useLocalStorage("picker", 0)
  const [color, setColor] = useLocalStorage("color", "#666666")
  const [brushRadius, setBrushRadius] = useState(8)

  const drawingCanvas = useRef(null);
  const [size, setSize] = useState([0.8 * props.calculatedVmin, 0.8 * props.calculatedVmin])//["70vmin", "70vmin"]) //["50vmin", "50vmin"][750, 500]

  const [sending, setSending] = useState()
  const [drawingSize, setDrawingSize] = useState(0)

  const updateBrushRadius = value => {
    setBrushRadius(value)
  }

  const saveDrawing = (newDrawing) => {
    let savedData = LZ.compress(newDrawing.getSaveData())
    props.setDrawing(savedData)
  }

  const updateColor = value => {
    console.log(value)
    setColor(`rgba(${value.rgb.r},${value.rgb.g},${value.rgb.b},${value.rgb.a})`)
    console.log(`rgba(${value.rgb.r},${value.rgb.g},${value.rgb.b},${value.rgb.a})`)
  }

  useEffect(() => {
    const loadPage = async () => {
      console.log('loadpage')
        if (props.drawing && props.drawing !== "") {
          try {
            let decompressed = LZ.decompress(props.drawing)
            let points = 0
            for (const line of JSON.parse(decompressed)['lines']){
              points = points + line.points.length
            }

            //console.log('Drawing points', points)
            setDrawingSize(points)
            //console.log(decompressed)
            drawingCanvas.current.loadSaveData(decompressed, false)
          } catch (e) {
            console.log(e)
          }
        }
    }
    window.drawingCanvas = drawingCanvas
    loadPage()
  }, [])

  const PickerDisplay = pickers[picker % pickers.length]

  const mintInk = async (inkUrl, jsonUrl, limit) => {

    let contractName = "NiftyInk"
    let regularFunction = "createInk"
    let regularFunctionArgs = [inkUrl, jsonUrl, props.ink.attributes[0]['value']]
    let signatureFunction = "createInkFromSignature"
    let signatureFunctionArgs = [inkUrl, jsonUrl, props.ink.attributes[0]['value'], props.address]
    let getSignatureTypes = ['bytes','bytes','address','address','string','string','uint256']
    let getSignatureArgs = ['0x19','0x00',props.readKovanContracts["NiftyInk"].address,props.address,inkUrl,jsonUrl,limit]

    let createInkConfig = {
      ...props.transactionConfig.current,
      contractName,
      regularFunction,
      regularFunctionArgs,
      signatureFunction,
      signatureFunctionArgs,
      getSignatureTypes,
      getSignatureArgs,
    }

    console.log(createInkConfig)

    let result = await transactionHandler(createInkConfig)

    return result

  }

  const createInk = async values => {
    console.log('Success:', values);

    setSending(true)

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

    try {
      var mintResult = await mintInk(drawingHash, jsonHash, values.limit.toString());
    } catch (e) {
      console.log(e)
      setSending(false)

    }


    if(mintResult) {

  const drawingResult = addToIPFS(drawingBuffer, props.ipfsConfig)
  const imageResult = addToIPFS(imageBuffer, props.ipfsConfig)
  const inkResult = addToIPFS(inkBuffer, props.ipfsConfig)

  const drawingResultInfura = addToIPFS(drawingBuffer, props.ipfsConfigInfura)
  const imageResultInfura = addToIPFS(imageBuffer, props.ipfsConfigInfura)
  const inkResultInfura = addToIPFS(inkBuffer, props.ipfsConfigInfura)

  Promise.all([drawingResult, imageResult, inkResult]).then((values) => {
    console.log("FINISHED UPLOADING TO PINNER",values);
    message.destroy()
  });

  setSending(false)
  props.setViewDrawing(LZ.decompress(props.drawing))
  setDrawingSize(10000)
  props.setDrawing("")
  history.push('/ink/' + drawingHash)

  Promise.all([drawingResultInfura, imageResultInfura, inkResultInfura]).then((values) => {
    console.log("INFURA FINISHED UPLOADING!",values);
  });

}
};


const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const triggerOnChange = (lines) => {
  let saved = JSON.stringify({
    lines: lines,
    width: drawingCanvas.current.props.canvasWidth,
    height: drawingCanvas.current.props.canvasHeight
  });

  drawingCanvas.current.loadSaveData(saved, true);
  drawingCanvas.current.lines = lines;
};

const undo = () => {
  if (!drawingCanvas.current.lines.length) return;

  if (drawingCanvas.current.lines[drawingCanvas.current.lines.length - 1].ref) {
    drawingCanvas.current.lines[0].brushColor = drawingCanvas.current.lines[drawingCanvas.current.lines.length - 1].brushColor;
    let lines = drawingCanvas.current.lines.slice(0, -1);
    triggerOnChange(lines);
  } else {
    let lines = drawingCanvas.current.lines.slice(0, -1);
    triggerOnChange(lines);
  }
};

const fillBackground = (color) => {
  let width = drawingCanvas.current.props.canvasWidth;
  let height = drawingCanvas.current.props.canvasHeight;

  let bg = {
    brushColor: color,
    brushRadius: (width + height) / 2,
    points: [
      { x: 0, y: 0 },
      { x: width, y: height }
    ],
    background: true
  };

  let previousBGColor = drawingCanvas.current.lines.filter((l) => l.ref).length
    ? drawingCanvas.current.lines[0].brushColor
    : "#FFF";

  let bgRef = {
    brushColor: previousBGColor,
    brushRadius: 1,
    points: [
      { x: -1, y: -1 },
      { x: -1, y: -1 }
    ],
    ref: true
  };

  drawingCanvas.current.lines.filter((l) => l.background).length
    ? drawingCanvas.current.lines.splice(0, 1, bg)
    : drawingCanvas.current.lines.unshift(bg);
  drawingCanvas.current.lines.push(bgRef);

  let lines = drawingCanvas.current.lines;

  triggerOnChange(lines);
};

const drawFrame = (color, radius) => {
  let width = drawingCanvas.current.props.canvasWidth;
  let height = drawingCanvas.current.props.canvasHeight;

  drawingCanvas.current.lines.push({
    brushColor: color,
    brushRadius: radius,
    points: [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: height },
      { x: 0, y: 0 }
    ]
  });

  let lines = drawingCanvas.current.lines;

  triggerOnChange(lines);
};

let top, bottom
if (props.mode === "edit") {

  top = (
    <div style={{ width: "90vmin", margin: "0 auto", marginBottom: 16}}>



    <Form
    layout={'inline'}
    name="createInk"
    //initialValues={{ limit: 0 }}
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
    <Input placeholder={"name"} style={{fontSize:16}}/>
    </Form.Item>

    <Form.Item
    name="limit"
    rules={[{ required: true, message: 'How many inks can be minted?' }]}
    >
    <InputNumber placeholder={"limit"}
    style={{fontSize:16}}
    min={0}
    precision={0}
    />
    </Form.Item>

    <Form.Item >
    <Button loading={sending} type="primary" htmlType="submit">
    Ink!
    </Button>
    </Form.Item>
    </Form>

      <div style={{marginTop: 16}}>
        <Button onClick={() => undo()}><UndoOutlined /> UNDO</Button>
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

  bottom = (
    <div style={{ marginTop: 16 }}>
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
    <Space>
    <PickerDisplay
    color={color}
    onChangeComplete={updateColor}
    />
    <Button onClick={() => {
      setPicker(picker + 1)
    }}><HighlightOutlined /></Button>
    </Space>
    </Row>
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", justifyContent: 'center', alignItems: 'center'}}>
    <Col span={12}>
    <AlphaPicker onChangeComplete={updateColor}
        color={color}/>
    </Col>
    </Row>
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", justifyContent:'center'}}>
    <Col span={12}>
          <Slider
            min={1}
            max={100}
            onChange={updateBrushRadius}
            value={typeof brushRadius === 'number' ? brushRadius : 0}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={100}
            style={{ margin: '0 16px' }}
            value={brushRadius}
            onChange={updateBrushRadius}
          />
        </Col>
    </Row>
    <Row style={{ width: "90vmin", margin: "0 auto", marginTop:"4vh", justifyContent:'center'}}>
        <Space>
        <Col span={4}>
          <Button
          onClick={() => fillBackground(color)}
          ><BgColorsOutlined />Background</Button>
        </Col>
        <Col span={4}>
          <Button
          onClick={() => drawFrame(color, brushRadius)}
          ><BorderOutlined />Frame</Button>
        </Col>
        </Space>
    </Row>
    </div>
  )
}

return (
  <div style={{textAlign:"center"}}  /*onClick={
    () => {
      if(props.mode=="mint"){
         drawingCanvas.current.loadSaveData(LZ.decompress(props.drawing), false)
      }
    }
  }*/>
  {top}
  <div style={{ backgroundColor: "#666666", width: size[0], margin: "0 auto", border: "1px solid #999999", boxShadow: "2px 2px 8px #AAAAAA" }}>
  <CanvasDraw
  key={props.mode+""+props.canvasKey}
  ref={drawingCanvas}
  canvasWidth={size[0]}
  canvasHeight={size[1]}
  brushColor={color}
  lazyRadius={4}
  brushRadius={brushRadius}
//  disabled={props.mode !== "edit"}
//  hideGrid={props.mode !== "edit"}
//  hideInterface={props.mode !== "edit"}
  onChange={saveDrawing}
  immediateLoading={drawingSize >= 10000}
  loadTimeOffset={3}
  />
  </div>
  {bottom}
  </div>
);
}
