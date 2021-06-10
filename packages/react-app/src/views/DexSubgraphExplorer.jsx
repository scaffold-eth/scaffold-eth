//DexSubgraphExplorer
/* eslint-disable jsx-a11y/accessible-emoji */
import { gql, useQuery } from "@apollo/client";
import { Button, Input, Table, Typography, Radio, Space, Card } from "antd";
import "antd/dist/antd.css";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import React, { useState } from "react";

function DexSubgraphExplorer() {

  const dexQLFetcher = (_ql) => {
    return fetch(uri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_ql),
    }).then(response => response.json());
  }

  const uriArr = [
    {
      "name":"uniswap-v2",
      "uri":"https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      "ql": `{
        pairs(first: 10, orderBy: volumeUSD, orderDirection: desc) {
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          volumeUSD
          reserveUSD
          reserveETH
          volumeToken0
          volumeToken1
        }
      }`
    },{
      "name":"compound-v2",
      "uri":"https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2",
      "ql": `{
        markets(first: 10, orderBy: totalSupply) {
          symbol
          totalSupply
        }
      }`
    },{
      "name":"synthetix",
      "uri":"https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix",
      "ql": `{
        synthetixes(first: 10) {
          id
          issuers
          snxHolders
        }
        transfers(first: 10) {
          id
          from
          to
          value
        }
      }`
    },{
      "name":"balancer-v2",
      "uri":"https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2",
      "ql": `{
        pools(first: 10, orderBy: totalLiquidity) {
          address
        }
      }`
    },{
      "name":"aave-v2",
      "uri":"https://api.thegraph.com/subgraphs/name/aave/protocol-v2",
      "ql": `{
        protocols(first: 10) {
          id
          pools {
            id
          }
        }
      }`
    },{
      "name":"dydx",
      "uri":"https://api.thegraph.com/subgraphs/name/graphitetools/dydx",
      "ql": `{
        markets(first: 10) {
          id
          token {
            id
          }
          supplyIndex
          borrowIndex
        }
      }`
    },{
      "name":"kyber",
      "uri":"https://api.thegraph.com/subgraphs/name/protofire/kyber",
      "ql": `{
        fullTrades(first: 10) {
          src {
            symbol
          }
          dest {
            symbol
          }
        }
      }`
    },{
      "name":"curve",
      "uri":"https://api.thegraph.com/subgraphs/name/protofire/curve",
      "ql": `{
        pools(first: 10, orderBy: addedAt) {
          coins {
            token {
              symbol
            }
            balance
          }
          underlyingCoins {
            token {
              symbol
            }
          }
        }
      }`
    },{
      "name":"chainlink",
      "uri":"https://api.thegraph.com/subgraphs/name/tomafrench/chainlink",
      "ql": `{
        ethStarts: priceFeeds(first: 10, where: {assetPair_starts_with: "ETH"}) {
          id
          assetPair
          decimals
          latestPrice {
            price
          }
        }
        ethEnds: priceFeeds(first: 10, where: {assetPair_ends_with: "ETH"}) {
          id
          assetPair
          decimals
          latestPrice {
            price
          }
        }
        ethContains: priceFeeds(first: 10, where: {assetPair_contains: "ETH"}) {
          id
          assetPair
          decimals
          latestPrice {
            price
          }
        }
      }`
    }
  ];

  const [index, setIndex] = useState(0);
  const [uri, setUri] = useState(uriArr[0].uri);
  const [ql, setQl] = useState(uriArr[0].ql);

  const onChangeUri = e => {
    const i = e.target.value;
    console.log('radio checked', e.target.value);
    setIndex(i);
    setUri(uriArr[i].uri);
    setQl(uriArr[i].ql);
  };

  return (
    <>
      <div style={{ margin: "auto", marginTop: 30 }}>

        <Card title="choose and play some top dex subgraph:" style={{ margin: "auto", marginTop: 10, paddingBottom: 10 }}>
        <h3>current dex url: {uri} </h3>      
        <Radio.Group onChange={onChangeUri} value={index} >
          <Space direction="vertical">
            { uriArr && 
              uriArr.map ( (u,i) => {
                return (
                  <Radio key={i} value={i}>{u.name}</Radio>
                )
              })
            }
          </Space>
        </Radio.Group>

        <div style={{ margin: "auto", margin: 20, height: 500, border: "1px solid #888888", textAlign: "left" }}>
          <GraphiQL fetcher={dexQLFetcher} docExplorerOpen query={ql} />
        </div>
        </Card>
      </div>

      <div style={{ padding: 30 }}>...</div>
    </>
  );
}

export default DexSubgraphExplorer;
