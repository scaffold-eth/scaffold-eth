/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Radio, Button, Typography, Table, Input, List, Divider } from "antd";
import { useQuery, gql } from "@apollo/client";
import { Address } from "../components";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import { parseEther, formatEther } from "@ethersproject/units";

const highlight = {
  marginLeft: 4,
  marginRight: 8,
  backgroundColor: "#f9f9f9",
  padding: 4,
  borderRadius: 4,
  fontWeight: "bolder",
};

function Manage(props) {
  const [query, setQuery] = useState(null);

  function graphQLFetcher(graphQLParams) {
    return fetch(props.subgraphUri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  const EXAMPLE_GRAPHQL = `
  {
    wills(first: 25, orderBy: deadline, orderDirection: desc) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `;
  const QUERY_OWN = gql`
    query Will($address: Bytes!, $address2: Bytes!) {
      wills(first: 25, orderBy: deadline, orderDirection: desc, where: { owner: $address, beneficiary: $address2 }) {
        index
        owner
        beneficiary
        deadline
        value
      }
    }
  `;
  const QUERY_INHERITANCES = gql`
    query Will($beneficiary: Bytes!) {
      wills(where: { owner: $beneficiary }) {
        index
        owner
        beneficiary
        deadline
        value
      }
    }
  `;

  const QUERY_GQL = gql(EXAMPLE_GRAPHQL);
  const { loading, data } = useQuery(QUERY_GQL, { pollInterval: 2500 });
  // useQuery(QUERY_OWN,{variables:{address2:props.address.toLowerCase(),address:props.address.toLowerCase()}, pollInterval: 2500});

  const willsColumns = [
    {
      title: "Will",
      dataIndex: "index",
      key: "index",
      render: record => <p>{record}</p>,
    },
    {
      title: "Owner",
      key: "owner",
      render: record => <Address value={record.owner} ensProvider={props.mainnetProvider} fontSize={16} />,
    },
    {
      title: "TimeLock",
      key: "deadline",
      dataIndex: "deadline",
      render: record => new Date(record * 1000).toISOString(),
    },
    {
      title: "Beneficiary",
      key: "beneficiary",
      render: record => <Address value={record.beneficiary} ensProvider={props.mainnetProvider} fontSize={16} />,
    },
    {
      title: "Balance ETH",
      key: "value",
      dataIndex: "value",
      render: record => <p>{formatEther(record)}</p>,
    },
    {
      title: "Token",
      key: "tokenAddress",
      render: record => <Address value={record.tokenAddress} ensProvider={props.mainnetProvider} fontSize={16} />,
    },
    {
      title: "Amount Token",
      key: "tokenValue",
      dataIndex: "tokenValue",
      // render: (record) => <p>{record}</p>
    },
    {
      title: "Actions",
      // key: 'actions',
      render: record => (
        <div>
          <Button
            disabled={record.owner.toLowerCase() != props.address.toLowerCase()}
            onClick={async () => {
              const totalBalance = await props.readContracts.Noun.ethBalance(record.index - 1);
              await props.tx({
                to: props.writeContracts.Noun.address,
                data: props.writeContracts.Noun.interface.encodeFunctionData(
                  "defundWillETH(uint256, address payable , uint256)",
                  [record.index - 1, props.address, totalBalance],
                ),
              });
            }}
          >
            withdraw
          </Button>

          <Button
            disabled={record.beneficiary.toLowerCase() != props.address.toLowerCase() || ts < record.deadline}
            onClick={async () => {
              const totalBalance = await props.readContracts.Noun.ethBalance(record.index - 1);
              await props.tx({
                to: props.writeContracts.Noun.address,
                data: props.writeContracts.Noun.interface.encodeFunctionData(
                  "BenefitETH(uint256, address payable , uint256)",
                  [record.index - 1, props.address, totalBalance],
                ),
              });
            }}
          >
            claim
          </Button>
        </div>
      ),
    },
  ];
  const deployWarning = <div style={{ marginTop: 8, padding: 8 }}>Warning: 🤔 is it any event fired yet?</div>;

  var ts = Math.floor(new Date().getTime() / 1000);

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  return (
    <>
      <div>
        {data ? <Table dataSource={data.wills} columns={willsColumns} rowKey="index" /> : "Loading.."}

        <Divider />
        <span>Current timestamp: {ts || "loading.."}</span>
        <br />
        <Radio.Group
          onChange={e => {
            setQuery(e.target.value);
          }}
          value={query}
        >
          <Radio style={radioStyle} value={null}>
            All wills
          </Radio>
          <Radio style={radioStyle} value="owner">
            My wills
          </Radio>
          <Radio style={radioStyle} value="beneficiary">
            My inheritances
          </Radio>
        </Radio.Group>
        <Divider />

        <div style={{ margin: 32, height: 400, border: "1px solid #888888", textAlign: "left" }}>
          <GraphiQL fetcher={graphQLFetcher} docExplorerOpen query={EXAMPLE_GRAPHQL} />
        </div>
      </div>
    </>
  );
}

export default Manage;
