/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Badge, Row, Col, Image, Button } from "antd"
import { useQuery, gql } from '@apollo/client'
import Blockies from 'react-blockies'
import { useHistory } from 'react-router-dom'
import { formatEther } from "@ethersproject/units"


const { Text, Title } = Typography

const ARTWORKS_QUERY = gql`
  query ($artworkFilter: Artwork_filter) {
    myArtworks: artworks(first: $firstArtworks, offset: $offsetArtworks, orderBy: createdAt, orderDirection: desc, where: $artworkFilter) {
      id
      tokenId
      price
      revoked
      name
      owner
      desc
      artworkImageUrl
      artworkRevokedImageUrl
      
      artist {
        address
        name
      }
      
      fund {
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

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

const renderArtworkListing = (artwork, history) => {
  const isForSale = artwork.revoked || (artwork.artist.address == artwork.owner)

  let content = (
    <Card hoverable onClick={() => history.push(`/artworks/${artwork.tokenId}/${string_to_slug(artwork.name)}`)}
      title={
        <Row justify="space-between">
          <Col>
            <Blockies seed={artwork.artist.address} scale={2} />
            <Text type="secondary"> &nbsp; {artwork.artist.name}</Text>
          </Col>
          <Col><Text>{formatEther(artwork.price)} ☰</Text></Col>
        </Row>
      }
      cover={<Image src={artwork.artworkImageUrl} />}
    >
      <Row justify="start">
        <Text strong>{artwork.name}</Text> <Text type="secondary">supports {artwork.fund.name}</Text>
      </Row>
    </Card>
  )

  if (isForSale)
    content = (
      <Badge.Ribbon color={artwork.revoked ? "gold" : "cyan"} text={artwork.revoked ? "Revoked!" : "on sale!"}>
        {content}
      </Badge.Ribbon>
    )

  return (
    <List.Item key={artwork.id}>
      {content}
    </List.Item>
  )
}

const Subgraph = (props) => {
  const variables = {
    artworkFilter: {
      owner: props.address.toLowerCase()
    }
  }


  const history = useHistory()
  const { loading, data, refetch } = useQuery(ARTWORKS_QUERY, { variables }, { pollInterval: 2500 });

  // const loadMore = (<Button disabled={loading} onClick={()=> refetch(Object.assign(variables, { firstArtworks: data.myArtworks.length + 8 })) }>load more artworks</Button>)

  const ownedArtworks = (
    <Skeleton loading={!data} active>
      <List grid={grid} dataSource={data && data.myArtworks} renderItem={artwork => renderArtworkListing(artwork, history)} loading={loading} />
    </Skeleton>
  )

  return (
    <Row direction="vertical">
      <Col span={12} offset={6}>
        <br />
        <Row>
          <Title level={3}>🤝 Your artworks</Title>
        </Row>
        <br />
        {ownedArtworks}
      </Col>
    </Row>
  )
}

export default Subgraph;
