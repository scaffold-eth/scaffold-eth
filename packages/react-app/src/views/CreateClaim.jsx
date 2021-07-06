/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, Spin, Divider, Input, Row, Col, Checkbox, Typography } from "antd";
import { AddressInput,  DynamicFieldSetMinesite,  DynamicFieldSetAncestors } from "../components";

const { BufferList } = require('bl')
var QRCode = require('qrcode.react');
const { Text } = Typography;

export default function CreateClaim({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

  
  const ipfsAPI = require('ipfs-http-client');
  const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

  const getFromIPFS = async hashToGet => {
    for await (const file of ipfs.get(hashToGet)) {
      console.log(file.path)
      if (!file.content) continue;
      const content = new BufferList()
      for await (const chunk of file.content) {
        content.append(chunk)
      }
      console.log(content)
      return content
    }
  }
  
  const addToIPFS = async fileToUpload => {
    for await (const result of ipfs.add(fileToUpload)) {
      return result
    }
  }

  const [ sending, setSending ] = useState()
  const [ ipfsHash, setIpfsHash ] = useState()
  const [ ipfsContents, setIpfsContents ] = useState()

  const asyncGetFile = async ()=>{
    let result = await getFromIPFS(ipfsHash)
    setIpfsContents(result.toString())
  }

  useEffect(()=>{
    if(ipfsHash) asyncGetFile()
  },[ipfsHash])

  let ipfsDisplay = ""
  if(ipfsHash){
    if(!ipfsContents){
      ipfsDisplay = (
        <Spin />
      )
    }else{
      ipfsDisplay = (
        <pre style={{margin:8,padding:8,border:"1px solid #dddddd",backgroundColor:"#ededed"}}>
          {ipfsContents}
        </pre>
      )
    }
  }

  const [ newAssetBarcode, setNewAssetBarcode ] = useState();
  const [ qrShow, setQRShow ] = useState('none');
  const [ mass, setMass ] = useState();
  const [ purity, setPurity ] = useState();
  const [ refinerGPS, setRefinerGPS ] = useState();
  const [ minesiteGPS, setMinesiteGPS ] = useState();
  const [ ancestors, setAncestors ] = useState();
  const [ unixDate, setUnixDate ] = useState();

  const BeneOptions = ['DevSol', 'MUMA', 'NGO'];
  const defaultCheckedList = ['DevSol', 'MUMA', 'NGO']
  const [ checkedList, setCheckedList ] = useState(defaultCheckedList);
  const onChange = item => {
    setCheckedList(item)
    console.log(checkedList)
  }

  return (
    <div >
      <h1 >{""}</h1>
      <Row gutter={[32,32]} justify='center'>
        <Col span="8">
          <div style={{textAlign: "left", margin:'15px'}}>
            <h1 style={{ textAlign: "left", color:"#455A64"}}>Create Claim</h1>
            <Card>
            <h3>Product Identifier</h3>
            <AddressInput onChange={(newValue)=>{
              setNewAssetBarcode(newValue)
              }}
              value={newAssetBarcode}
              ensProvider={mainnetProvider}
              placeholder="Scan Product Identifier or Enter Here"
            />
            <h1></h1>

            <h3>Material Properties</h3>
            Mass:
            <Input onChange={(e)=>{
              setMass(e.target.value)
              }}
              style={{width:'125px', margin:'12px'}}
              placeholder="Enter mass"
            />grams
            <p ></p>
            Purity:
            <Input onChange={(e)=>{
              setPurity(e.target.value)
              }}
              style={{width:'125px', margin:'12px'}}
              placeholder="Enter percent"
            />%
            <h1></h1>

            <h3>Location</h3>
            
            <p >Refiner GPS Coordinates:</p>
            <Input onChange={(e)=>{
              setRefinerGPS(e.target.value)
              }}
              style={{width:'125px', margin:"0px"}}
              placeholder="xx.xxxx, xx.xxxx"
            />
            <p >{""}</p>
            <p >Minesite GPS Coordinates :</p>
            <DynamicFieldSetMinesite 
            setMinesiteGPS={setMinesiteGPS}>
            </DynamicFieldSetMinesite>

            <h3 >Inheritance</h3>
            <p >Ancestor Token ID's</p>
            <DynamicFieldSetAncestors 
            setAncestors={setAncestors}>
            </DynamicFieldSetAncestors>

            <h3 >Time</h3>
            <Input onChange={(e)=>{
            setUnixDate(Date.now());
            }}
            value={unixDate}
            style={{width:"150px"}}/>
            <Button onClick={(e)=>{setUnixDate(Date.now)}}>
            now</Button>
            <h1 ></h1 >

            <h3 >Beneficiaries</h3>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
              <Row>
                <Col span={8}>
                  <Checkbox value="0x93eb95075A8c49ef1BF3edb56D0E0fac7E3c72ac">DevSol</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="0xF08E19B6f75686f48189601Ac138032EBBd997f2">MUMA</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="0x7Fd8898fBf22Ba18A50c0Cb2F8394a15A182a07d">NGO</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            
            </Card>
            </div>

            <div style={{textAlign: "center", margin:'15px'}}>
            <Button
            disabled={!newAssetBarcode || !mass || !purity || !refinerGPS || !minesiteGPS || !ancestors || !unixDate}
            style={{margin:16}} 
            loading={sending} 
            size="large" 
            shape="round" 
            type="primary" 
            onClick={async()=>{
              console.log("UPLOADING...")
              setSending(true)
              setIpfsHash()
              setIpfsContents()
              
              const result = await addToIPFS(
                "{\n"+"      "+"Product ID: "+newAssetBarcode+
                "\n"+"      "+"Mass (grams): "+mass+
                "\n"+"      "+"Purity (%): "+purity+
                "\n"+"      "+"Refiner GPS Coordinates: "+refinerGPS+
                "\n"+"      "+"Minesite GPS Coordinates: "+minesiteGPS+
                "\n"+"      "+"Ancestor IDs: "+ancestors+
                "\n"+"      "+"Unix Timestamp: "+unixDate+
                "\n"+"      "+"Beneficiary Addresses: "+checkedList+
                "\n}"
              )
              if(result && result.path) {
                setIpfsHash(result.path)
              }
              setSending(false)
            }}>
            Upload Claim
            </Button>
            </div>
          
          <div style={{textAlign: "left"}}>
            <Card >
              <h4 >Claim Identifier: <Text copyable={{ text: ipfsHash }} style={{color:"#1890ff"}}>{ipfsHash}</Text></h4>
            </Card>
          </div>
          <div style={{textAlign: "left"}}>
            <Card >
              <h4 >Claim Viewer:</h4>
              {ipfsDisplay}
            </Card>
          </div>

          <Button
            onClick={ async ()=>{
            setQRShow("block")
            console.log(mass)
            console.log(purity)
            let benePay = Math.round(mass*(purity/100)*60*0.10);
            console.log(benePay)
            const result = await tx( writeContracts.AdaptiveTokenVendor.mintAndCreateClaim(newAssetBarcode, ipfsHash, benePay, checkedList) )
            }}
            disabled={!ipfsHash || !newAssetBarcode || !mass || !purity}
            size="large" 
            shape="round" 
            type="primary"
            style={{ background: "#ff7875", borderColor: "#bae7ff", margin:"32px"}}>
            Mint Token
          </Button>

        </Col>
      </Row >
      
      <Row >
        <Col >
          <div style={{margin:'15px', display:qrShow}}>
              <Card >
                <h3 >Claim QR Code </h3>
                <h3 >Product ID: {newAssetBarcode}</h3>
                <QRCode value={"http://ipfs.io/ipfs/"+ipfsHash} />
              </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
