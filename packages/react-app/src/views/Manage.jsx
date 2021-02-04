/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Radio, Button, Table, Divider } from "antd";
import { useQuery, gql } from "@apollo/client";
import { formatEther } from "@ethersproject/units";
import fetch from "isomorphic-fetch";
import GraphiQL from "graphiql";
import { Address } from "../components";
import "graphiql/graphiql.min.css";

function Manage(props) {
  const [query, setQuery] = useState("All");
  const ts = Math.floor(new Date().getTime() / 1000);

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
      token
      tokenBalance
    }
  }
  `;

  const queries = {
    All: `
  {
    wills(first: 25, orderBy: deadline, orderDirection: desc) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `,
    owner: `
  query Will($address:Bytes!){
      wills(first: 25, orderBy: deadline, orderDirection: desc, where:{owner:$address}) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `,
    beneficiary: `
  query Will($address:Bytes!){
      wills(first: 25, orderBy: deadline, orderDirection: desc,where:{beneficiary:$address}) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `,
  };

  const QUERY_GQL = gql(queries[query]);
  const data = useQuery(QUERY_GQL, {
    variables: { address: props.address.toLowerCase() },
    pollInterval: 2500,
  });

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
      key: "tokenBalance",
      dataIndex: "tokenBalance",
      render: record => <p>{record}</p>,
    },
    {
      title: "Actions",
      // key: 'actions',
      render: record => (
        <div>
          <Button
            disabled={record.owner.toLowerCase() !== props.address.toLowerCase()}
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
            disabled={
              record.beneficiary.toLowerCase() !== props.address.toLowerCase() ||
              ts < record.deadline ||
              record.value === 0
            }
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
          <Button
            disabled={record.owner.toLowerCase() !== props.address.toLowerCase()}
            onClick={
              () => {
                const index = record.index - 1;
                props.willSelector(index);
              }
              //
            }
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  return (
    <>
      <div>
        <Radio.Group
          onChange={e => {
            setQuery(e.target.value);
          }}
          value={query}
        >
          <Radio style={radioStyle} value="All">
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
        {data ? <Table dataSource={data.wills} columns={willsColumns} rowKey="index" /> : "Loading.."}

        <Divider />
        <span>Current timestamp: {ts || "loading.."}</span>
        <br />
        <div style={{ margin: 32, height: 400, border: "1px solid #888888", textAlign: "left" }}>
          <GraphiQL fetcher={graphQLFetcher} docExplorerOpen query={EXAMPLE_GRAPHQL} />
        </div>
      </div>
    </>
  );
}

export default Manage;
