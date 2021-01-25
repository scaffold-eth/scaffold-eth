/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Card, Row, Col } from "antd";
import { Address, EtherInput } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";

export default function StakingApp({threshold, isActive, timeLeft, withdrawEvents, depositEvents,  mainnetProvider, price, tx, readContracts, writeContracts }) {

  const [ depositAmount, setDepositAmount ] = useState("0");
  return (
    <div>
        <Row justify="center" style={{ margin: "auto", width: "70vw" }} >
            <Col span={8}>
                <Card
                    title={
                        <h2>Threshold amount</h2>   
                    }
                    size="small"
                    style={{ marginTop: 25, width: "100%" }}
                >
                    {threshold && formatEther(threshold)} ETH
                </Card>
            </Col>

            <Col span={8}>
                <Card
                    title={
                        <h2>Time left</h2>  
                    }
                    size="small"
                    style={{ marginTop: 25, width: "100%" }}
                >
                    {timeLeft && timeLeft.toNumber()} seconds
                </Card>
            </Col>

            <Col span={8}>
                <Card
                    title={
                        <h2>Is contract "active"?</h2>  
                    }
                    size="small"
                    style={{ marginTop: 25, width: "100%" }}
                >
                    {isActive ? "ACTIVE" : "NOT ACTIVE"}
                </Card>
              </Col>
        </Row>

        <div style={{ margin: "auto", width: "70vw" }}>
          
            <Card
                title={
                    <h2>Deposit funds</h2>
                }
                size="small"
                style={{ marginTop: 25, width: "100%" }}
            >
                <Row justify="center">

                    <div width="20%">
                        <EtherInput
                            autofocus
                            price={price}
                            //value={100}
                            placeholder="Enter amount..."
                            onChange={value => {
                            setDepositAmount(value.toString());
                            }}
                        />
                    </div>

                    <Button onClick={()=>{
                            tx( writeContracts.YourContract.deposit({
                            value: parseEther(depositAmount)
                            })) 
                        }} style={{marginLeft:25}}>Deposit
                    </Button>
                </Row>
            </Card>

            <Card
                title={
                    <h2>Withdraw funds</h2>  
                }
                size="small"
                style={{ marginTop: 25, width: "100%" }}
            >
                <Row justify="center">
                    <Button onClick={()=>{
                            tx( writeContracts.YourContract.withdraw())
                        }}>Withdraw
                    </Button>
                </Row>

            </Card>
        </div>

        <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
            <h2>Deposit Events:</h2>
            <List
            bordered
            dataSource={depositEvents}
            renderItem={(item) => {
                return (
                <List.Item>
                    <Address
                        value={item.sender}
                        ensProvider={mainnetProvider}
                        fontSize={16}
                    /> =>
                    {formatEther(item.amount)}
                </List.Item>
                )
            }}
            />
        </div>

        <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
            <h2>Withdraw Events:</h2>
            <List
            bordered
            dataSource={withdrawEvents}
            renderItem={(item) => {
                return (
                <List.Item>
                    <Address
                        value={item.sender}
                        ensProvider={mainnetProvider}
                        fontSize={16}
                    /> =>
                    {formatEther(item.amount)}
                </List.Item>
                )
            }}
            />
        </div>
    </div>
  );
}
