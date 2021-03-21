/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Space, Row, Col, Image, Carousel } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useParams } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";
import Paragraph from "antd/lib/skeleton/Paragraph";



const { Text, Title } = Typography

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName : 'short' };



const ARTWORK_QUERY = gql`
  query ($artwork: String!) {
    artwork(id: $artwork) {
      id
      createdAt
      tokenId
      price
      revoked
      name
      desc
      artworkImageUrl
      artworkRevokedImageUrl
      
      artist {
        address
      }
      
      beneficiary {
        name
      }
    }
  }
`

const grid = {
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 6,
  xxl: 4,
}

const Subgraph = (props) => {
  return (
    <Row>
      <Col span={12} offset={6}>
        <br/><br/>
        
        <Row style={{textAlign: 'left'}} justify="center">
          <Col flex="1">
            <Title style={{'text-align': 'center'}} level={1}>🤝 About Good Tokens 🤝</Title>
          </Col>
        </Row>
        <br/>

        <Row>
          <Title level={2}>💡 Concept & Project Scope</Title>
          <br/>
          <Text style={{'text-align': 'left'}}>Good Tokens rethinks the responsibilities of owning art. Is it enough to simply purchase an artwork and then own it forever, or should ownership be earned and maintained by supporting causes linked to the art or by participating in communities linked to the artist. This way, artworks can be more sustainable and the artist is assured their art aligns with their values.</Text>
                <br/><br/>
        </Row>

        <Row>
          <Title level={2}>🤝 Good Tokens</Title>
          <Text style={{'text-align': 'left'}}>Good Tokens rethink the responsibilities of owning art. Is it enough to simply purchase an artwork and then own it forever, or should ownership be earned and maintained by supporting causes linked to the art or by participating in communities linked to the artist. This way, artworks can be more sustainable and the artist is assured their art aligns with their values.</Text>
          <br/><br/>
        </Row>

        <Row>
          <Title level={2}>👨‍💻 Technical Challenges</Title>
          <Text style={{'text-align': 'left'}}>We are using TheGraph and ipfs to minimize onchain storage and interaction, pulling data from emitted events as well as metadata stored in ipfs.<br/>Our base ERC721 inherits from OpenZeppelin's widely used NFT contracts.<br/>Our conditional ownership standard allows you to create tokens that point to a fund contract where you can specify amount thresholds that owners must maintain in order to keep possession of their artworks. This means that you can point to any ERC-20 token, such as a charity or a liquidity pool or a governance token, and require the owner to maintain a minimum or growing balance over time to ensure they are an active member of a community or are directly engaged in a platform the artist cares about. This same method also works for POAPs, where you can require the owner to have at least 1 new POAP token a month, for example, to retain ownership. The protocol is very flexible and has tons of exciting use cases.</Text>
          <br/><br/>
        </Row>

        <Row>
          <Title level={2}>🤯 Cool discoveries</Title>
          <Text style={{'text-align': 'left'}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur aliquid at natus illo eos quas esse, ea officia modi saepe placeat aut incidunt quam provident debitis voluptates porro dolor voluptate!</Text>
          <br/><br/>
        </Row>
  
      </Col>
    </Row>
  )
}

export default Subgraph;
