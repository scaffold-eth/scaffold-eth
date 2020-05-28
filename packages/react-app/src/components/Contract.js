import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";

import { Card, Row, Col, Input, Button, Divider  } from 'antd';
import { useBalance, useContractLoader } from "../hooks"
import { Account, Address } from "."


const tryToDisplay = (thing)=>{
  if(thing && thing.toNumber ){
    try{
      return thing.toNumber()
    }catch(e){
      return ethers.utils.formatUnits(thing,"ether")
    }
  }
  return JSON.stringify(thing)
}


export default function Contract(props) {

  const contracts = useContractLoader(props.provider);
  const contract = contracts?contracts[props.name]:""
  const address = contracts?contract.address:""
  const balance = useBalance(address,props.provider)

  const [ display, setDisplay ] = useState(<div>Loading...</div>)



  const [ updates, setUpdates ] = useState(1)
  const [ form, setForm ] = useState({})
  const [ values, setValues ] = useState({})


  useEffect(()=>{
    const loadDisplay = async ()=>{
      console.log("CONTRACT",contract)
      if(contract){
        let nextDisplay = []
        let displayed = {}
        for(let f in contract.interface.functions){

          let fn = contract.interface.functions[f]
          console.log("FUNCTION",fn.name,fn)
          if(!displayed[fn.name] && fn.type=="call" && fn.inputs.length===0){
            console.log("PUSHING",fn.name)
            displayed[fn.name]=true
            nextDisplay.push(
              <div>
                <Row>
                  <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>{fn.name}</Col>
                  <Col span={16}>
                    <h2>{tryToDisplay(await contract[fn.name]())}</h2>
                  </Col>
                </Row>
                <Divider></Divider>
              </div>
            )
          }else if(!displayed[fn.name] && fn.type=="call" && fn.inputs.length>0){
            console.log("CALL WITH ARGS",fn.name)
            displayed[fn.name]=true
            let inputs = []
            for(let i in fn.inputs){
              let input = fn.inputs[i]
              inputs.push(
                <div style={{margin:2}}>
                  <Input
                    size="large"
                    placeholder={input.name}
                    value={form[fn.name+input.name+i]}
                    onChange={(e)=>{
                      let formUpdate = form
                      formUpdate[fn.name+input.name+i] = e.target.value
                      setForm(formUpdate)
                      setUpdates(updates+1)
                    }}
                  />
                </div>
              )
            }

            console.log("VALUE OF ",fn.name, "IS",values[fn.name])

            inputs.push(
              <div style={{cursor:"pointer",margin:2}}>

                <Input

                onChange={(e)=>{
                  console.log("CHJANGE")
                  let newValues = values
                  newValues[fn.name] = e.target.value
                  console.log("SETTING:",newValues)
                  setValues(newValues)
                  setUpdates(updates+1)
                }}

                value={values[fn.name]}

                addonAfter={
                  <div type="default" onClick={async ()=>{
                    console.log("CLICK")
                    let args = []
                    for(let i in fn.inputs){
                      let input = fn.inputs[i]
                      args.push(form[fn.name+input.name+i])
                    }
                    console.log("args",args)

                    let result = tryToDisplay(await contract[fn.name](...args))

                    let newValues = values
                    newValues[fn.name] = result
                    console.log("SETTING:",newValues)
                    setValues(newValues)

                    console.log("result",result)
                    console.log("should eventually be:",fn.name,values[fn.name])

                    setUpdates(updates+1)
                    console.log("updates",updates)

                  }}>{"📡"}</div>
                } defaultValue=""
              />


              </div>
            )




            nextDisplay.push(
              <div>
                <Row>
                  <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>{fn.name}</Col>
                  <Col span={16}>
                    {inputs}
                  </Col>
                </Row>
                <Divider></Divider>
              </div>
            )
          } else if(!displayed[fn.name] && fn.type === "transaction"){

            console.log("transaction",fn)
            displayed[fn.name]=true


            console.log("TRANSACTION WITH ARGS",fn.name)

            let inputs = []
            for(let i in fn.inputs){
              let input = fn.inputs[i]
               inputs.push(
                <div style={{margin:2}}>
                  <Input
                    size="large"
                    placeholder={input.name}
                    value={form[fn.name+input.name+i]}
                    onChange={(e)=>{
                      let formUpdate = form
                      formUpdate[fn.name+input.name+i] = e.target.value
                      setForm(formUpdate)
                      setUpdates(updates+1)
                    }}
                  />
                </div>
              )
            }

            console.log("VALUE OF TX FN ",fn.name, "IS",values[fn.name])

            inputs.push(
              <div style={{cursor:"pointer",margin:2}}>

                <Input value={values[fn.name]}

                  onChange={(e)=>{
                    let newValues = values
                    newValues[fn.name] = e.target.value
                    console.log("SETTING:",newValues)
                    setValues(newValues)
                    setUpdates(updates+1)
                  }}

                  addonAfter={
                    <div type="default" onClick={async ()=>{
                      console.log("CLICK")
                      let args = []
                      for(let i in fn.inputs){
                        let input = fn.inputs[i]
                        args.push(form[fn.name+input.name+i])
                        let formUpdate = form
                        formUpdate[fn.name+input.name+i] = ""
                        setForm(formUpdate)
                      }
                      console.log("args",args)

                      let result = tryToDisplay(await contract[fn.name](...args))

                      let newValues = values
                      newValues[fn.name] = result
                      console.log("SETTING:",newValues)
                      setValues(newValues)

                      console.log("result",result)
                      console.log("should eventually be:",fn.name,values[fn.name])

                      setUpdates(updates+1)
                      console.log("updates",updates)



                    }}>
                    {"🔏"}
                  </div>
                } defaultValue=""
              />


              </div>
            )

            nextDisplay.push(
              <div>
                <Row>
                  <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>{fn.name}()</Col>
                  <Col span={16}>
                    {inputs}
                  </Col>
                </Row>
                <Divider></Divider>
              </div>
            )

          } else if(!displayed[fn.name]){
            console.log("UNKNOWN",fn)
          }
        }
        setDisplay(nextDisplay)
      }
    }
    loadDisplay()
  },[contracts,values,updates,form])

  return (
    <Card
      title={(
        <div>
          {props.name}
          <div style={{float:'right'}}>
              <Account
                address={address}
                localProvider={props.provider}
                injectedProvider={props.provider}
                mainnetProvider={props.provider}
                readContracts={contracts}
                price={props.price}
              />
          </div>
        </div>
      )}
      size="large"
      style={{ width: 550, marginTop: 25 }}
      loading={display&&display.length<=0}>
      { display }
    </Card>
  );
}
