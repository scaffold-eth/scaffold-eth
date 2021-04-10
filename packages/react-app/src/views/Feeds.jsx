/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Switch, Typography, List, Card, Skeleton, Divider, Badge, Row, Col, Image, Carousel, Button, Tag, Slider, Tooltip } from "antd";
import { useQuery, gql } from '@apollo/client';
import Avatar from "antd/lib/avatar/avatar";
import Artwork from "../components/Artwork";
import { Artworks } from ".";
import { ethers } from 'ethers';

function mapPrice(val, valMin, valMax, rangeMin, rangeMax) {
  const clamped = (Math.min(valMax, Math.max(val, valMin)))
  const normalized = ((clamped - valMin) / (valMax - valMin)) || 0
  return rangeMin + (rangeMax - rangeMin) * normalized
}

const { Text, Title } = Typography

const renderFund = (fund) => (
  <Tooltip title={fund.description}>
    <List.Item style={{textAlign:'left'}} key={fund.id}>
    <List.Item.Meta
      avatar={
        <Avatar size='large' shape='square' style={{marginTop:3, backgroundColor:'white'}} src={fund.image} />
      }
      title={fund.name}
      description={`${fund.artworks.length} artworks supporting this fund`}
    />
  </List.Item>
  </Tooltip>
)

const FEEDS_QUERY = gql`
  query {
    feeds {
      id
      name
      description
      yearOffset
      value
      url
      funds {
        id
        name
        tokenId
        beneficiary
        image
        description
        rangeMin
        rangeMax
        artworks {
          id
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

const renderArtworkListing = (artwork) => (
  <List.Item key={artwork.id}>
    <Artwork artwork={artwork} />
  </List.Item>
)

const Subgraph = (props) => {
  const { loading, data } = useQuery(FEEDS_QUERY, {  }, { pollInterval: 2500 });

  return (
    <Row direction="vertical">
      <Col span={12} offset={6}>
        <br />
        <Row>
          <Title level={3}>🤝 Tracked Index Data Feeds</Title>
        </Row>
        <br />
        
        {
          data && data.feeds.map(feed => {
            return (
              <>
                <Row>
                  <Col span={11}>
                    <Card bodyStyle={{textAlign: 'left'}} title={
                      <Row>
                        <Text>{feed.name} &nbsp;</Text>
                        <Tag color="gold">{feed.id}</Tag>
                      </Row>
                    }>
                      <Text type="secondary">About this index feed:</Text>
                      <br/>
                      <Text>{feed.description}</Text>
                      <br/>
                      <br/>
                      <Button type="primary">
                        <a href={feed.url}>Check out {feed.id} data!</a>
                      </Button>
                      <Divider/>
                      <Row justify="space-between">
                        <Text type="secondary">current index period</Text>
                        <Text>{(new Date()).getFullYear() - parseInt(feed.yearOffset, 10)}</Text>
                      </Row>
                      <Row justify="space-between">
                        <Text type="secondary">current index value</Text>
                        <Text>{ethers.BigNumber.from(feed.value.toString()).div(ethers.constants.WeiPerEther.div(100)).toNumber() / 100}</Text>
                      </Row>
                      <Row justify="space-between">
                        <Text type="secondary">total raised with Good Tokens</Text>
                        <Text>many many Eth</Text>
                      </Row>
                    </Card>
                  </Col>
                  <Col offset={2} span={11}>
                    <List
                      header={<Title style={{textAlign:'left'}} level={5}>tracking Good Token funds:</Title>}
                      dataSource={feed.funds}
                      renderItem={renderFund}
                    />
                  </Col>
                </Row>
                <Divider/>
              </>
            )
          })
        }
      </Col>
    </Row>
  )
}

export default Subgraph;
