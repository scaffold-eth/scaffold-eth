/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Button, Typography, Table, Input, List, Divider } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';
import tryToDisplay from "../components/Contract/utils";
import { parseEther, formatEther } from "@ethersproject/units";


  const highlight = { marginLeft: 4, marginRight: 8, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }

function Manage(props) {

  // function graphQLFetcher(graphQLParams) {
  //   return fetch(props.subgraphUri, {
  //     method: 'post',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(graphQLParams),
  //   }).then(response => response.json());
  // }

  const EXAMPLE_GRAPHQL = `
  {
    wills(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      createdAt
      owner
      asset
      amount
    }
  }
  `
  // const EXAMPLE_GQL = gql(EXAMPLE_GRAPHQL)
  // const { loading, data } = useQuery(EXAMPLE_GQL,{pollInterval: 2500});

  const willsColumns = [
    {
      title: 'Will',
      dataIndex: 'index',
      key: 'index',
      render: (record) => <p>{record.toNumber()}</p>
    },
    {
      title: 'Owner',
      key: 'owner',
      render: (record) => <Address
                        value={record.owner}
                        ensProvider={props.mainnetProvider}
                        fontSize={16}
                      />
    },
    {
      title: 'TimeLock',
      key: 'deadline',
      dataIndex: 'deadline',
      render: (record) => (new Date(record.toNumber() * 1000)).toISOString()
    },
    {
      title: 'Beneficiary',
      key: 'beneficiary',
      render: (record) => <Address
                        value={record.beneficiary}
                        ensProvider={props.mainnetProvider}
                        fontSize={16}
                      />
    },
    {
      title: 'Balance ETH',
      key: 'ethBalance',
      dataIndex: 'ethBalance',
      // render: (record) => <p>{record.ethBalance}</p>
    },
    {
      title: 'Token',
      key: 'tokenAddress',
      render: (record) => <Address
                        value={record.tokenAddress}
                        ensProvider={props.mainnetProvider}
                        fontSize={16}
                      />
    },
    {
      title: 'Amount Token',
      key: 'tokenValue',
      dataIndex: 'tokenValue',
      // render: (record) => <p>{record.tokenBalance}</p>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) =>
        <div>
          <Button
            disabled={record.owner != props.address}
            onClick={async() =>{
                          let totalBalance = await props.readContracts.Noun.ethBalance(record.index-1);
                          await props.tx({
                                  to: props.writeContracts.Noun.address,
                                  data: props.writeContracts.Noun.interface.encodeFunctionData("defundWillETH(uint256, address payable , uint256)",[(record.index-1),props.address,totalBalance])
                                });
                            }
                            }>
                      withdraw</Button>

          <Button
            disabled={record.beneficiary!= props.address||ts<record.deadline.toNumber()}
            onClick={async() =>{
              let totalBalance = await props.readContracts.Noun.ethBalance(record.index-1);
              await props.tx({
                  to: props.writeContracts.Noun.address,
                  data: props.writeContracts.Noun.interface.encodeFunctionData("BenefitETH(uint256, address payable , uint256)",[(record.index-1),props.address,totalBalance])
                });
              }
            }>
            claim</Button>

        <Button onClick={
          async() =>{
            let bal = await props.readContracts.Noun.ethBalance(record.index-1);
            console.log(formatEther(bal));
          }
        }>Check balance
        </Button>

        </div>
    },

    ];
  const deployWarning = (
    <div style={{marginTop:8,padding:8}}>{"Warning: 🤔 is it any event fired yet?"}</div>
  )


  var ts = Math.floor(new Date().getTime()/1000);

  const value = 1000000;
  const valuetest = (index) => {props.readContracts.Noun.ethBalance(index)};


  return (
      <>
      <span >Current timestamp: {ts?ts:'loading..'}</span>
          <h2>Wills created:</h2>
          <div>
          {props.setCreate?<Table dataSource={props.setCreate} columns={willsColumns} rowKey={"id"} />:'Loading..'}
          {/*<Typography>{(loading?"Loading...":deployWarning)}</Typography>*/}

          <Divider />
            The Graph query

{/*
            <div style={{margin:32, height:400, border:"1px solid #888888", textAlign:'left'}}>
              <GraphiQL fetcher={graphQLFetcher} docExplorerOpen={true} query={EXAMPLE_GRAPHQL}/>
            </div>
*/}
          </div>

          <div style={{padding:64}}>
          ...
          </div>
      </>
  );
}

export default Manage;
