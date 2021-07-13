import React, { useState } from "react";
import { Input, Button, Row, Col, Card, Space, Switch, List, Divider, Typography} from "antd";
import { Address, AddressInput } from "../components";
import { read } from "fs";

const { Text } = Typography;


export default function ClaimExplorer({ mainnetProvider, fontSize, blockExplorer, readContracts, mintedAssets, yourClaims, address, writeContracts, tx, updateYourClaims }) {

    const [URI, setLookupURI] =useState('');

    const [location, newLocation] = useState("");
    const [tokenID, setTokenID] = useState(0);
    const [newOwnerProp, setNewOwnerProp] = useState('0x0000000000000000000000000000000000000000');
    
    const [newTokenID, setNewTokenID] = useState(0);

    const [lookupAddress, newLookupAddress] = useState();
    const [addressBalance, newAddressBalance] = useState(0);

    const [transferToAddress, setTransferToAddress] = useState({});
    const [newDataSource, setNewDataSource] = useState(mintedAssets);

    function onChange(checked) {
        console.log(`switch to ${checked}`);
        updateYourClaims();

        if (checked==false) {
        setNewDataSource(mintedAssets);
        console.log("false");
        console.log(mintedAssets)
        }
        else {
        updateYourClaims()
        setNewDataSource(yourClaims)
        console.log("true")
        console.log(yourClaims)
        }
    }

    return (
        <div >
            <div style={{ margin:'30px'}}>
                <h1 style={{color:"#455A64"}}>Claim Explorer</h1>
                <h1 >{' '}</h1>
            </div >

            <div style={{  margin:'30px'}}>
                <Row justify='center'>
                    
                        <Card style={{margin:'24px', background:"#d9e3f0"}}>
                            <h2 style={{color:"#455A64"}}>Token Details</h2>
                            <Input type="text" 
                            placeholder="Enter Token ID"
                            style={{ width: 150, margin:'8px' }}
                            onChange={(e)=>{
                            setNewTokenID(e.target.value)
                            }}
                            />
                            <Button onClick={ async ()=>{
                            setNewTokenID(newTokenID)
                            console.log("Token URI to Lookup: ",newTokenID)
                            const URI = await readContracts.ClaimToken.tokenURI(newTokenID)
                            setLookupURI(URI)
                            console.log(URI)
                            }}
                            type="primary"
                            style={{ background: "#1890ff", borderColor: "#91d5ff", margin:'15px'}}
                            >
                            Search
                            </Button>
                            <div style={{fontSize:'16px', color:"#434343"}}>URI: <Text copyable={{text:URI}}style={{fontSize:'13px', color:"#1890ff"}}>{URI.slice(21)}</Text></div>
                            <div style={{fontSize:'14px', color:"#434343", margin:'15px'}}>Link: <a href={URI} target='blank'>{URI}...</a></div>
                        </Card>
                    
                        <Card style={{margin:'24px', background:"#d9e3f0"}}>
                            <h2 style={{color:"#455A64"}}>Token Owner</h2>
                            <AddressInput
                                ensProvider={mainnetProvider} 
                                placeholder="Enter Property Location"
                                value={location}
                                onChange={(newVal)=>{
                                    newLocation(newVal)
                                }}
                            />
                            <Button onClick={ async ()=>{
                                newLocation(location)
                                console.log("Product ID to lookup: ",location)
                                const tokenID = await readContracts.ClaimToken.claimIdByLocation(location)
                                setTokenID(parseInt(tokenID))
                                const owner = await readContracts.ClaimToken.ownerOf(tokenID)
                                setNewOwnerProp(owner)
                                }}
                                type="primary"
                                style={{ background: "#1890ff", borderColor: "#91d5ff", margin:'15px'}}
                            >
                            Search
                            </Button>
                            <div >
                                <Address
                                address={newOwnerProp}
                                ensProvider={mainnetProvider}
                                blockExplorer={blockExplorer}
                                fontSize={fontSize}/>
                            </div>
                            <div style={{fontSize:'18px', color:"#434343"}}>
                                TokenID: <Text copyable={{ text: tokenID }} style={{fontSize:'20px', color:"#1890ff"}}>{tokenID}</Text>
                            </div>
                        </Card>
                    
                        <Card style={{margin:'24px', background:"#d9e3f0"}}>
                            <h2 style={{color:"#455A64"}}>Token Balance </h2>
                            <AddressInput
                                ensProvider={mainnetProvider} 
                                placeholder="Enter Wallet Address"
                                value={lookupAddress}
                                onChange={(newVal)=>{
                                    newLookupAddress(newVal)
                                }}
                            />
                            <Button onClick={ async ()=>{
                                newLookupAddress(lookupAddress)
                                console.log("Address to lookup: ",lookupAddress)
                                const addressBal = await readContracts.ClaimToken.balanceOf(lookupAddress)
                                newAddressBalance(parseInt(addressBal))
                                console.log(addressBalance)
                                }}
                                type="primary"
                                style={{ background: "#1890ff", borderColor: "#91d5ff", margin:'15px'}}
                            >
                            Search
                            </Button>
                            <div style={{fontSize:'18px', color:"#434343"}}>
                            Balance: <Text style={{fontSize:'20px', color:"#434343"}}>{addressBalance}</Text>
                            </div>
                        </Card>
                    
                </Row >
            </div >

            <Divider></Divider>
            <Row justify='center'>
            <Col span={21}>
            <div className="your-claims-header">
                <Space >All Claims{""}</Space><Space><Switch defaultChecked onChange={onChange}/>{""}</Space>Your Claims
                <h1 >{" "}</h1>
                    <List
                        bordered
                        grid ={{gutter:"12px", column:4}}
                        size="large"
                        dataSource={newDataSource}
                        renderItem={(item) =>  {
                            const id = item.id.toNumber()
                            return (
                                <List.Item key={id+"_"+item.propertiesHash+"_"+item.address}>
                                    <Card style={{background:"#8ED1FC"}}>
                                        <div style={{fontWeight:"bold"}}>{' '}{item[1]}</div>
                                        <div style={{fontWeight:"light"}}>Token: {parseInt(item[0])}</div>
                                        <div >  
                                        <a href={"https://ipfs.io/ipfs/"+item.propertiesHash} target="blank"><Button type="primary" style={{background:"#0693e3",borderColor: "#bae7ff"}}>Claim</Button> </a>
                                        </div>
                                        <Divider ></Divider>
                                        <AddressInput
                                        ensProvider={mainnetProvider}
                                        placeholder="transfer to address"
                                        value={transferToAddress[id]}
                                        autofocus
                                        onChange={(newValue)=>{
                                            let update = {}
                                            update[id] = newValue
                                            setTransferToAddress({ ...transferToAddress, ...update})
                                        }}
                                        />
                                        <Button onClick={()=>{
                                        console.log(address)
                                        console.log(transferToAddress[id])
                                        console.log(parseInt(item[0]))
                                        tx( writeContracts.AdaptiveTokenVendor.claimTransferSetAllowance(address, transferToAddress[id], parseInt(item[0])))
                                        }}
                                        type="primary"
                                        style={{ background: "#ff7875", borderColor: "#bae7ff" }}>
                                        Transfer Claim
                                        </Button>
                                    </Card>
                                </List.Item>
                            )
                        }}
                    />
                </div>
                </Col>
                </Row>
        </div>
    );

}