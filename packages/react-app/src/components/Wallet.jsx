import { WalletOutlined } from "@ant-design/icons";
import { Button, message, Modal, Spin, Tooltip, Typography, Input, Space  } from "antd";
import { useUserAddress } from "eth-hooks";
import { ethers } from "ethers";
import QR from "qrcode.react";
import React, { useState, useEffect } from "react";
import { Blockie } from ".";
import Address from "./Address";
import Balance from "./Balance";
import QRPunkBlockie from "./QRPunkBlockie";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');

const { Text } = Typography;

/*
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <Wallet
    provider={userProvider}
    address={address}
    ensProvider={mainnetProvider}
    price={price}
    color='red'
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
*/

export default function Wallet(props) {
  const signerAddress = useUserAddress(props.provider);
  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState();
  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();

  const [showPrivate, setShowPrivate] = useState();

  const [showImport, setShowImport] = useState();

  const [importMnemonic, setImportMnemonic] = useState();
  const [importMnemonicIndex, setImportMnemonicIndex] = useState("0");
  const [importPrivatekey, setImportPrivatekey] = useState();
  const [importAddress, setImportAddress] = useState();

  const [deleteCurrentBurner, setDeleteCurrentBurner] = useState( false );

  useEffect(()=>{
    const calculatePK = async () => {
      if(importMnemonic){
        const seed = await bip39.mnemonicToSeed(importMnemonic)
        console.log("seed",seed)
        const hdwallet = hdkey.fromMasterSeed(seed);
        console.log("hdwallet",hdwallet)
        const wallet_hdpath = "m/44'/60'/0'/0/";
        const fullPath = wallet_hdpath + importMnemonicIndex
        console.log("fullPath",fullPath)
        const wallet = hdwallet.derivePath(fullPath).getWallet();
        console.log("wallet",wallet)
        const privateKey = wallet._privKey.toString('hex');
        console.log("privateKey",privateKey)
        setImportPrivatekey("0x"+privateKey)
      }else{
        setImportPrivatekey()
      }
    }
    calculatePK()
  },[importMnemonic, importMnemonicIndex])

  useEffect(()=>{
    const calculateAddress = async () => {
      if(importPrivatekey){
        try{
          const officialEthersWallet = new ethers.Wallet(importPrivatekey)
          console.log(officialEthersWallet)
          setImportAddress(officialEthersWallet.address)
        }catch(e){
          console.log(e)
          setImportAddress("")
        }
      }
    }
    calculateAddress()
  },[ importPrivatekey ])



  const providerSend = props.provider ? (
      <WalletOutlined
        style={{ fontSize: 32, color: "#1890ff" }}
        onClick={() => {
          setOpen(!open);
        }}
      />
  ) : (
    ""
  );

  let display;
  let receiveButton;
  let privateKeyButton;
  /* if (qr) {
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
    receiveButton = ""
    privateKeyButton = (
     <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
       <KeyOutlined /> Private Key
     </Button>
   )
 }else if(pk){
*/

  const punkSize = 45;

  const pk = localStorage.getItem("metaPrivateKey");
  const wallet = new ethers.Wallet(pk);

  if (wallet.address !== selectedAddress) {
    display = (
      <div>
        <b>*injected account*, private key unknown</b>
      </div>
    );
  } else {
    const extraPkDisplayAdded = {};
    const extraPkDisplay = [];
    const mypart1 = wallet.address && wallet.address.substr(2, 20);
    const mypart2 = wallet.address && wallet.address.substr(22);
    const myx = parseInt(mypart1, 16) % 100;
    const myy = parseInt(mypart2, 16) % 100;
    extraPkDisplayAdded[wallet.address] = true;
    extraPkDisplay.push(
      <div style={{ fontSize: 38, fontWeight: "bolder", padding: 2, backgroundStyle: "#89e789" }}>
        <div style={{float:'right'}}>
          <Button
            style={{ marginTop: 16 }}
            onClick={() => {
              setDeleteCurrentBurner(true)
            }}
          >
            <span style={{ marginRight: 8 }}>☢️</span> Delete
          </Button>
        </div>
        <div style={{ float: "left", position: "relative", width: punkSize, height: punkSize, overflow: "hidden" }}>
          <img
            src="/punks.png"
            style={{
              position: "absolute",
              left: -punkSize * myx,
              top: -punkSize * myy,
              width: punkSize * 100,
              height: punkSize * 100,
              imageRendering: "pixelated",
            }}
          />
        </div>
        <a href={"/pk#" + pk}>
          <Blockie address={wallet.address} scale={4} /> {wallet.address.substr(0, 6)}
        </a>
      </div>,
    );

    let secondBestAccount;

    for (const key in localStorage) {
      if (key.indexOf("metaPrivateKey_backup") >= 0) {
        // console.log(key)
        const pastpk = localStorage.getItem(key);
        secondBestAccount = pastpk;
        const pastwallet = new ethers.Wallet(pastpk);
        if (!extraPkDisplayAdded[pastwallet.address] /* && selectedAddress!=pastwallet.address */) {
          extraPkDisplayAdded[pastwallet.address] = true;
          const part1 = pastwallet.address && pastwallet.address.substr(2, 20);
          const part2 = pastwallet.address && pastwallet.address.substr(22);
          const x = parseInt(part1, 16) % 100;
          const y = parseInt(part2, 16) % 100;
          extraPkDisplay.push(
            <div style={{ fontSize: 32 }}>
              <a href={"/pk#" + pastpk}>
                <div
                  style={{ float: "left", position: "relative", width: punkSize, height: punkSize, overflow: "hidden" }}
                >
                  <img
                    src="/punks.png"
                    style={{
                      position: "absolute",
                      left: -punkSize * x,
                      top: -punkSize * y,
                      width: punkSize * 100,
                      height: punkSize * 100,
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                <Blockie address={pastwallet.address} scale={3.8} /> {pastwallet.address.substr(0, 6)}
              </a>
            </div>,
          );
        }
      }
    }

    let currentButton = (
      <span style={{ marginRight: 4 }}>
        <span style={{ marginRight: 8 }}>⛔️</span> Reveal{" "}
      </span>
    );
    let privateKeyDisplay = "";
    if (showPrivate) {
      currentButton = (
        <span style={{ marginRight: 4 }}>
          <span style={{ marginRight: 8 }}>😅</span> Hide{" "}
        </span>
      );

      const fullLink = window.origin + "/pk#" + pk

      privateKeyDisplay = (
        <div>
          <b>Private Key:</b>
          <div>
            <Text style={{ fontSize: 11 }} copyable>
              {pk}
            </Text>
          </div>

          <div style={{marginTop:16}}>
            <div><b>Punk Wallet:</b></div>
            <Text style={{ fontSize: 11 }} copyable>
              {fullLink}
            </Text>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              const el = document.createElement("textarea");
              el.value = window.origin + "/pk#" + pk;
              document.body.appendChild(el);
              el.select();
              document.execCommand("copy");
              document.body.removeChild(el);
              message.success(<span style={{ position: "relative" }}>Copied Private Key Link</span>);
            }}
          >
            <div style={{position:"relative",top:34,left:-11}}>
              <QRPunkBlockie withQr={false} address={selectedAddress} />
            </div>

            <QR
              value={fullLink}
              size="450"
              level="H"
              includeMargin
              renderAs="svg"
              imageSettings={{ excavate: true,width:105,height:105 /*, src: "https://punkwallet.io/punk.png",*/}}
            />
            <div style={{position:"relative",top:-285,left:172}}>
              🔑
            </div>
            <div style={{position:"relative",top:-305,left:266}}>
              🔑
            </div>
            <div style={{position:"relative",top:-244,left:172}}>
              🔑
            </div>
            <div style={{position:"relative",top:-265,left:262}}>
              🔑
            </div>
          </div>

        </div>
      );
    }

    /*
    const [importMnemonic, setImportMnemonic] = useState();
    const [importMnemonicIndex, setImportMnemonicIndex] = useState();
    const [importPrivatekey, setImportPrivatekey] = useState();
    const [importAddress, setImportAddress] = useState();*/

    if ( deleteCurrentBurner ){

      display = (
        <div>

          <h2>Remove this private key from this device?</h2>

          <div style={{ float: "left", position: "relative", width: punkSize, height: punkSize, overflow: "hidden" }}>
            <img
              src="/punks.png"
              style={{
                position: "absolute",
                left: -punkSize * myx,
                top: -punkSize * myy,
                width: punkSize * 100,
                height: punkSize * 100,
                imageRendering: "pixelated",
              }}
            />
          </div>

          <div style={{float:'right'}}><Button
            style={{ marginTop: 16 }}
            onClick={() => {
              //setDeleteCurrentBurner(false)
              console.log("DELETE THE CURRENT AND FALLBACK TO ",secondBestAccount)

              const currentvalueis =  window.localStorage.getItem("metaPrivateKey")
              console.log("currentvalueis",currentvalueis)

              window.localStorage.setItem("metaPrivateKey",secondBestAccount)

              //now tear through all the backups and remove them if they match
              for (const key in localStorage) {
                if (key.indexOf("metaPrivateKey_backup") >= 0) {
                  const pastpk = localStorage.getItem(key);
                  if(pastpk==currentvalueis){
                    window.localStorage.removeItem(key)
                    //console.log("FOUND DELETE",key)
                  }
                }
              }
              setTimeout(()=>{window.location.reload();},100)

            }}
          >
            <span style={{ marginRight: 8 }}>☢️</span>Delete
          </Button></div>
          <Button
            style={{ marginTop: 16 }}
            onClick={() => {
              setDeleteCurrentBurner(false)
            }}
          >
            <span style={{ marginRight: 8 }}>💾</span>Keep
          </Button>

        </div>

      )

    } else if(showImport){
      display = (
        <div>
              <div style={{marginTop:21, width:420}}><h2>IMPORT</h2></div>

              <div style={{opacity:0.5}}>mnemonic</div>
              <Input.Password  style={{width:380}} size="large" placeholder="word1 word2 word3" onChange={async (e)=>{
                setImportMnemonic(e.target.value)
              }}/>


              <Input style={{ width:69 }} value={importMnemonicIndex} onChange={(e)=>{
                setImportMnemonicIndex(e.target.value)
              }}size="large" />

              <div style={{marginTop:21, width:420}}><h4>OR</h4></div>

              <div style={{ opacity:0.5}}>private key</div>
              <Input.Password disabled={importMnemonic}  style={{width:420}} size="large" value={importPrivatekey} placeholder="0x..." onChange={(e)=>{
                setImportPrivatekey(e.target.value)
              }}/>

              <hr/>

              {importAddress?<div style={{width:420,height:200}}>
                <div style={{float:"right",marginTop:64}}>
                  <Address value={importAddress}/>
                </div>
                <div style={{ position:"relative", top:-100, left:-100}}>
                <QRPunkBlockie withQr={false} address={importAddress} />

              </div><hr/></div>:""}



          <div style={{float:'right'}}><Button
            style={{ marginTop: 16 }}
            disabled={ !importPrivatekey || importMnemonic && importMnemonic.length < 7 } //safety third!
            onClick={() => {
              const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
              if (currentPrivateKey) {
                window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
              }

              try{
                const officialEthersWallet = new ethers.Wallet(importPrivatekey.trim())
                console.log(officialEthersWallet)
                setImportAddress(officialEthersWallet.address)
                window.localStorage.setItem("metaPrivateKey", importPrivatekey);
                window.location.reload();
                //setShowImport(!showImport)
              }catch(e){
                console.log(e)
              }

            }}
          >
            <span style={{ marginRight: 8 }}>💾</span>Save
          </Button></div>
              <Button
                style={{ marginTop: 16 }}
                onClick={() => {
                  setShowImport(false)
                }}
              >
                <span style={{ marginRight: 8 }}>⏪</span>Cancel
              </Button>
        </div>
      );
    }else{
      display = (
        <div>
          {privateKeyDisplay}
          <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #CCCCCC" }}>
            <Button
              style={{ marginTop: 16 }}
              onClick={() => {
                setShowPrivate(!showPrivate);
              }}
            >
              {" "}
              {currentButton} Private Key
            </Button>
          </div>
          {extraPkDisplay ? (
            <div style={{ paddingBottom: 32, borderBottom: "1px solid #CCCCCC" }}>
              <h3>Switch Account:</h3>
              {extraPkDisplay}
              <div style={{float:'right'}}><Button
                style={{ marginTop: 16 }}
                onClick={() => {
                  setShowImport(!showImport)
                }}
              >
                <span style={{ marginRight: 8 }}>💾</span>Import
              </Button></div>
              <Button
                style={{ marginTop: 16 }}
                onClick={() => {
                  const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
                  if (currentPrivateKey) {
                    window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
                  }
                  const randomWallet = ethers.Wallet.createRandom();
                  const privateKey = randomWallet._signingKey().privateKey;
                  window.localStorage.setItem("metaPrivateKey", privateKey);
                  window.location.reload();
                }}
              >
                <span style={{ marginRight: 8 }}>⚙️</span>Generate
              </Button>

            </div>
          ) : (
            ""
          )}
        </div>
      );
    }

  }

  /* } else {
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
            address={toAddress}
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
  } */

  return (
    <span style={{ verticalAlign: "middle", paddingLeft: 16, fontSize: 32 }}>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress ? <Address address={selectedAddress} ensProvider={props.ensProvider} /> : <Spin />}
            <div style={{ float: "right", paddingRight: 25 }}>
              <Balance address={selectedAddress} provider={props.provider} dollarMultiplier={props.price} />
            </div>
          </div>
        }
        onOk={() => {
          setOpen(!open);
        }}
        onCancel={() => {
          setOpen(!open);
        }}
        footer={[
          privateKeyButton,
          receiveButton,
          <Button
            key="submit"
            type="primary"
            loading={false}
            onClick={() => {
              setOpen(!open);
            }}
          >
            Hide
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
