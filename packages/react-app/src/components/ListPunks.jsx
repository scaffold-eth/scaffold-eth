import React, { useState } from "react";
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import * as tf from '@tensorflow/tfjs';

const { ethers } = require("ethers");

export default function ListPunks(props) {
  const [punks, setPunks] = useState([])
  const [packaged, setPackaged] = useState([])
  const [model, setModel] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  let gan_contract
  try {
    gan_contract = props.externalContracts[props.selectedChainId].contracts.GAN_PUNK  
  } catch (e) {
    console.error(e)
  }

  const randomPunks = () => {
    let input = []
    for (let k = 0 ; k < 20; k++) {
      input[k] = []
      for (let i = 0 ; i < 100; i++) {
        input[k][i] = getRandomIntInclusive(-4, 4)
      }      
    }
    setPunks(input)
  }
  useEffect(async function () {
    const model = await tf.loadLayersModel(window.location.origin + '/model.json')
    setModel(model)
    randomPunks()
  }, [])

  useEffect(async function () {    
    for (let k = 0; k < punks.length; k++) {
      const prediction = model.predict(tf.tensor([punks[k]]))
      const data = prediction.dataSync()
    
      const canvas = document.querySelector(`.punks canvas[index="${k}"]`)
      const ctx = canvas.getContext('2d');
      for (var i = 0; i < data.length; i++) {                
          data[i] = ((data[i] + 1) / 2) * 255
      }
      var imgData = new ImageData(Uint8ClampedArray.from(data), 24, 24)
      ctx.putImageData(imgData, 0, 0);
    }
  }, [punks])

  useEffect(async function () {
    for (let k = 0; k < packaged.length; k++) {
      const prediction = model.predict(tf.tensor([packaged[k]]))
      const data = prediction.dataSync()
    
      const canvas = document.querySelector(`.punks-packaged canvas[index="${k}"]`)
      const ctx = canvas.getContext('2d');
      for (var i = 0; i < data.length; i++) {                
          data[i] = ((data[i] + 1) / 2) * 255
      }
      var imgData = new ImageData(Uint8ClampedArray.from(data), 24, 24)
      ctx.putImageData(imgData, 0, 0);
    }
  }, [packaged])

  function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.random() * (max - min + 1) + min //The maximum is inclusive and the minimum is inclusive
  }

  return (
    <div><div>The first selected punk will be minted to your personal address.</div>
    <div>The punk contract itself will be the owner of the two other selected punks.</div><ToastContainer /><ImageList cols={5} sx={{ width: 5*24*3, margin: 'auto' }}>
      {punks.map((item, index) => (
        <ImageListItem className="punks">
          <canvas index={index} width="24" height="24" onClick={(e) => {
            if (packaged.length >= 3) return
            packaged.push(punks[index])
            setPackaged([...packaged])
          }} ></canvas>   
        </ImageListItem>
      ))}
      </ImageList>      
      <div>
        <div>
        </div>
        <div>
        <ImageList cols={3} sx={{ width: 3*24*3, margin: 'auto' }}>
        {packaged.map((item, index) => (
          <ImageListItem className="punks-packaged">
            <canvas index={index} width="24" height="24" ></canvas>   
          </ImageListItem>
        ))}
        </ImageList>
        <ButtonGroup sx={{ marginTop: 2 }} >
        <Button variant="contained" onClick={() => {
        randomPunks()
        }}>Refresh</Button>
        <Button variant="contained" onClick={() => {
          setPackaged([])
        }}>Clear</Button>
        <Button variant="outlined" onClick={async () => {
          try {
            let contract = new ethers.Contract(gan_contract.address, gan_contract.abi, props.signer)
            const tx = await contract.safeMint(packaged.map((ar) => ar.map((el) => el.toString())))
            toast('pending transaction ' + tx.hash)
            console.log(tx.hash)
            setErrorMessage('')
          } catch (e) {
            console.error(e)
            toast(e.message)
            setErrorMessage(e.message)
          }          
        }}>Mint</Button>
        </ButtonGroup>
        <div>{errorMessage}</div>
        </div>
      </div>
  </div>
  );
}
