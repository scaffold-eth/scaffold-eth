import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { UndoOutlined, ClearOutlined, PlaySquareOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import { useExchangePrice, useGasPrice, useLocalStorage } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, AddressInput } from "./components"
import CanvasDraw from "react-canvas-draw";
import { ChromePicker } from 'react-color';

import LZ from "lz-string";

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")


function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const [color, setColor] = useLocalStorage("color", "#666666")
  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [minting, setMinting] = useLocalStorage(false)

  const carousel = useRef(null);
  const drawingCanvas = useRef(null);
  const size = [750, 500]

  useEffect(() => {
    if (drawing) {
      try {
        console.log("DRAWING IS SET ON LOAD ", drawing)
        drawingCanvas.current.loadSaveData(LZ.decompress(drawing), false)
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  let buttons
  if(!minting){
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

        <Button style={{marginLeft:8}} shape="round" size="large" type="primary" onClick={() => {
          setMinting(true)
        }}><SaveOutlined /> SAVE / MINT</Button>
      </div>
    )
  }else{
    buttons = (

      <Button style={{marginLeft:8}} shape="round" size="large" type="primary" onClick={() => {
        setMinting(false)
      }}><EditOutlined /> EDIT</Button>
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


      <div >
        <div style={{ padding: 16 }}>
          {buttons}
        </div>

        <div style={{ backgroundColor: "#666666", width: size[0], margin: "0 auto", border:"1px solid #999999",  boxShadow:"2px 2px 8px #AAAAAA" }}>
          <CanvasDraw
            ref={drawingCanvas}
            canvasWidth={size[0]}
            canvasHeight={size[1]}
            brushColor={color.hex}
            lazyRadius={4}å
            brushRadius={8}
            onChange={(newDrawing) => {
              let savedData = LZ.compress(newDrawing.getSaveData())
              setDrawing(savedData)
            }}
          />
        </div>

        <div style={{ backgroundColor: "#666666", width: 225, margin: "0 auto", marginTop:16 }}>
          <ChromePicker
            color={color}
            onChangeComplete={setColor}
          />
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
