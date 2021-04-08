/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  Switch,
  Typography,
  List,
  Card,
  Skeleton,
  Divider,
  Badge,
  Row,
  Col,
  Image,
  Carousel,
  Button,
  Tag,
  Slider,
} from "antd";
import { useQuery, gql } from "@apollo/client";
import { formatEther } from "@ethersproject/units";
import Avatar from "antd/lib/avatar/avatar";
import Artwork from "../components/Artwork";
import BuyTokenModal from "./BuyTokenModal";
import { ethers } from "ethers";

function mapPrice(val, valMin, valMax, rangeMin, rangeMax) {
  const reverse = valMin > valMax;
  let clamped;

  if (reverse) clamped = Math.min(valMin, Math.max(val, valMax));
  else clamped = Math.min(valMax, Math.max(val, valMin));

  const normalized = (clamped - valMin) / (valMax - valMin) || 0;
  return rangeMin + (rangeMax - rangeMin) * normalized;
}

const { Text, Title } = Typography;

const ARTWORKS_QUERY = gql`
  query {
    funds {
      id
      symbol
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
        revoked
        artworkImageUrl
        owner
        artist {
          address
          name
          id
        }
        fund {
          name
        }
      }
    }
  }
`;

const grid = {
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 6,
  xxl: 4,
};

const renderArtworkListing = artwork => (
  <List.Item key={artwork.id}>
    <Artwork artwork={artwork} />
  </List.Item>
);

const Subgraph = props => {
  const variables = {
    // firstArtists: 3,
    // firstArtworks: 8,
    // offsetArtworks: 0
  };

  const [showModal, setShowModal] = useState(false);
  const { loading, data } = useQuery(ARTWORKS_QUERY, {}, { pollInterval: 2500 });
  const [currentFund, setCurrentFund] = useState([]);

  const buyFund = fund => {
    setCurrentFund(fund);
    setShowModal(true);
  };

  return (
    <>
      <BuyTokenModal
        writeContracts={props.writeContracts}
        visible={showModal}
        handleClose={() => setShowModal(false)}
        fund={currentFund}
      />
      <Row direction="vertical">
        <Col span={12} offset={6}>
          <br />
          <Row>
            <Title level={3}>🤝 Funds & Orgs supported by Good Tokens</Title>
          </Row>
          <br />

          {data &&
            data.funds.map(fund => {
              const value = +fund.feed.value / 10 ** 18;
              const rangeMin = +fund.rangeMin;
              const rangeMax = +fund.rangeMax;

              const price = mapPrice(value, rangeMin, rangeMax, 0.5, 2.0);
              const ratio = Math.round(mapPrice(value, rangeMin, rangeMax, 0, 100));

              return (
                <Row>
                  <Row>
                    <Col span={11}>
                      <Row>
                        <Avatar
                          style={{ marginTop: 1, border: 2, marginRight: 10, background: "#EEE" }}
                          shape="square"
                          size="default"
                          src={fund.image}
                        />
                        <Title level={3}>{fund.name}</Title>
                      </Row>
                      <Row>
                        <Row>
                          <div style={{ textAlign: "left" }}>
                            <Text type="secondary">
                              {fund.description}
                              <br />
                              <br />
                            </Text>
                          </div>
                        </Row>
                        <Row>
                          <Button type="primary" onClick={() => buyFund(fund)}>
                            Buy {fund.name} token
                          </Button>
                        </Row>
                      </Row>
                    </Col>
                    <Col span={12} offset={1}>
                      <Card
                        style={{ textAlign: "left" }}
                        size="small"
                        title={
                          <Row justify="space-between">
                            <Text>{fund.feed.name}</Text>
                            <Tag>{fund.feed.id}</Tag>
                          </Row>
                        }
                      >
                        <Row>
                          <Text type="secondary">{fund.feed.description}</Text>
                        </Row>
                        <Row justify="space-between">
                          <Text type="secondary">Currently tracked period</Text>
                          <Text>{new Date().getFullYear() - parseInt(fund.feed.yearOffset, 10)}</Text>
                        </Row>
                        <Row justify="space-between">
                          <Text type="secondary">Token price</Text>
                          <Text>1 Good Token ⇔ ☰{price.toFixed(4)}</Text>
                        </Row>
                        <Row justify="space-between">
                          <Text type="secondary">index value</Text>
                          <Slider
                            step={null}
                            marks={{ 0: fund.rangeMin, [ratio]: value.toFixed(2), 100: fund.rangeMax }}
                            included={false}
                            disabled
                            defaultValue={ratio}
                            style={{ width: 200 }}
                          />
                        </Row>
                      </Card>
                    </Col>
                    <Row>
                      <Title level={5} type="secondary">
                        <br />
                        Recent supporting artworks:
                      </Title>
                    </Row>
                    <Row>
                      <List
                        grid={grid}
                        dataSource={fund.artworks}
                        renderItem={renderArtworkListing}
                        loading={loading}
                      />
                    </Row>
                  </Row>
                  <Divider />
                </Row>
              );
            })}
        </Col>
      </Row>
    </>
  );
};

export default Subgraph;
