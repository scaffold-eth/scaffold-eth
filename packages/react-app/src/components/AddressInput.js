import React, { useState, useEffect } from 'react'
import { Blockie }  from "."
import { Input } from 'antd';

export default function AddressInput(props) {

  const [ ens, setEns ] = useState(0)

  useEffect(()=>{
    setEns("")
    if(props.value && props.ensProvider){
      async function getEns(){
        let newEns
        try{
          console.log("trying reverse ens",newEns)

          newEns = await props.ensProvider.lookupAddress(props.value)
          console.log("setting ens",newEns)
          setEns(newEns)
        }catch(e){}
        console.log("checking resolve")
        if( props.value.indexOf(".eth")>0 || props.value.indexOf(".xyz")>0 ){
          try{
            console.log("resolving")
            let possibleAddress = await props.ensProvider.resolveName(props.value);
            console.log("GOT:L",possibleAddress)
            if(possibleAddress){
              setEns(props.value)
              props.onChange(possibleAddress)
            }
          }catch(e){}
        }
      }
      getEns()
    }
  },[props.value, props.ensProvider])


  return (
    <Input
      placeholder="address"
      prefix={<Blockie address={props.value} size={8} scale={3}/>}
      value={ens?ens:props.value}
      onChange={async (e)=>{
        let address = e.target.value
        if( address.indexOf(".eth")>0 || address.indexOf(".xyz")>0 ){
          try{
            let possibleAddress = await props.ensProvider.resolveName(address);
            if(possibleAddress){
              address = possibleAddress
            }
          }catch(e){}
        }
        props.onChange(address)
      }}
    />
  );
}
