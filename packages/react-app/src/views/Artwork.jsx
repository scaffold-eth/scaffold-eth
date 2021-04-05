/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Space, Row, Col, Image, Spin, Carousel, Button, Table, Tag } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { Link, useHistory, useParams } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";



const { Text, Title } = Typography

const zeroAddress = "0x0000000000000000000000000000000000000000"

const mapOwnershipData = (transfers) => (
  transfers.map(transfer => ({
    key: transfer.id,
    event:  (transfer.from === zeroAddress) ? {icon:'🖼️', label:'List'} : {icon:'💱', label:'Transfer'},
    from: transfer.from,
    to: transfer.to,
    date: (new Date((+transfer.createdAt) * 1000)).toDateString()
  }))
)

const ARTWORK_QUERY = gql`
  query ($artwork: String!) {
    artwork(id: $artwork) {
      id
      createdAt
      tokenId
      owner
      revoked
      price
      revoked
      name
      desc
      artworkImageUrl
      artworkRevokedImageUrl
      ownershipModel
      balanceRequirement
      balanceDurationInSeconds
      
      artist {
        address
        name
      }
      
      fund {
        name
        feed {
          id
        }
      }

      transfers(orderBy: createdAt, orderDirection: desc) {
        id
        createdAt
        to
        from
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
          <Text type="secondary"> &nbsp;{artwork.artist.name}</Text>
        </Col>
        <Col><Text>{formatEther(artwork.price)} ☰</Text></Col>
      </Row>
      }
      cover={<Image src={artwork.revoked ? artwork.artworkRevokedImageUrl : artwork.artworkImageUrl} />}
    >
      <Row justify="start">
        <Text strong>{artwork.name}</Text> <Text type="secondary">support {artwork.fund.name}</Text> 
      </Row>
    </Card>
  </List.Item>
)

const ownershipColumns  = [
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    render: event => (<span><Title style={{float: 'left', lineHeight: '1rem'}} level={3}>{event.icon}</Title> &nbsp;<Text> {event.label}</Text></span>)
  }, {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: addr => (
      <span>
        <span><Blockies seed={addr} scale={2} /></span>
        <Text > &nbsp; 0x{addr.substr(-4).toUpperCase()}</Text>
      </span>
    )

  }, {
    title: 'To',
    key: 'to',
    dataIndex: 'to',
    render: addr => (
      <span>
        <span><Blockies seed={addr} scale={2} /></span>
        <Text > &nbsp; 0x{addr.substr(-4).toUpperCase()}</Text>
      </span>
    )
  },
  {
    title: 'Date',
    key: 'date',
    dataIndex: 'date',
    render: date => <Text>{date}</Text>

  },
];

const Subgraph = (props) => {
  const { artwork } = useParams()
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  
  const variables = { artwork }
  
  const { loading, data, startPolling } = useQuery(ARTWORK_QUERY, {variables},{pollInterval: 2500, fetchPolicy: 'network-only'});
  const history = useHistory()
  
  startPolling()

  const buyArtwork = async() => {
    setIsPurchasing(true);
    try{
      const t = await props.tx(props.writeContracts.GoodToken.buyArtwork(data.artwork.tokenId, {value: data.artwork.price}));
      console.log(t);
      console.log(await t.wait());
      console.log("Owner is: " + await props.writeContracts.GoodToken.ownerOf(data.artwork.tokenId));
    }catch(e) {
      console.log(e);
    }
    setIsPurchasing(false);
  }


  const getOwner = async () => {
    console.log(props.writeContracts.GoodToken);
    console.log(`Owner of token ${data.artwork.tokenId} is: ` + await props.writeContracts.GoodToken.ownerOf(data.artwork.tokenId));

  }


  if(loading)
    return (
      <Col span={12} offset={6}>
        <br/><br/>
        <Skeleton active />
      </Col>
    )

  if(!loading && (!data || !data.artwork)) {
    history.replace('/')
    return (
      <Col span={12} offset={6}>
        <br/><br/>
        <Skeleton active />
      </Col>
    )
  }

  const isForSale = data.artwork.revoked || (data.artwork.artist.address ===  data.artwork.owner)
  const isOwner = (props.address.toLowerCase() == data.artwork.owner.toLowerCase())

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
                    <span><span><Blockies seed={data.artwork.artist.address} scale={2} /></span> {data.artwork.artist.name}</span>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Published on</Text>
                    <Text type="secondary">{(new Date(+data.artwork.createdAt * 1000)).toDateString()}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Ownership model</Text>
                    <Text type="secondary">{data.artwork.ownershipModel ?  '📊 Dynamic balance' :'⚖️ Static balance'}</Text>
                  </Row>
                  {(data.artwork.ownershipModel == 0) && <Row justify="space-between">
                    <Text type="secondary">Minimum balance</Text>
                    <Text type="secondary">{formatEther(data.artwork.balanceRequirement)}<i>{data.artwork.fund.feed.id}</i></Text>
                  </Row>}
                  {(data.artwork.ownershipModel == 1) && <Row justify="space-between">
                    <Text type="secondary">Balance period</Text>
                    <Text type="secondary">{data.artwork.balanceDurationInSeconds} seconds</Text>
                  </Row>}
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
            <Row justify="space-between">
                <Col flex={1}>
                <div style={{marginTop:5, float: 'left'}}><Blockies seed={data.artwork.artist.address} scale={3} /></div>
                <Title level={3} type="secondary"> &nbsp; {data.artwork.artist.name}</Title>
                </Col>
                <Col>
                {isForSale && (data.artwork.revoked ? <Tag color="gold">Revoked!</Tag> : <Tag color="blue">For sale!</Tag>)}

                </Col>
            </Row>
            <Row>
              <Title level={2}> {data.artwork.name}</Title>
            </Row>
            <Row>
                <div style={{marginTop:2}}><Blockies seed={data.artwork.owner} scale={2} /></div>
                <Text type="secondary"> &nbsp; Owned by 0x{data.artwork.owner.substr(-4).toUpperCase()}</Text>
            </Row>
            <Row>
              <Col flex="1">
                <br/>
                <Card headStyle={data.artwork.revoked ? {background: '#ffc53d'} : (isOwner ? {background: '#ffd666'} : {})} title={data.artwork.revoked ? 'Artwork is revoked and up for sale!' : (isOwner ? 'This one is yours! Good own ya! 🤝' : (`Artwork is ${isForSale ? '' : 'not '}available for sale`))}>
                  <Row justify="space-between" align="middle">
                  <Col>
                    <Row>
                      <Text type="secondary">current price</Text></Row>
                    <Row>
                      <Col>
                        <Title level={2}>☰{formatEther(data.artwork.price)}</Title>
                      </Col>
      
                    </Row>
                  </Col>
                  <Col>
                    {
                      isForSale && (<Button type="primary" size="large"  onClick={buyArtwork}>{isPurchasing ? (<Spin />) : '🤝 Buy now'}</Button>)
                    }
                  </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col flex="1">
                <br/>
                <Card title="The Good stuff">
                  This artwork supports <Text type="warning">{data.artwork.fund.name}</Text> using the Good Token protocol.
                    <br/>
                    <br/>
                  {
                    data.artwork.ownershipModel ? (
                      <Row>
                        <Text>This Good Token uses a dynamic ownership model. This means the owner must contribute  <Text type="warning">1 token</Text> to <Text type="warning">{data.artwork.fund.name}</Text> every <Text type="warning">{data.artwork.balanceDurationInSeconds}</Text> seconds.</Text>
                        {
                          data.artwork.revoked ?
                           <Text mark>The current owner failed to make the required contribution and his ownership is revoked! Now's your chance to buy the work and become a Good owner!</Text>
                           : 
                           <Text>If the owner fails to make the required contribution, his ownership will be revoked and this artwork aill automatically go on sale.</Text>
                        }
                      </Row>
                    ) : (
                      <Row>
                        <Text>This Good Token uses a static ownership model. This means the owner must maintain a balance of  <Text type="warning">{formatEther(data.artwork.balanceRequirement)}<i>{data.artwork.fund.feed.id}</i> tokens</Text> with <Text type="warning">{data.artwork.fund.name}</Text>.</Text>
                        {
                        data.artwork.revoked ?
                        <Text mark>The current owner failed to maintain the required balance and his ownership is revoked! Now's your chance to buy the work and become a Good owner!</Text>                        
                        :
                        <Text>If the owner fails to maintain a sufficient balance, his ownership will be revoced and this artwork aill automatically go on sale.</Text>
                        }
                      </Row>
                    )
                  }

                  <br/>
                  <Link href="/about">Learn more about the Good Token.</Link>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col flex="1">
            <br/>
            <Card title="Ownership history" bodyStyle={{padding:0}}>
              <Table pagination={false} columns={ownershipColumns} dataSource={mapOwnershipData(data.artwork.transfers)} />
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
