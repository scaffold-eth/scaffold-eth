/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Switch, Typography, List, Card, Skeleton, Divider, Badge, Row, Col, Image, Carousel, Button, Tag, Slider } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useHistory } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";
import Avatar from "antd/lib/avatar/avatar";

function mapPrice(val, valMin, valMax, rangeMin, rangeMax) {
  const clamped = (Math.min(valMax, Math.max(val, valMin)))
  const normalized = ((clamped - valMin) / (valMax - valMin)) || 0
  return rangeMin + (rangeMax - rangeMin) * normalized
}

const { Text, Title } = Typography

const ARTWORKS_QUERY = gql`
  query {
    funds {
      id
      name
      rangeMin
      rangeMax
      tokenId
      image
      description
      
      feed {
        id
        name
        description
        yearOffset
        value
      }
      
      artworks(first: 4) {
        id
        name
        tokenId
        price
        artworkImageUrl
        artist {
          name
          id
        }
        fund {
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
        <Text strong>{artwork.name}</Text> <Text type="secondary">🤝 {artwork.fund.name}</Text>
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
    // firstArtists: 3,
    // firstArtworks: 8,
    // offsetArtworks: 0
  }

  const history = useHistory()
  const { loading, data } = useQuery(ARTWORKS_QUERY, {  }, { pollInterval: 2500 });

  return (
    <Row direction="vertical">
      <Col span={12} offset={6}>
        <br />
        <Row>
          <Title level={3}>🤝 Funds & orgs supported by Good Tokens</Title>
        </Row>
        <br />
        
        {
          data && data.funds.map(fund => (
            <Row>
              <Row>
                <Col span={11}>
              <Row>
                <Avatar style={{marginTop:1, border:2, marginRight: 10, background: '#EEE'}} shape="square" size="default" src={fund.image} />
                <Title level={3}>{fund.name}</Title>
              </Row>
              <Row>
                  <Row>

                  <div style={{textAlign: "left"}}>
                    <Text type="secondary">{fund.description}<br/><br/></Text>
                  </div>
                  </Row>
                  <Row>
                    <Button type="primary">Buy {fund.name} token</Button>
                  </Row>
              </Row>
                </Col>
                <Col span={12} offset={1}>
                  <Card style={{textAlign:'left'}} size="small" title={
                    <Row justify="space-between">
                      <Text>{fund.feed.name}</Text>
                      <Tag>{fund.feed.id}</Tag>

                    </Row>
                  }>
                    <Row>
                      <Text type='secondary'>{fund.feed.description}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text type="secondary">Currently tracked period</Text>
                      <Text>{(new Date()).getFullYear() - parseInt(fund.feed.yearOffset, 10)}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text type="secondary">Token price</Text>
                    <Text>1 Good Token ⇔ {mapPrice(fund.feed.value, fund.rangeMin, fund.rangeMax, 0.5, 2.0)} Eth({formatEther(fund.feed.value)})</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text type="secondary">index value</Text>
                      <Slider marks={{ 0: fund.rangeMin, 100: fund.rangeMax }} included={false} disabled defaultValue={fund.feed.value} style={{width: 200}} />
                    </Row>
                  </Card>
                </Col>
              <Row>
                <Title level={5} type="secondary"><br/>Recent supporting artworks:</Title>
              </Row>
              <Row>
                <List grid={grid} dataSource={fund.artworks} renderItem={artwork => renderArtworkListing(artwork, history)} loading={loading} />
              </Row>
              </Row>
              <Divider/>
            </Row>
          ))
        }
      </Col>
    </Row>
  )
}

export default Subgraph;
