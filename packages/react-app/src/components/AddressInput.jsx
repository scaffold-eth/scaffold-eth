import { CameraOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Badge, Input, message, Spin } from "antd";
import { useLookupAddress } from "eth-hooks";
import React, { useCallback, useState } from "react";
import QrReader from "react-qr-reader";
import { QRPunkBlockie } from ".";

// probably we need to change value={toAddress} to address={toAddress}

/*
  ~ What it does? ~

  Displays an address input with QR scan option

  ~ How can I use? ~

  <AddressInput
    autoFocus
    ensProvider={mainnetProvider}
    placeholder="Enter address"
    value={toAddress}
    onChange={setToAddress}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide placeholder="Enter address" value for the input
  - Value of the address input is stored in value={toAddress}
  - Control input change by onChange={setToAddress}
                          or onChange={address => { setToAddress(address);}}
*/

export default function AddressInput(props) {
  const [value, setValue] = useState(props.address);
  const [scan, setScan] = useState(false);

  const currentValue = typeof props.value !== "undefined" ? props.value : value;
  const ens = useLookupAddress(props.ensProvider, currentValue);

  const scannerButton = (
    <div
      style={{ marginTop: 4, cursor: "pointer" }}
      onClick={() => {
        setScan(!scan);
      }}
    >
      <Badge count={<CameraOutlined style={{ color: "#000000", fontSize: 9 }} />}>
        <QrcodeOutlined style={{ color: "#000000", fontSize: 18 }} />
      </Badge>{" "}
      Scan
    </div>
  );

  const { ensProvider, onChange } = props;
  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined") {

        console.log("SCAN",newValue)

        /*console.log("🔑 Incoming Private Key...");
        rawPK = incomingPK;
        burnerConfig.privateKey = rawPK;
        window.history.pushState({}, "", "/");
        const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
        if (currentPrivateKey && currentPrivateKey !== rawPK) {
          window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
        }
        window.localStorage.setItem("metaPrivateKey", rawPK);*/
        if(newValue && newValue.indexOf && newValue.indexOf("wc:")===0){
          props.walletConnect(newValue)
        }else{
          let address = newValue;
          setValue(address);
          if (address.indexOf(".eth") > 0 || address.indexOf(".xyz") > 0) {
            try {
              const possibleAddress = await ensProvider.resolveName(address);
              if (possibleAddress) {
                address = possibleAddress;
              }
              // eslint-disable-next-line no-empty
            } catch (e) {}
          }
          setValue(address);
          if (typeof onChange === "function") {
            onChange(address);
          }
        }
      }
    },
    [ensProvider, onChange],
  );

  const scanner = scan ? (
    <div
      style={{
        zIndex: 256,
        position: "absolute",
        left: "-25%",
        top: "-150%",
        width: "150%",
        backgroundColor: "#333333",
      }}
      onClick={() => {
        setScan(false);
      }}
    >
      <div
        style={{ fontSize: 16, position: "absolute", width: "100%", textAlign: "center", top: "25%", color: "#FFFFFF" }}
      >
        <Spin /> connecting to camera...
      </div>
      <QrReader
        delay={250}
        resolution={1200}
        onError={e => {
          console.log("SCAN ERROR", e);
          setScan(false);
          message.error("Camera Error: " + e.toString());
        }}
        onScan={newValue => {
          if (newValue) {
            console.log("SCAN VALUE",newValue);

            if(newValue && newValue.length==66 && newValue.indexOf("0x")===0){
              console.log("This might be a PK...",newValue)
              setTimeout(()=>{
                console.log("opening...")
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = "https://punkwallet.io/pk#"+newValue;
                a.click();
                document.body.removeChild(a);
              },250)
              setScan(false);
              updateAddress();
            }else if(newValue && newValue.indexOf && newValue.indexOf("http")===0){
              console.log("this is a link, following...")
              setTimeout(()=>{
                console.log("opening...")
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = newValue;
                a.click();
                document.body.removeChild(a);
              },250)

              setScan(false);
              updateAddress();
            }else{
              let possibleNewValue = newValue;
              possibleNewValue = possibleNewValue.replace("ethereum:", "");
              possibleNewValue = possibleNewValue.replace("eth:", "");
              console.log("possibleNewValue",possibleNewValue)
              if (possibleNewValue.indexOf("/") >= 0) {
                possibleNewValue = possibleNewValue.substr(possibleNewValue.lastIndexOf("0x"));
                console.log("CLEANED VALUE", possibleNewValue);
              }
              setScan(false);
              updateAddress(possibleNewValue);
            }

          }
        }}
        style={{ width: "100%" }}
      />
    </div>
  ) : (
    ""
  );

  const punkSize = 45;

  const part1 = currentValue && currentValue.substr && currentValue.substr(2, 20);
  const part2 = currentValue && currentValue.substr && currentValue.substr(22);
  const x = parseInt(part1, 16) % 100;
  const y = parseInt(part2, 16) % 100;

  props.hoistScanner(() => {
    setScan(!scan);
  });

  return (
    <div>
      <div style={{ position: "absolute", left: -202, top: -88 }}>
        {currentValue && currentValue.length > 41 ? <QRPunkBlockie scale={0.6} address={currentValue} /> : ""}
      </div>

      {scanner}

      <Input
        disabled={props.disabled}
        id="0xAddress" // name it something other than address for auto fill doxxing
        name="0xAddress" // name it something other than address for auto fill doxxing
        autoComplete="off"
        autoFocus={props.autoFocus}
        placeholder={props.placeholder ? props.placeholder : "address"}
        value={ens || currentValue}
        addonAfter={scannerButton}
        onChange={e => {
          updateAddress(e.target.value);
        }}
      />
    </div>
  );
}
