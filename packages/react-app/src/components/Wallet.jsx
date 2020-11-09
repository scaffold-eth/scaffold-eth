import React, { useState } from "react";
import { WalletOutlined, QrcodeOutlined, SendOutlined, KeyOutlined } from "@ant-design/icons";
import { Tooltip, Spin, Modal, Button, Typography } from "antd";
import QR from "qrcode.react";
import { parseEther } from "@ethersproject/units";
import { useUserAddress } from "eth-hooks";
import { Transactor } from "../helpers";
import Address from "./Address";
import Balance from "./Balance";
import AddressInput from "./AddressInput";
import EtherInput from "./EtherInput";
import { ethers } from "ethers";
const { Text, Paragraph } = Typography;

/*

  Wallet UI for sending, receiving, and extracting the burner wallet

  <Wallet
    address={address}
    provider={userProvider}
    ensProvider={mainnetProvider}
    price={price}
  />

*/

export default function Wallet(props) {
  const signerAddress = useUserAddress(props.provider);
  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState();
  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  const [pk, setPK] = useState()

  const providerSend = props.provider ? (
    <Tooltip title="Wallet">
      <WalletOutlined
        onClick={() => {
          setOpen(!open);
        }}
        rotate={-90}
        style={{
          padding: 7,
          color: props.color ? props.color : "#1890ff",
          cursor: "pointer",
          fontSize: 28,
          verticalAlign: "middle",
        }}
      />
    </Tooltip>
  ) : (
    ""
  );

  let display;
  let receiveButton;
  let privateKeyButton
  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size="450"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </div>
    );
    receiveButton = (
      <Button
        key="hide"
        onClick={() => {
          setQr("");
        }}
      >
        <QrcodeOutlined /> Hide
      </Button>
    );
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

     let extraPkDisplayAdded = {}
     let extraPkDisplay = []
     extraPkDisplayAdded[wallet.address] = true
     extraPkDisplay.push(
       <div style={{fontSize:16,padding:2,backgroundStyle:"#89e789"}}>
          <a href={"/pk#"+pk}>
            <Address minimized={true} value={wallet.address} ensProvider={props.ensProvider} /> {wallet.address.substr(0,6)}
          </a>
       </div>
     )
     for (var key in localStorage){
       if(key.indexOf("metaPrivateKey_backup")>=0){
         console.log(key)
         let pastpk = localStorage.getItem(key)
         let pastwallet = new ethers.Wallet(pastpk)
         if(!extraPkDisplayAdded[pastwallet.address] /*&& selectedAddress!=pastwallet.address*/){
           extraPkDisplayAdded[pastwallet.address] = true
           extraPkDisplay.push(
             <div style={{fontSize:16}}>
                <a href={"/pk#"+pastpk}>
                  <Address minimized={true} value={pastwallet.address} ensProvider={props.ensProvider} /> {pastwallet.address.substr(0,6)}
                </a>
             </div>
           )
         }
       }
     }


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

         {extraPkDisplay?(
           <div>
             <h3>
              Known Private Keys:
             </h3>
             {extraPkDisplay}
             <Button onClick={()=>{
               let currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
               if(currentPrivateKey){
                 window.localStorage.setItem("metaPrivateKey_backup"+Date.now(),currentPrivateKey);
               }
               const randomWallet = ethers.Wallet.createRandom()
               const privateKey = randomWallet._signingKey().privateKey
               window.localStorage.setItem("metaPrivateKey",privateKey);
               window.location.reload()
             }}>
              Generate
             </Button>
           </div>
         ):""}

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
  } else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
            autoFocus
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
            onChange={value => {
              setAmount(value);
            }}
          />
        </div>
      </div>
    );
    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPK("");
        }}
      >
        <QrcodeOutlined /> Receive
      </Button>
    );
    privateKeyButton = (
      <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
        <KeyOutlined /> Private Key
      </Button>
    );
  }

  return (
    <span>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress ? <Address value={selectedAddress} ensProvider={props.ensProvider} /> : <Spin />}
            <div style={{ float: "right", paddingRight: 25 }}>
              <Balance address={selectedAddress} provider={props.provider} dollarMultiplier={props.price} />
            </div>
          </div>
        }
        onOk={() => {
          setQr();
          setPK();
          setOpen(!open);
        }}
        onCancel={() => {
          setQr();
          setPK();
          setOpen(!open);
        }}
        footer={[
          privateKeyButton, receiveButton,
          <Button
            key="submit"
            type="primary"
            disabled={!amount || !toAddress || qr}
            loading={false}
            onClick={() => {
              const tx = Transactor(props.provider);

              let value;
              try {
                value = parseEther("" + amount);
              } catch (e) {
                // failed to parseEther, try something else
                value = parseEther("" + parseFloat(amount).toFixed(8));
              }

              tx({
                to: toAddress,
                value,
              });
              setOpen(!open);
              setQr();
            }}
          >
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
