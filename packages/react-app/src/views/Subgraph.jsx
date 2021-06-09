/* eslint-disable jsx-a11y/accessible-emoji */
import { gql, useQuery } from "@apollo/client";
import { Button, Input, Table, Typography, Radio, Space, Card } from "antd";
import "antd/dist/antd.css";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import React, { useState } from "react";
import { Address } from "../components";

const highlight = {
  marginLeft: 4,
  marginRight: 8,
  /* backgroundColor: "#f9f9f9", */ padding: 4,
  borderRadius: 4,
  fontWeight: "bolder",
};

function Subgraph(props) {
  function graphQLFetcher(graphQLParams) {
    return fetch(props.subgraphUri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  const EXAMPLE_GRAPHQL = `
  {
    purposes(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      purpose
      createdAt
      sender {
        id
      }
    }
    senders {
      id
      address
      purposeCount
    }
  }
  `;
  const EXAMPLE_GQL = gql(EXAMPLE_GRAPHQL);
  const { loading, data } = useQuery(EXAMPLE_GQL, { pollInterval: 2500 });

  const purposeColumns = [
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Sender",
      key: "id",
      render: record => <Address value={record.sender.id} ensProvider={props.mainnetProvider} fontSize={16} />,
    },
    {
      title: "createdAt",
      key: "createdAt",
      dataIndex: "createdAt",
      render: d => new Date(d * 1000).toISOString(),
    },
  ];

  const [newPurpose, setNewPurpose] = useState("loading...");

  const deployWarning = (
    <div style={{ marginTop: 8, padding: 8 }}>Warning: 🤔 Have you deployed your subgraph yet?</div>
  );


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
            swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
              pair {
                token0 {
                  symbol
                  totalSupply
                  totalLiquidity
                }
                token1 {
                  symbol
                  totalSupply
                  totalLiquidity
                }
                totalSupply
                token0Price
                token1Price
              }
              amount0In,
              amount1In,
              amount0Out,
              amount1Out
              amountUSD,
              transaction {
              blockNumber
            }
            }
          }`
    },{
      "name":"compound-v2",
      "uri":"https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2",
      "ql": `{
            markets(first: 7, orderBy: totalSupply) {
              symbol
              totalSupply
            }
          }`
    },{
      "name":"synthetix",
      "uri":"https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix",
      "ql": `{
          synthetixes(first: 5) {
            id
            issuers
            snxHolders
          }
          transfers(first: 5) {
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
            protocols(first: 5) {
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
            markets(first: 5) {
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
          fullTrades(first: 5) {
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
          pools(first: 5, orderBy: addedAt) {
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
      <div style={{ margin: "auto", marginTop: 32 }}>
        You will find that parsing/tracking events with the{" "}
        <span className="highlight" style={highlight}>
          useEventListener
        </span>{" "}
        hook becomes a chore for every new project.
      </div>
      <div style={{ margin: "auto", marginTop: 32 }}>
        Instead, you can use{" "}
        <a href="https://thegraph.com/docs/introduction" target="_blank" rel="noopener noreferrer">
          The Graph
        </a>{" "}
        with 🏗 scaffold-eth (
        <a href="https://youtu.be/T5ylzOTkn-Q" target="_blank" rel="noopener noreferrer">
          learn more
        </a>
        ):
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚮</span>
        Clean up previous data:
        <span className="highlight" style={highlight}>
          rm -rf docker/graph-node/data/
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📡</span>
        Spin up a local graph node by running
        <span className="highlight" style={highlight}>
          yarn graph-run-node
        </span>
        <span style={{ marginLeft: 4 }}>
          {" "}
          (requires{" "}
          <a href="https://www.docker.com/products/docker-desktop" target="_blank" rel="noopener noreferrer">
            {" "}
            Docker
          </a>
          ){" "}
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        Create your <b>local subgraph</b> by running
        <span className="highlight" style={highlight}>
          yarn graph-create-local
        </span>
        (only required once!)
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚢</span>
        Deploy your <b>local subgraph</b> by running
        <span className="highlight" style={highlight}>
          yarn graph-ship-local
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🖍️</span>
        Edit your <b>local subgraph</b> in
        <span className="highlight" style={highlight}>
          packages/subgraph/src
        </span>
        (learn more about subgraph definition{" "}
        <a href="https://thegraph.com/docs/define-a-subgraph" target="_blank" rel="noopener noreferrer">
          here
        </a>
        )
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤩</span>
        Deploy your <b>contracts and your subgraph</b> in one go by running
        <span className="highlight" style={highlight}>
          yarn deploy-and-graph
        </span>
      </div>

      <div style={{ width: 780, margin: "auto", paddingBottom: 64 }}>
        <div style={{ margin: 32, textAlign: "right" }}>
          <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              console.log("newPurpose", newPurpose);
              /* look how you call setPurpose on your contract: */
              props.tx(props.writeContracts.YourContract.setPurpose(newPurpose));
            }}
          >
            Set Purpose
          </Button>
        </div>

        {data ? (
          <Table dataSource={data.purposes} columns={purposeColumns} rowKey="id" />
        ) : (
          <Typography>{loading ? "Loading..." : deployWarning}</Typography>
        )}

        <div style={{ margin: 32, height: 400, border: "1px solid #888888", textAlign: "left" }}>
          <GraphiQL fetcher={graphQLFetcher} docExplorerOpen query={EXAMPLE_GRAPHQL} />
        </div>

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


        <div style={{ margin: 20, height: 500, border: "1px solid #888888", textAlign: "left" }}>
          <GraphiQL fetcher={dexQLFetcher} docExplorerOpen query={ql} />
        </div>
        </Card>
      </div>

      <div style={{ padding: 64 }}>...</div>
    </>
  );
}

export default Subgraph;
