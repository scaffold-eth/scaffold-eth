/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Badge, Row, Col, Image, Carousel } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useHistory } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";


const { Text, Title } = Typography

const ARTWORKS_QUERY = gql`
  query ($firstArtists: Int!, $firstArtworks: Int!) {
    featuredArtworks: artworks(first: $firstArtworks, orderBy: createdAt, orderDirection: desc) {
      id
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

    # list featured artists
    featuredArtists: artists(first: $firstArtists) {
      id
      address
      artworks(first: 4, orderBy: createdAt, orderDirection: desc) {
        id
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

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

const renderArtworkListing = (artwork, history) => {
  const isForSale = artwork.revoked || (artwork.artist.address ===  artwork.owner)

  let content = (
      <Card hoverable onClick={()=>history.push(`/artworks/${artwork.tokenId}/${string_to_slug(artwork.name)}`)}
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
  )
    
  if(isForSale || artwork.revoked)
    content = (
      <Badge.Ribbon color={artwork.revoked ? "gold" : "cyan"} text={artwork.revoked ? "Revoked!" : "on sale!"}>
        {content}
      </Badge.Ribbon>
    )

  return (
    <List.Item>
      {content}
    </List.Item>
  )
}

const Subgraph = (props) => {
  const variables = {
    firstArtists: 3,
    firstArtworks: 60
  }

  const history = useHistory()
  const { loading, data } = useQuery(ARTWORKS_QUERY, {variables},{pollInterval: 5000});

  const featuredArtists = (
    <Skeleton loading={loading} active>
      <Carousel>
        {data && data.featuredArtists.map(artist => 
          <List grid={grid} dataSource={artist.artworks} renderItem={artwork => renderArtworkListing(artwork, history)} />
        )}
      </Carousel>
    </Skeleton>
  )

  const featuredArtworks = (
    <Skeleton loading={loading} active>
      <List grid={grid} dataSource={data && data.featuredArtworks} renderItem={artwork => renderArtworkListing(artwork, history)} />
    </Skeleton>
  )
  
  return (
    <Row direction="vertical">
      <Col span={12} offset={6}>
        <br/>
        <Title level={3}>Featured artists</Title>
        <br/>
        {featuredArtists}

        <Divider plain />
        
        <br/>
        <Title level={3}>Featured artworks</Title>
        <br/>
        
        {featuredArtworks}
    </Col>
    </Row>
  )
}

export default Subgraph;
