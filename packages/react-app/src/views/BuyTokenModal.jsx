/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Modal, Typography, Card, Skeleton, Row, Col, Image, Spin, Button, Table, Tag, Tooltip } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { Link, useHistory, useParams } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";
import Avatar from "antd/lib/avatar/avatar";
import { ethers }  from 'ethers';

const { Text, Title } = Typography

const BuyTokenModal = (props) => {

    const [tryPurchase, setTryPurchase] = useState(false);


    const buyTokens = async (numTokens, fundId) => {
        setTryPurchase(true);
        try{
            const tokensPerEth = 100;
            const amount = ethers.constants.WeiPerEther.mul(numTokens).div(tokensPerEth);
            const tx = await props.writeContracts.GoodTokenFund.mintFeedToken(fundId, {value: amount});
            await tx.wait();
            setTryPurchase(false);
            props.handleClose();
        } catch (e) {
            console.log(e);
            setTryPurchase(false);
        }
    }

    const tokenAmounts = [
        {
            amount: 1,
            emoji: '🙂'
        },
        {
            amount: 2,
            emoji: '😁'
        },
        {
            amount: 5,
            emoji: '🥳'
        },
        {
            amount: 10,
            emoji: '😎'
        },
        {
            amount: 20,
            emoji: '😇'
        }
    ];

    const buyButtons = tokenAmounts.map(tok => {
        return (
            <Button 
                type="primary"
                key={tok.amount}
                onClick={() => buyTokens(tok.amount, props.fund.symbol)}
                style={{margin: '0.5rem'}}
            >
                {tok.amount} {props.fund.symbol}&nbsp;&nbsp;{tok.emoji}
            </Button>
        )
    })

    return (
        <Modal
            title={`Purchase ${props.fund.name} (${props.fund.symbol}) Tokens`}
            visible={props.visible}
            confirmLoading={tryPurchase}
            onCancel={props.handleClose}
            width={650}
            footer={[
                <Button key="back" onClick={props.handleClose}>
                  Cancel
                </Button>
            ]}
        >
            <p>Please select the number of tokens you would like to purchase! Thank you so much for supporting the {props.fund.name}!</p>
            {buyButtons}
        </Modal>

    );
}

export default BuyTokenModal;