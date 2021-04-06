/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Badge, Row, Col, Image, Button } from "antd"
import { useQuery, gql } from '@apollo/client'
import Blockies from 'react-blockies'
import { useHistory } from 'react-router-dom'
import { formatEther } from "@ethersproject/units"
import Artwork from "../components/Artwork";


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

const renderArtworkListing = (artwork) => (
  <List.Item key={artwork.id}>
    <Artwork artwork={artwork} />
  </List.Item>
)

const Subgraph = (props) => {
  const variables = {
    artworkFilter: {
      owner: props.address.toLowerCase()
    }
  }


  const history = useHistory()
  const { loading, data, refetch } = useQuery(ARTWORKS_QUERY, { variables }, { pollInterval: 2500 });

  const ownedArtworks = (
    <Skeleton loading={!data} active>
      <List grid={grid} dataSource={data && data.myArtworks} renderItem={renderArtworkListing} loading={loading} />
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
