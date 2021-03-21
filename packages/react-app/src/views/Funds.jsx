/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Switch, Typography, List, Card, Skeleton, Divider, Badge, Row, Col, Image, Carousel, Button } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useHistory } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";


const { Text, Title } = Typography

const ARTWORKS_QUERY = gql`
  query {
    beneficiaries(first: 10) {
      name
      artworks(first: 4) {
        name
        price
        tokenId
        owner
        revoked
        artworkImageUrl
        beneficiary {
          name
        }
        artist {
          id
          address
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
        <Text strong>{artwork.name}</Text> <Text type="secondary">supports {artwork.beneficiary.name}</Text>
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
    firstArtists: 3,
    firstArtworks: 8,
    offsetArtworks: 0
  }

  const history = useHistory()
  const { loading, data } = useQuery(ARTWORKS_QUERY, { variables }, { pollInterval: 2500 });

  return (
    <Row direction="vertical">
      <Col span={16} offset={6}>
        <br />
        <Row>
          <Title level={3}>🤝 Funds & orgs supported by Good Tokens</Title>
        </Row>
        <br />
        
        {
          data && data.beneficiaries.map(fund => (
            <Row>
              <Col flex="1">
              <Row>
                <Title level={3}>{fund.name}</Title>
              </Row>
              <Row>
                <Title level={5} type="secondary">Supporting artworks:</Title>
              </Row>
              </Col>
              <List grid={grid} dataSource={fund.artworks} renderItem={artwork => renderArtworkListing(artwork, history)} loading={loading} />
              <Divider/>
            </Row>
          ))
        }
      </Col>
    </Row>
  )
}

export default Subgraph;
