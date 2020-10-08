import React, { useState, useEffect } from 'react'
import Blockies from 'react-blockies';
import { Address, Balance, AddressInput, EtherInput } from "."
import { Transactor } from "../helpers"
import { WalletOutlined, QrcodeOutlined, SendOutlined, KeyOutlined } from '@ant-design/icons';
import { Typography, Skeleton, Tooltip, Spin, Modal, Button, notification } from 'antd';
import QR from 'qrcode.react';
import { ethers } from "ethers";
const { Text, Paragraph } = Typography;


export default function Wallet(props) {

  const [open, setOpen] = useState()
  const [selectedAddress, setSelectedAddress] = useState()
  const [signer, setSigner] = useState()
  const [qr, setQr] = useState()
  const [pk, setPK] = useState()


  let providerSend = ""
  if(props.provider){

    providerSend = (
      <Tooltip title={"Wallet"}>
        <WalletOutlined onClick={()=>{
          setOpen(!open)
        }} rotate={-90} style={{padding:7,color:props.color?props.color:"#1890ff",cursor:"pointer",fontSize:28,verticalAlign:"middle"}}/>
      </Tooltip>
    )
  }


  const [amount, setAmount] = useState()
  const [toAddress, setToAddress] = useState()


  useEffect(()=>{
    const getAddress = async ()=>{
      if(props.provider){
        let loadedSigner
        try{
          //console.log("SETTING SIGNER")
          loadedSigner = props.provider.getSigner()
          setSigner(loadedSigner)
        }catch(e){
          //console.log(e)
        }
        if(props.address){
          setSelectedAddress(props.address)
        }else{
          if(!selectedAddress && loadedSigner){
            //console.log("GETTING ADDRESS FOR WALLET PROVIDER",loadedSigner)
            let result = await loadedSigner.getAddress()
            if(result) {
              setSelectedAddress(result)
            }
          }
        }
      }
      //setQr("")
    }
    getAddress()
  },[props.provider,props.address])

  let display
  let receiveButton
  let privateKeyButton
  if(qr){
    display = (
      <div>

      <div>
       <Text copyable>{selectedAddress}</Text>
       </div>


      <QR value={selectedAddress} size={"450"} level={"H"} includeMargin={true} renderAs={"svg"} imageSettings={{excavate:false}}/>
      </div>
    )
    receiveButton = (
      <Button key="hide" onClick={()=>{setQr("")}}>
        <QrcodeOutlined /> Hide
      </Button>
    )
    privateKeyButton = (
      <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
        <KeyOutlined /> Private Key
      </Button>
    )
  }else if(pk){

    let pk = localStorage.getItem("metaPrivateKey")
    let wallet = new ethers.Wallet(pk)

    if(wallet.address!=selectedAddress){
      display = (
        <div>
          <b>*injected account*, private key unknown</b>
        </div>
      )
    }else{
      display = (
        <div>
          <b>Private Key:</b>

          <div>
           <Text copyable>{pk}</Text>
           </div>

           <hr/>

          <i>Point your camera phone at qr code to open in <a target="_blank" href={"https://xdai.io/"+pk}>burner wallet</a>:</i>
          <QR value={"https://xdai.io/"+pk} size={"450"} level={"H"} includeMargin={true} renderAs={"svg"} imageSettings={{excavate:false}}/>

          <Paragraph style={{fontSize:"16"}} copyable>{"https://xdai.io/"+pk}</Paragraph>


        </div>
      )
    }

    receiveButton = (
      <Button key="receive" onClick={()=>{setQr(selectedAddress);setPK("")}}>
        <QrcodeOutlined /> Receive
      </Button>
    )
    privateKeyButton = (
      <Button key="hide" onClick={()=>{setPK("");setQr("")}}>
        <KeyOutlined /> Hide
      </Button>
    )
  }else{

    const inputStyle = {
      padding:10
    }

    display = (
      <div>
        <Typography>⚡ You are on the <a target="_blank" href={"https://www.xdaichain.com/"}>xDai network</a> ⚡</Typography>
        <div style={inputStyle}>
          <AddressInput
             autoFocus={true}
            ensProvider={props.ensProvider}
            placeholder="to address"
            value={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput

            price={props.price}
            value={amount}
            onChange={(value)=>{
              setAmount(value)
            }}
          />
        </div>
        <Typography>📖 <a target="_blank" href={"https://www.xdaichain.com/for-users/get-xdai-tokens"}>Learn more about using xDai</a></Typography>
      </div>
    )
    receiveButton = (
      <Button key="receive" onClick={()=>{setQr(selectedAddress);setPK("")}}>
        <QrcodeOutlined /> Receive
      </Button>
    )
    privateKeyButton = (
      <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
        <KeyOutlined /> Private Key
      </Button>
    )
  }

  return (
    <span>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress?(
              <Address value={selectedAddress} ensProvider={props.ensProvider}/>
            ):<Spin />}
            <div style={{float:"right",paddingRight:25}}>
              <Balance address={selectedAddress} provider={props.provider} dollarMultiplier={props.price}/>
            </div>
          </div>
        }
        onOk={()=>{setOpen(!open)}}
        onCancel={()=>{
          setOpen(!open)

        }}
        footer={[
          privateKeyButton, receiveButton,
          <Button key="submit" type="primary" disabled={!amount || !toAddress || qr} loading={false} onClick={async () => {
            const mainnetBytecode = await props.ensProvider.getCode(toAddress);
            if (!mainnetBytecode || mainnetBytecode === "0x" || mainnetBytecode === "0x0" || mainnetBytecode === "0x00") {
              const tx = Transactor(props.provider)
              tx({
                to: toAddress,
                value: ethers.utils.parseEther(""+amount),
              })
              setOpen(!open)
            } else {
              notification.open({
                  message: '📛 Unable to send',
                  description:
                  "This address is a mainnet smart contract 📡",
                });
            }
          }}>
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
