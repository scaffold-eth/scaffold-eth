import React, { useState, useEffect } from 'react'
import Blockies from 'react-blockies';
import { Typography, Skeleton, Tooltip, Spin, Modal, Button } from 'antd';


const { Text } = Typography;



export default function Address(props) {

  const [ ens, setEns ] = useState(0)
  useEffect(()=>{
    if(props.value && props.ensProvider){
      async function getEns(){
        let newEns
        try{
          //console.log("getting ens",newEns)
          newEns = await props.ensProvider.lookupAddress(props.value)
          setEns(newEns)
        }catch(e){}
      }
      getEns()
    }
  },[props.value, props.ensProvider])

  if(!props.value){
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    )
  }

  let displayAddress = props.value.substr(0,6)

  if(ens){
    displayAddress=ens
  }else if(props.size === "short"){
    displayAddress += "..."+props.value.substr(-4)
  }else if(props.size === "long"){
    displayAddress = props.value
  }

  let blockExplorer = "https://blockscout.com/poa/xdai/address/"
  if(props.blockExplorer){
    blockExplorer = props.blockExplorer
  }

  let clickable = true
  if(props.clickable == false){
    clickable = props.clickable
  }

  if(props.minimized){
    return (
        <span style={{verticalAlign:"middle"}}>
          {clickable?<a style={{color:"#222222"}} href={blockExplorer+props.value}>
            <Blockies seed={props.value.toLowerCase()} size={8} scale={2}/>
          </a>:<Blockies seed={props.value.toLowerCase()} size={8} scale={2}/>}
        </span>
    );
  }

  let text
  if(props.onChange){
    text = (
      <Text editable={{onChange:props.onChange}} copyable={{text:props.value}}>
        {clickable?<a style={{color:"#222222"}} href={blockExplorer+props.value}>{displayAddress}</a>:<span>{displayAddress}</span>}
      </Text>
    )
  }else{
    text = (
      <Text copyable={{text:props.value}}>
        {clickable?<a style={{color:"#222222"}} href={blockExplorer+props.value}>{displayAddress}</a>:<span>{displayAddress}</span>}
      </Text>
    )
  }

  return (
    <span>
      <span style={{verticalAlign:"middle"}}>
        <Blockies seed={props.value.toLowerCase()} size={8} scale={4}/>
      </span>
      <span style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
        {text}
      </span>
    </span>
  );
}
