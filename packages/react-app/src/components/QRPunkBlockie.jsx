import React, { useState, useEffect } from "react";
import QR from 'qrcode.react';
import { Blockie, Balance } from "."
import { Typography } from 'antd';
const { Text } = Typography;


export default function QRPunkBlockie(props) {

  const size = useWindowSize();
  const minSize = 360
  let qrWidth
  if(size.width / 3 < minSize) {
    qrWidth = minSize
  } else {
    qrWidth = size.width / 3
  }

  let scale = Math.min(size.height-130,size.width,1024)/(qrWidth*1)

  let offset =  0.42

  const url  = window.location.href+""

  const hardcodedSizeForNow = 380

  const punkSize = 110

  let part1 = props.address && props.address.substr(2,20)
  let part2= props.address && props.address.substr(22)
  const x = parseInt(part1, 16)%100
  const y = parseInt(part2, 16)%100

  return (
    <div style={{margin:"auto", position:"relative",width:hardcodedSizeForNow}}>

      <div style={{position:"absolute",opacity:0.2,left:hardcodedSizeForNow/2-46,top:hardcodedSizeForNow/2-46}}>
        <Blockie address={props.address} scale={11.5}/>
      </div>

      <div style={{position:"absolute",left:hardcodedSizeForNow/2-53,top:hardcodedSizeForNow/2-65}}>
        <div style={{position:"relative",width:punkSize, height:punkSize, overflow: "hidden"}}>
          <img src="/punks.png" style={{position:"absolute",left:-punkSize*x,top:-punkSize*y,width:punkSize*100, height:punkSize*100,imageRendering:"pixelated"}} />
        </div>
      </div>

      <QR
        level={"H"}
        includeMargin={false}
        value={props.address?props.address:""}
        size={hardcodedSizeForNow}
        imageSettings={{width:100,height:100,excavate:true}}
      />
    </div>
  );
}


function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
