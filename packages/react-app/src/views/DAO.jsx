import { Button, Card,  List, Row, Col, Descriptions, Input, Tag } from "antd";
import React, { useState } from "react";
import { Address, AddressInput, Balance, EtherInput } from "../components";
import { ethers } from "ethers";


export default function DAO({ contractAddress, price, readContracts, writeContracts, mainnetProvider, localProvider, processedDataSet, getContractAddress, tx}) {
  
    const [ toAddress, setToAddress ] = useState();
    const [ toAddKickAddress, setToAddKickAddress ] = useState();
    const [ memberInfo, setMemberInfo ] = useState();
    const [ memberReason, setMemberReason ] = useState();
    const [ showMemberInfo, setShowMemberInfo ] = useState("none");

    const [ processProposalId, setProcessProposalId ] = useState();
    const [ proposalSubmitDetails, setProposalSubmitDetails ] = useState();
    const [ amount, setAmount ] = useState();
    
    async function voteYes(proposalId) {
        const result = await tx(writeContracts.PowDAO.submitVote(proposalId, 1));
        console.log(result)
    }

    async function voteNo(proposalId) {
        const result = await tx(writeContracts.PowDAO.submitVote(proposalId, 2));
        console.log(result)
    }

    return (
        <div style={{margin:"0px", margin:"6px"}}>
            
            <Row justify="center">
                <Col span={6} style={{margin:"24px"}}>
                    <Card bordered title="Members"> 
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddress}
                            onChange={setToAddress}
                        />
                        <Button onClick={ async ()=>{
                            console.log(toAddress)
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
                <Col span={6} style={{margin:"24px"}}>
                    <Card bordered title="Add/Kick Members">
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddKickAddress}
                            onChange={setToAddKickAddress}
                        />
                        <div style={{margin:"8px"}}>
                        <Input 
                        onChange={ (e) =>{
                            setMemberReason(e.target.value)
                        }}
                        placeholder="Enter details."
                        />
                        </div>
                        <Button onClick={ async ()=>{
                            const result = await tx (writeContracts.PowDAO.addMember(toAddKickAddress, memberReason));
                            console.log(result)
                        }}>
                            Add
                        </Button>
                        <Button onClick={ async ()=>{
                            const result = await tx (writeContracts.PowDAO.kickMember(toAddKickAddress, memberReason));
                            console.log(result)
                        }}>
                            Kick
                        </Button>
                    </Card >
                </Col>
            </Row>
            
            <Row justify="center" style={{margin:"24px"}}>
                <Col span={16}>
                    <Card title="Vote on Proposals"> 
                        <List
                        dataSource={processedDataSet} // Only setting this data on proposal submit, never updated when proposal is processed.
                        renderItem={item => {
                            return (
                                <List.Item key={item.args["proposalId"]} actions={[
                                    <Button onClick={()=>{voteYes(parseInt(item.args["proposalId"]))}}>
                                        Yes
                                    </Button>,
                                    <Button onClick={()=>{voteNo(parseInt(item.args["proposalId"]))}}>
                                        No
                                    </Button>
                                ]}>
                                    <Address address={item.args[4]} ensProvider={mainnetProvider} fontSize={18}/>
                                    <div style={{margin:"8px"}}>
                                        {item.args["details"]}
                                    </div>
                                    <div style={{margin:"8px"}}>
                                        {parseInt(item.args["paymentRequested"])/10**18} Ξ
                                    </div>
                                    <div style={{margin:"8px"}}>
                                        {item.args['flags'][4] || item.args['flags'][5] ? 
                                            item.args['flags'][4]? <Tag color="cyan">Member Add</Tag> : <Tag color="red">Member Kick</Tag>
                                            : 
                                            <Tag color="orange">Work</Tag>}
                                    </div>
                                </List.Item>
                            );
                        }}
                        />
                    </Card >
                </Col>
            </Row>

            <Row justify="center" style={{margin:"24px"}}>
                <Col span={10}>
                    <Card title="Create Proposal/Request">
                        <Input 
                        style={{width:"500px"}}
                        onChange={(e)=>{
                            setProposalSubmitDetails(e.target.value)
                        }}
                        placeholder="Enter proposal details."
                        />
                        <div >
                        <EtherInput
                        price={price}
                        value={amount}
                        placeholder="Enter amount"
                        onChange={value => {
                        setAmount(value);
                        }}
                        />
                        </div>
                        
                        <Button onClick={ async ()=>{
                            const value = ethers.utils.parseEther("" + amount);
                            const result = await tx( writeContracts.PowDAO.submitProposal(value, proposalSubmitDetails) )
                        }}>
                        Submit Proposal
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Row justify="center" style={{margin:"32px"}}>
                <Col span={4}>
                    <Card title="Process Proposal">
                        <Input 
                        style={{width:"100px"}}
                        onChange={(e)=>{
                            setProcessProposalId(e.target.value)
                        }}/>
                        <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAO.processProposal(processProposalId))
                        }}>
                        Process
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Row justify="center">
                To deposit to the DAO, send funds to the smart contract! 🔒
            </Row>
            <Row justify="center">
                Etherscan: <a href="https://etherscan.io/address/0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6" target="blank"> 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6</a>
            </Row>

        </div>
    );
}
