import React, { useState, useEffect } from 'react'
import { Blockie }  from "."
import { Input } from 'antd';

export default function AddressInput(props) {

  const [ mode, setMode ] = useState(props.price?"USD":"ETH")
  const [ value, setValue ] = useState()

  const currentValue = typeof props.value != "undefined"?props.value:value

  const option = (title)=>{
    if(!props.price) return ""
    return (
      <div style={{cursor:"pointer"}} onClick={()=>{
        if(mode=="USD"){
          setMode("ETH")
          let ethValue = ""+(parseFloat(currentValue)/props.price)
          setValue(ethValue)
          if(typeof props.onChange == "function") { props.onChange(ethValue) }
        }else{
          setMode("USD")
          let usdValue = ""+(parseFloat(currentValue)*props.price).toFixed(2)
          setValue(usdValue)
          if(typeof props.onChange == "function") { props.onChange(usdValue) }
        }
      }}>
        {title}
      </div>
    )
  }

  let prefix
  let addonAfter
  if(mode=="USD"){
    prefix = (
      "$"
    )
    addonAfter = (
      option("USD 🔀")
    )
  }else{
    prefix = (
      "Ξ"
    )
    addonAfter = (
      option("ETH 🔀")
    )
  }

  return (
    <Input
      placeholder={props.placeholder?props.placeholder:"amount"}
      prefix={prefix}
      value={currentValue}
      addonAfter={addonAfter}
      onChange={async (e)=>{
        setValue(e.target.value)
        if(typeof props.onChange == "function") { props.onChange(e.target.value) }
      }}
    />
  );
}
