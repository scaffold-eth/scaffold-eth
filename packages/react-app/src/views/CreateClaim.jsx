import React, { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, Spin, Divider, Input, Row, Col, Checkbox, Typography } from "antd";
import { AddressInput,  DynamicFieldSetMinesite,  DynamicFieldSet } from "../components";

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

  const [ location, setLocation ] = useState("");
  const [ qrShow, setQRShow ] = useState('none');
  const [ yearBuilt, setYearBuilt ] = useState(0);
  const [ bedrooms, setBedrooms ] = useState(0);
  const [ bathrooms, setBathrooms ] = useState(0);
  const [ unixDate, setUnixDate ] = useState(0);

  const defaultPropertyOptions = ["Homeowners Inspection Passed", "Rental Inspection Passed", "Lead Paint Inspection Passed"];
  const [ checkedListInspections, setCheckedListInspections ] = useState(defaultPropertyOptions);
  const onChangeInspections = item => {
    setCheckedListInspections(item)
    console.log(checkedListInspections)
  }

  const defaultPropertyFeatures = ["Garage", "Basement", "Front Yard", "Back Yard", "Pool", "Driveway", "Solar Panels", "Washer/Dryer"];
  const [ checkedListFeatures, setCheckedListFeatures ] = useState(defaultPropertyFeatures);
  const onChangeFeatures = item => {
    setCheckedListFeatures(item)
  }

  return (
    <div >
      <h1 >{""}</h1>
      <Row gutter={[32,32]} justify='center'>
        <Col span="14">
          <div style={{textAlign: "left", margin:'15px'}}>
            <h1 style={{ textAlign: "center", color:"#455A64"}}>
            Property Claim
            </h1>
            <Card style={{background:"#e4e4e4"}}>
            <h3>Location</h3>
            <Input type="text" onChange={(e)=>{
              setLocation(e.target.value)
              }}
              value={location}
              ensProvider={mainnetProvider}
              placeholder="565 Brook Road, Boston, MA 02215"
            />
            <h1></h1>

            <p ></p>
            Bedrooms:
            <Input onChange={(e)=>{
              setBedrooms(e.target.value)
              }}
              style={{width:'125px', margin:'12px'}}
              placeholder="2"
            />
            Bathrooms:
            <Input onChange={(e)=>{
              setBathrooms(e.target.value)
              }}
              style={{width:'125px', margin:'12px'}}
              placeholder="1"
            />
            <h1></h1>

            <h3 >Property Features</h3>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeFeatures}>
              <Row>
                <Col span={6}>
                  <Checkbox value="Garage">Garage</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Basement">Basement</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Front Yard">Front Yard</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Back Yard">Back Yard</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Pool">Pool</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Driveway">Driveway</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Solar Panels">Solar Panels</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Washer/Dryer">Washer/Dryer</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            <h1></h1>

            <h3>Year Built</h3>
            <Input onChange={(e)=>{
              setYearBuilt(e.target.value)
              }}
              style={{width:'100px'}}
              placeholder="1975"
            />

            <h3 >Timestamp</h3>
            <Input onChange={(e)=>{
            setUnixDate(Date.now());
            }}
            value={unixDate}
            style={{width:"175px"}}/>
            <Button onClick={(e)=>{
              var timestamp = new Date(Date.now())
              setUnixDate(timestamp)}}>
            now</Button>
            <h1 ></h1 >

            <h3 >Inspections/ Certifications Contracts</h3>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeInspections}>
              <Row>
                <Col span={6}>
                  <Checkbox value="0x9E67029403675Ee18777Ed38F9C1C5c75F7B34f2">Residential Inspection Passed</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="0x7Fd8898fBf22Ba18A50c0Cb2F8394a15A182a07d">Gas Appliance Inspection Passed</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="0xF08E19B6f75686f48189601Ac138032EBBd997f2">Rental Property Cert. of Compliance</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="0x68C1766Fdf7fFae8ea8F10b26078bA47658BC5Bc">LEED Green Building Cert.</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            
            </Card>
            </div>

            <div style={{textAlign: "center", margin:'15px'}}>
            <Button
            disabled={!location || !bedrooms || !bathrooms|| !yearBuilt || !unixDate}
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
                "{\n"+"      "+"Address: "+location+
                "\n"+"      "+"Year Built: "+yearBuilt+
                "\n"+"      "+"Bedrooms: "+bedrooms+
                "\n"+"      "+"Bathrooms: "+bathrooms+
                "\n"+"      "+"Property Features: "+checkedListFeatures+
                "\n"+"      "+"Timestamp: "+unixDate+
                "\n"+"      "+"Inspections/ Certifications Contracts: "+checkedListInspections+
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
            console.log(bedrooms)
            console.log(bathrooms)
            let benePay = Math.round(bedrooms*(bathrooms/100)*60*0.10);
            console.log(benePay)
            console.log(location)
            console.log(ipfsHash)
            console.log(address)
            const result = await tx( writeContracts.ClaimToken.createAndMintClaim(location, ipfsHash, benePay, checkedListInspections) )
            }}
            disabled={!ipfsHash || !location || !bedrooms || !bathrooms|| !unixDate|| !yearBuilt}
            size="large" 
            shape="round" 
            type="primary"
            style={{ background: "#ff7875", borderColor: "#bae7ff", margin:"32px"}}>
            Mint Token
          </Button>

        </Col>
      </Row >
      
      <Row justify="center">
        <Col >
          <div style={{margin:'15px', display:qrShow}}>
              <Card >
                <h3 >Claim QR Code </h3>
                <h3 >Location: {location}</h3>
                <QRCode value={"http://ipfs.io/ipfs/"+ipfsHash} />
              </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
