/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "@ethersproject/units";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, notification } from "antd";
import React, { useState } from "react";
import { Address, Balance, AddressInput, EtherInput } from "../components";
import { useHistory } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { ethers } from "ethers";

export default function Checkout({
  setRoute,
  cart,
  setCart,
  displayCart,
  tx,
  writeContracts,
  mainnetProvider,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");

  let history = useHistory();

  const [amount, setAmount] = useState();
  const [reason, setReason] = useState();
  const [toAddress, setToAddress] = useState("0x97843608a00e2bbc75ab0C1911387E002565DEDE");
  let extra = ""
  if(toAddress=="0x97843608a00e2bbc75ab0C1911387E002565DEDE"){
    extra = "(buidlguidl.eth)"
  }

  const [thanks, setThanks] = useState();

  if(thanks){
    return (
      <div>
        <div style={{width:"calc(max(min(80vw,800px),300px))", margin:"auto"}}>
          {thanks}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{width:"calc(max(min(80vw,800px),300px))", margin:"auto"}}>
        { cart && cart.length>0?
          <StackGrid
            columnWidth={250}
          >
            {displayCart}
          </StackGrid>:
          <div style={{width:620,margin:"auto",marginTop:16}}>
            <AddressInput
              hideScanner={true}
              ensProvider={mainnetProvider}
              placeholder="to address"
              value={toAddress}
              onChange={setToAddress}

            />
            {extra ?<div style={{marginTop:2,textAlign:"left",paddingLeft:16,fontSize:14}}>
              <b>BuidlGuidl.eth</b>
            </div>:""}
          </div>
        }

        <div style={{width:620,margin:"auto",marginTop:16}}>

          <EtherInput
            autoFocus={true}
            placeholder={cart && cart.length>0 ? "amount in total ETH to split between the streams of the selected builders/builds" : "amount in ETH"}
            price={false}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
        </div>
        <div style={{width:620,margin:"auto",marginTop:16}}>
          <Input
            placeholder={"optional reason / guidance"}
            value={reason}
            onChange={e => {
              setReason(e.target.value);
            }}
          />
        </div>
        <div style={{marginTop:16}}>
        <Button

          onClick={async () => {



            if(!amount){
              console.log("AMOUNT",amount)
              notification.warning({
                style:{marginBottom:64},
                message: 'Please enter an amount in ETH',
                placement: "bottomRight",
                description:false,
              });
            }else if(cart.length<=0 && toAddress!="0x97843608a00e2bbc75ab0C1911387E002565DEDE"){
              notification.warning({
                style:{marginBottom:64},
                message: 'Sorry this 🏰 buidlguidl funding.',
                placement: "bottomRight",
                description:false,
              });
              setToAddress("0x97843608a00e2bbc75ab0C1911387E002565DEDE")
            }else{
              let finalAddresses = []
              let finalReasons = []
              let overrides = {}

              if( cart && cart.length>0){
                console.log("okay this is a big one... we need to use a splitter contract to send to all the streams of all the people in the cart including the trickle down of projects...")
                console.log(cart)

                //replace "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",//"0x90FC815Fe9338BB3323bAC84b82B9016ED021e70",
                //and "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",//"0x21e18260357D33d2e18482584a8F39D532fb71cC",
                const translateAddressesForLocal = (addy) => {
                  //if(addy=="0x90FC815Fe9338BB3323bAC84b82B9016ED021e70") return "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE"
                  //if(addy=="0x21e18260357D33d2e18482584a8F39D532fb71cC") return "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
                  return addy
                }

                for(let c in cart){
                  if(cart[c].streamAddress){
                    console.log("Adding stream address ")
                    finalAddresses.push(translateAddressesForLocal(cart[c].streamAddress))
                    finalReasons.push(reason)
                  }else{
                    console.log("NO STREAM, NEED TO SPLIT...")
                    finalAddresses.push("0x97843608a00e2bbc75ab0C1911387E002565DEDE")//buidlguidl.eth
                    finalReasons.push(cart[c].name+": "+reason)
                  }
                }



              }else{

                  //overrides = { gasLimit: 520000 }
                /*console.log("toAddress",toAddress)
                console.log("AMOUNT",amount)
                tx({
                  to: toAddress,
                  value: parseEther(""+amount),
                  data: reason?ethers.utils.hexlify(ethers.utils.toUtf8Bytes(reason)):"0x"
                })*/
                finalAddresses.push(toAddress) // buidlguidl multi sig

                let finalReason = "🏰 BuidlGuidl"
                if(reason) finalReason = finalReason+": "+reason
                finalReasons.push(finalReason)
              }
              console.log("finalAddresses",finalAddresses)
              console.log("finalReasons",finalReasons)
              console.log("total amount:",amount)

              overrides.value = parseEther(""+amount)

              let result = tx( writeContracts.StreamFunder.fundStreams(finalAddresses,finalReasons,overrides) )

              let finalResult = await result
              console.log("RESULTTTT:",finalResult)

              if(finalResult){
                setAmount();
                setCart([]);
                setReason();

                setThanks(
                  <div>
                    <div style={{fontSize:32}}>
                      🎉 THANK YOU! 🎊
                    </div>
                    {cart && cart.length>0?<div style={{fontSize:22,marginTop:32}}>
                      <b>You</b> funded:
                    </div>:""}
                    <div style={{marginTop:32}}>
                    <StackGrid
                      columnWidth={250}
                      onClick={()=>{
                        return false;
                      }}
                    >
                      {displayCart}
                    </StackGrid>
                    </div>
                    <div style={{fontSize:22,marginTop:32,opacity:0.5}}>
                      <Spin /> redirecting to funders page...
                    </div>
                  </div>
                )
                setTimeout(()=>{
                    setRoute("/funders")
                    history.push("/funders");
                    setCart([]);
                },14000)
                /*setTimeout(()=>{
                  window.scrollBy(0, 700);
                },2500)*/
              }
            }

          }}
          size="large"
          type="primary"
        >
          Fund
        </Button>
        </div>
      </div>
    </div>
  );
}
