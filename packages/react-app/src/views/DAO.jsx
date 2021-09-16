import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useState } from "react";
import { Address, AddressInput, Balance, DAOMembers, DAOPayout, DAOProposals } from "../components";

export default function DAO({ address, readContracts, writeContracts, mainnetProvider, submitProposalEvents}) {
  
    const [ toAddress, setToAddress ] = useState();
    const [ memberInfo, setMemberInfo ] = useState();
    const [ showMemberInfo, setShowMemberInfo ] = useState("none");
    return (
        <div style={{margin:"30px"}}>
            <Row justify="center">
                <Col span={8}>
                    <Card bordered title="Members"> 
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddress}
                            onChange={setToAddress}
                        />
                        <Button onClick={ async ()=>{
                            const result = await readContracts.PowDAO.members(toAddress);
                            setMemberInfo(parseInt(result[0]))
                            console.log(parseInt(result[0]))
                            setShowMemberInfo("block")
                        }}>
                            Search
                        </Button>
                        <div style={{fontSize:"16px", margin:"12px", display:showMemberInfo}} >
                        {memberInfo == 1 ? toAddress+" is apart of the PowDAO 👍" : "This address is NOT apart of the PowDAO"}
                        </div>
                    </Card >
                </Col>
            </Row>

            <Row justify="center" style={{margin:"30px"}}>
                <Col span={8}>
                    <Card bordered title="Add/Kick Members"> 
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddress}
                            onChange={setToAddress}
                        />
                        <Button onClick={ async ()=>{
                            const result = await writeContracts.PowDAO.memberKick(addressEntity);
                            console.log(result)
                        }}>
                            Add
                        </Button>
                        <Button onClick={ async ()=>{
                            const result = await readContracts.PowDAO.memberAdd(addressEntity);
                            console.log(result)
                        }}>
                            Kick
                        </Button>
                    </Card >
                </Col>
            </Row>

            <Row justify="center" style={{margin:"30px"}}>
                <Col span={16}>
                    <Card bordered title="Vote on Proposals"> 
                    <List
                    bordered
                    dataSource={submitProposalEvents} // Only setting this data on proposal submit, never updated when proposal is processed.
                    renderItem={item => {
                        console.log(item)
                        if(item.args["flags"][1]==false) {
                            return (
                                <List.Item key={item.args["memberAddress"] + "_" + item.args["details"]}>
                                    <Address address={item.args[4]} ensProvider={mainnetProvider} fontSize={16} />
                                    <div >
                                    {item.args["details"]}
                                    </div>
                                </List.Item>
                                );
                        }
                    }}
                    />
                    </Card >
                </Col>
            </Row>
            
            <DAOMembers />
            <DAOProposals />
            <DAOPayout />

        </div>
    );
}
