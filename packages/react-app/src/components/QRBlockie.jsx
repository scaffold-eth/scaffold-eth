import React, { useState, useEffect } from "react";
import QR from 'qrcode.react';
import { Blockie, Balance } from "."
import { message, Typography } from 'antd';
const { Text } = Typography;


export default function QRBlockie(props) {

  const size = useWindowSize();
  const minSize = props.minSize ? props.minSize : 360
  let qrWidth
  if(size.width / 3 < minSize) {
    qrWidth = minSize
  } else {
    qrWidth = size.width / 3
  }

  let scale = props.scale ? props.scale : Math.min(size.height-130,size.width,1024)/(qrWidth*1)

  let offset =  0.42

  const url  = window.location.href+""

  const hardcodedSizeForNow = 380

  const punkSize = 110

  let part1 = props.address && props.address.substr(2,20)
  let part2= props.address && props.address.substr(22)
  const x = parseInt(part1, 16)%100
  const y = parseInt(part2, 16)%100

  //console.log("window.location",window.location)

  return (
    <div style={{cursor:"pointer",transform:"scale("+(props.scale?props.scale:"1")+")",transformOrigin:"50% 50%",margin:"auto", position:"relative",width:hardcodedSizeForNow}} onClick={()=>{
       const el = document.createElement('textarea');
       el.value = props.address;
       document.body.appendChild(el);
       el.select();
       document.execCommand('copy');
       document.body.removeChild(el);
       const iconHardcodedSizeForNow = 380
       const iconPunkSize = 40
       message.success(
         <span style={{position:"relative"}}>
            <Blockie address={props.address} scale={3} /> Copied Address
         </span>
       );
    }}>

      <div style={{position:"absolute",left:hardcodedSizeForNow/2-46,top:hardcodedSizeForNow/2-46}}>
        <Blockie address={props.address} scale={11.5}/>
      </div>

      {props.withQr ? <QR
        level={"H"}
        includeMargin={false}
        //ethereum:0x34aA3F359A9D614239015126635CE7732c18fDF3
        value={props.address?"ethereum:"+props.address:""}
        size={hardcodedSizeForNow}
        imageSettings={{width:105,height:105,excavate:true}}
      /> : ""}

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
