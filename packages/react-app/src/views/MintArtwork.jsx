/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, 
  Skeleton, Divider, Space, Row, Col, 
  Button, Input, InputNumber, Radio, Form, } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
//import { ipfsApi } from "../helpers/ipfsGraph";
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

async function pinAndAnchor(
  tx, 
  writeContracts,
  address,
  artistName,
  artworkTitle,
  artworkDescription,
  artworkUrl,
  revokedUrl,
  beneficiaryContractAddress,
  beneficiaryType,
  requiredBalance,
  priceIncreaseDuration,
  priceInEth
) {

    const priceInWei = ethers.utils.parseEther(priceInEth.toString());
    console.log(priceInWei.toString());
    // 1. Pin imgs to ipfs -- NO LONGER DOING THIS< JUST URL
    // 2. Create JSON metadata using cid of pinned imgs
    const artworkMetadata = {
      artist: address,
      "artistName": artistName,
      name: artworkTitle,
      description: artworkDescription,
      image: artworkUrl,
      date: Date.now(),
      price: priceInWei.toString(),
    };

    console.log(artworkMetadata);

    // Pin artwork metadata 
    const theGraphNode = THEGRAPH.localhost.ipfsUri;
    //const ipfs = ipfsApi(theGraphNode);
    //const artworkInfo = await ipfs.addJson(artworkMetadata);

    // Pin revoked artwork metadata
    const revokedArtworkMetadata = artworkMetadata;
    revokedArtworkMetadata.image = revokedUrl;
    //const revokedInfo = await ipfs.addJson(revokedArtworkMetadata);
    
    console.log(revokedArtworkMetadata);

    // 3. Tx to contract to mint new artwork
    // create test artwork
    try{
      await tx(writeContracts.GoodToken.createArtwork(
          "artworkInfo.path", 
          "revokedInfo.path",
          beneficiaryType,
          beneficiaryContractAddress,
          requiredBalance,
          priceIncreaseDuration,
          priceInWei
      ));
    } catch (e) {
      console.log(e);
    }



}

const MintArtwork = ( {tx, writeContracts, address} ) => {

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6, align: 'left' },
  };

  const tailLayout = {
    wrapperCol: { offset: 0 },
  };

  const onFinish = (values) => {
    console.log(values);
    pinAndAnchor(tx, writeContracts, address,
      values.artist,
      values.artworkTitle,
      values.artworkDescription,
      values.artworkUrl,
      values.revokedArtworkUrl,
      values.benificiary,
      Number(values.beneficiaryType),
      Number(values.requiredBalance),
      Number(values.priceIncreaseDuration),
      Number(values.price)
    );
  }

  return (
    <>
    <br />
      <Form
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Title level={3}>Mint a new artwork with Good Token</Title>
        <br/>

        <Form.Item name="artist" label="Artist Name" value="Good Artist" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="artworkTitle" label="Artwork Title" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="artworkDescription" label="Artwork Description">
          <Input/>
        </Form.Item>
        <Form.Item name="artworkUrl" label="Artwork Image Url" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="revokedArtworkUrl" label="Revoked Image Url">
          <Input/>
        </Form.Item>
        <Form.Item name="benificiary" label="Beneficiary Contract" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item  name="beneficiaryType" label="Beneficiary Type" rules={[{ required: true }]}>
          <Radio.Group value='horizontal'>
            <Radio.Button value="0">⚖️ Minimum Balance</Radio.Button>
            <Radio.Button value="1">📊 Dynamic Balance</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="requiredBalance" label="Required Balance" rules={[{ required: true }]}>
          <InputNumber/>
        </Form.Item>
        <Form.Item name="priceIncreaseDuration" label="Dynamic Time Inc">
          <InputNumber/>
        </Form.Item>
        <Form.Item name="price" label="Price in ETH" rules={[{ required: true }]}>
          <InputNumber
            stringMode />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <br/> <br/>
          <Button size="large" type="primary" htmlType="submit">
          🤝 Mint Artwork! 🤝
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default MintArtwork;
