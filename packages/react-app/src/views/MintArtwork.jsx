/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Space, Row, Col, Button, Input } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import ipfsApi from "../helpers/ipfsGraph";
import { THEGRAPH } from "../constants";
import { ethers } from "ethers";


const { Text, Title } = Typography

let metadata = {
    "description": "Good Token IPFS test.", 
    "external_url": "https://openseacreatures.io/3", 
    "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
    "name": "Good Token #0",
    "date": Date.now()
  };

async function pinAndAnchor(tx, writeContracts) {
    const theGraphNode = THEGRAPH['localhost'].ipfsUri;
    const ipfs = ipfsApi(theGraphNode);
    const { cid } = await ipfs.addJson(metadata);

    // create test artwork
    const testPrice = ethers.constants.WeiPerEther;
    const minBalance = ethers.constants.WeiPerEther;
   

    tx(writeContracts.GoodToken.createArtwork(
        theGraphNode + 'cat?arg=' + cid, 
        theGraphNode + 'cat?arg=' + cid,
        0, // static ownership
        ethers.constants.AddressZero,
        minBalance,
        0,
        testPrice
    ));



}

const MintArtwork = ( {tx, writeContracts} ) => {
  


  return (
    <Space direction="vertical">
      <Button
        onClick={() => pinAndAnchor(tx, writeContracts)}
      >Pin and Anchor Me!</Button>
    </Space>
  )
}

export default MintArtwork;
