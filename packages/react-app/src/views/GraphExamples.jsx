/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Space, Row, Col } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useParams, useLocation } from 'react-router-dom'


const { Text, Title } = Typography

const FEATURED_ARTWORKS_QUERY = `
  featuredArtworks: artworks(first: $featuredArtworks, orderBy: createdAt, orderDirection: desc) {
    id
    tokenId
    artist {
      address
    }
    beneficiary {
      name
    }
  }
`

const FEATURED_ARTISTS_QUERY = `
  featuredArtists: artists(first: $featuredArtists) {
    id
    address
    artworks(first: $featuredArtists, orderBy: createdAt, orderDirection: desc) {
      tokenId
      price
      artworkUrl
      revokedurl
      beneficiary {
        name
      }
    }
  }
`

const ARTWORK_TRANSFERS = gql`
  query ArtworkTransfers {
    artworks(first: 3) {
      transfers {
        createdAt
        from
        to
      }
    }
  }
`

const ARTWORK_BY_TRANSFERS = gql`
  query ArtworksByBeneficiary {
    beneficiaries(first: 5) {
      name
      symbol
      address
      artworks {
        id
        artworkUrl
      }
    }
  }
`

const COMPOSITE_QUERY = gql`
  query ($featuredArtists: Int, $featuredArtworks: Int) {
    ${FEATURED_ARTWORKS_QUERY}
    ${FEATURED_ARTISTS_QUERY}
  }
`

const Subgraph = (props) => {
  console.log(props)

  const queryVariables = {
    featuredArtists: 3,
    featuredArtworks: 5
  }

  const { loading, data } = useQuery(COMPOSITE_QUERY, queryVariables,{pollInterval: 2500});

  const featuredArtists = (
    <Skeleton loading={loading} active>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={data && data.featuredArtists}
        renderItem={artist => (
          <List.Item>
            <Card title={
              <Row>
                <Col flex={1}>
                  <Blockies seed={artist.address} scale={3} />
                </Col>
                <Col flex={4}>
                  <Title level={4} ellipsis>{artist.address}</Title>
                </Col>
              </Row>
            }>
              {artist.artworks.length} works available
            </Card>
          </List.Item>
        )}
      />
    </Skeleton>
  )

  const featuredArtworks = (
    <Skeleton loading={loading} active>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={data &&  data.featuredArtworks}
        renderItem={artwork => (
          <List.Item>
            <Card title={
                <Row>
                  <Col flex={1}>
                    <Blockies seed={artwork.address} scale={3} />
                  </Col>
                  <Col flex={4}>
                    <Title level={4} ellipsis>{artwork.tokenId}</Title>
                  </Col>
                </Row>
              }>
                This artwork supports {artwork.beneficiary.name}
            </Card>
          </List.Item>
        )}
      />
    </Skeleton>
  )
  
  return (
    <Space direction="vertical">
      <br/>
      <Title level={3}>Featured artists</Title>
      <br/>
      {featuredArtists}

      <Divider plain />
      
      <br/>
      <Title level={3}>Featured artworks</Title>
      <br/>
      
      {featuredArtworks}
    </Space>
  )
}

export default Subgraph;
