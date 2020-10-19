import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { MailOutlined } from "@ant-design/icons";
import { Row, Col, Button, List, Tabs, Menu, Select, Typography, Table, Input } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';

const { Title } = Typography;

const { Option } = Select;

function Subgraph(props) {

  function graphQLFetcher(graphQLParams) {
    return fetch(props.subgraphUri, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
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
  `
  const EXAMPLE_GQL = gql(EXAMPLE_GRAPHQL)
  const { loading, error, data } = useQuery(EXAMPLE_GQL,{pollInterval: 2500});

  const purposeColumns = [
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Sender',
      key: 'id',
      render: (record) => <Address
                        value={record.sender.id}
                        ensProvider={props.mainnetProvider}
                        fontSize={16}
                      />
    },
    {
      title: 'createdAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: d => (new Date(d * 1000)).toISOString()
    },
    ];

  const [newPurpose, setNewPurpose] = useState("loading...");

  return (
    <>
          <div style={{ margin: 12 }}>
            <span style={{ marginRight: 8 }}>📡</span>
            Spin up a <b>local graph node</b> by running
            <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
              yarn graph-run-node
            </span>
            <span style={{ marginLeft: 4}}> (requires <a href="https://www.docker.com/products/docker-desktop" target="_blank"> Docker</a>) </span>
          </div>
          <div style={{ margin: 12 }}>
            <span style={{ marginRight: 8 }}>📝</span>
            Create your <b>local subgraph</b> by running
            <span style={{ marginLeft: 4, marginRight: 8, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
              yarn graph-create-local
            </span>
            (only required once!)
          </div>
          <div style={{ margin: 12 }}>
            <span style={{ marginRight: 8 }}>🚢</span>
            Deploy your <b>local subgraph</b> by running
            <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
              yarn graph-ship-local
            </span>
          </div>
          <div style={{ margin: 12 }}>
            <span style={{ marginRight: 8 }}>🖍️</span>
            Edit your <b>local subgraph</b> in
            <span style={{ marginLeft: 4, marginRight: 8, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
              packages/subgraph/src
            </span>
             (learn more about subgraph definition <a href="https://thegraph.com/docs/define-a-subgraph" target="_blank">here</a>)
          </div>
          <div style={{ margin: 12 }}>
            <span style={{ marginRight: 8 }}>🤩</span>
            Deploy your <b>contracts and your subgraph</b> in one go by running
            <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
              yarn deploy-and-graph
            </span>
          </div>
          <div style={{height:500, margin:5, textAlign:'left' }}>
          <div style={{margin:8}}>
            <Input onChange={(e)=>{setNewPurpose(e.target.value)}} />
            <Button onClick={()=>{
              console.log("newPurpose",newPurpose)
              /* look how you call setPurpose on your contract: */
              props.tx( props.writeContracts.YourContract.setPurpose(newPurpose) )
            }}>Set Purpose</Button>
          </div>
          {data?<Table dataSource={data.purposes} columns={purposeColumns} rowKey={"id"} />:<Typography>{(loading?"Loading...":"🤔 Have you deployed your subgraph?")}</Typography>}
          <GraphiQL fetcher={graphQLFetcher} docExplorerOpen={true} query={EXAMPLE_GRAPHQL}/>
          </div>
          </>
  );
}

export default Subgraph;
