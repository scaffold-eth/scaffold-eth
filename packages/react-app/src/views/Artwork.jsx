/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Space, Row, Col, Image, Carousel } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useParams } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";



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

const renderArtworkListing = artwork => (
  <List.Item>
    <Card hoverable
      title={
        <Row justify="space-between">
        <Col>
          <Blockies seed={artwork.artist.address} scale={2} />
          <Text type="secondary"> 0x{artwork.artist.address.substr(-4).toUpperCase()}</Text>
        </Col>
        <Col><Text>{formatEther(artwork.price)} ☰</Text></Col>
      </Row>
      }
      cover={<Image src={artwork.artworkImageUrl} />}
    >
      <Row justify="start">
        <Text strong>{artwork.name}</Text> <Text type="secondary">support {artwork.beneficiary.name}</Text> 
      </Row>
    </Card>
  </List.Item>
)

const Subgraph = (props) => {
  const { artwork } = useParams()

  const variables = { artwork }

  const { loading, data } = useQuery(ARTWORK_QUERY, {variables},{pollInterval: 5000});

  console.log(data)

  // const featuredArtists = (
  //   <Skeleton loading={loading} active>
  //     <Carousel>
  //       {data && data.featuredArtists.map(artist => 
  //         <List grid={grid} dataSource={artist.artworks} renderItem={renderArtworkListing} />
  //       )}
  //     </Carousel>
  //   </Skeleton>
  // )

  // const featuredArtworks = (
  //   <Skeleton loading={loading} active>
  //     <List grid={grid} dataSource={data && data.featuredArtworks} renderItem={renderArtworkListing} />
  //   </Skeleton>
  // )
  
  if(loading)
    return (
      <Col span={12} offset={6}>
        <br/><br/>
        <Skeleton active />
      </Col>
    )

  return (
    <Row direction="vertical" style={{textAlign: 'left'}}>
      <Col span={12} offset={6}>
        <br/><br/>
        <Row>
          <Col span={10}>
            <Card >
              <Image src={data.artwork.artworkImageUrl} />
              </Card>
              <Row>
              <Col flex="1">
                <br/>
                <Card title="Artwork details">
                  <Row justify="space-between">
                    <Text type="secondary">Created by</Text>
                    <span><span><Blockies seed={data.artwork.artist.address} scale={2} /></span> 0x{data.artwork.artist.address.substr(-4).toUpperCase()}</span>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Published on</Text>
                    <Text type="secondary">{(new Date(+data.artwork.createdAt * 1000)).toDateString()}</Text>
                  </Row>
                  <br/>
                  <Row>
                    {data.artwork.desc}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={13} offset={1}>
            <br/>
            <Row>
                <div style={{marginTop:5}}><Blockies seed={data.artwork.artist.address} scale={3} /></div>
                <Title level={3} type="secondary"> &nbsp; 0x{data.artwork.artist.address.substr(-4).toUpperCase()}</Title>
            </Row>
            <Row>
              <Title level={2}> {data.artwork.name}</Title>
            </Row>
            <Row>
                <div style={{marginTop:2}}><Blockies seed={data.artwork.artist.address} scale={2} /></div>
                <Text type="secondary"> &nbsp; Owned by 0x{data.artwork.artist.address.substr(-4).toUpperCase()}</Text>
            </Row>
            <Row>
              <Col flex="1">
                <br/>
                <Card title="FOR SALEEEEE">
                </Card>
              </Col>
            </Row>
            <Row>
              <Col flex="1">
                <br/>
                <Card title="The good stuff">
                  This artwork supports {data.artwork.beneficiary.name} through the dynamic contribution model of the Good Token protocol.
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col flex="1">
            <br/>
            <Card title="Ownership history">

            </Card>
          </Col>
        </Row>
        {/* <br/>
        <Title level={3}>Featured artists</Title>
        <br/>
        {featuredArtists}

        <Divider plain />
        
        <br/>
        <Title level={3}>Featured artworks</Title>
        <br/>
        
        {featuredArtworks} */}
    </Col>
    </Row>
  )
}

export default Subgraph;
