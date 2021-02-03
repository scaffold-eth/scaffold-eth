/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Radio, Button, Typography, Table, Input, List, Divider } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';
import { parseEther, formatEther } from "@ethersproject/units";
import {  Redirect } from "react-router-dom";


const highlight = { marginLeft: 4, marginRight: 8, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }

function Manage(props) {
  const [query, setQuery] = useState('All');

  function graphQLFetcher(graphQLParams) {
    return fetch(props.subgraphUri, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
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

  const queries={'All':`
  {
    wills(first: 25, orderBy: deadline, orderDirection: desc) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `
  ,'owner':`
  query Will($address:Bytes!){
      wills(first: 25, orderBy: deadline, orderDirection: desc, where:{owner:$address}) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `,'beneficiary':`
  query Will($address:Bytes!){
      wills(first: 25, orderBy: deadline, orderDirection: desc,where:{beneficiary:$address}) {
      index
      owner
      beneficiary
      deadline
      value
    }
  }
  `}


  const QUERY_GQL = gql(queries[query]);
  const { loading, data } = useQuery(QUERY_GQL,{variables:{address:props.address.toLowerCase()}, pollInterval: 2500});

  const willsColumns = [
    {
      title: 'Will',
      dataIndex: 'index',
      key: 'index',
      render: (record) => <p>{record}</p>
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
      render: (record) => (new Date(record * 1000)).toISOString()
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
      key: 'value',
      dataIndex: 'value',
      render: (record) => <p>{formatEther(record)}</p>
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
      key: 'tokenBalance',
      dataIndex: 'tokenBalance',
      render: (record) => <p>{record}</p>
    },
    {
      title: 'Actions',
      // key: 'actions',
      render: (record) =>
        <div>
          <Button
            disabled={record.owner.toLowerCase() != props.address.toLowerCase()}
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
            disabled={record.beneficiary.toLowerCase()!= props.address.toLowerCase()||ts<record.deadline||record.value==0}
            onClick={async() =>{
              let totalBalance = await props.readContracts.Noun.ethBalance(record.index-1);
              await props.tx({
                  to: props.writeContracts.Noun.address,
                  data: props.writeContracts.Noun.interface.encodeFunctionData("BenefitETH(uint256, address payable , uint256)",[(record.index-1),props.address,totalBalance])
                });
              }
            }>
            claim</Button>
          <Button
              disabled={record.owner.toLowerCase()!= props.address.toLowerCase()}
              onClick={()=>{
                let index = record.index-1;
                props.willSelector(index);
              }
                //
              }>
              Update</Button>

        </div>
    },
    ];

  var ts = Math.floor(new Date().getTime()/1000);

  const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      };

  return (
      <>
      <div>
      <Radio.Group onChange={(e)=>{setQuery(e.target.value)}} value={query}>
      <Radio style={radioStyle} value={'All'}>
      All wills
      </Radio>
      <Radio style={radioStyle} value={'owner'}>
      My wills
      </Radio>
      <Radio style={radioStyle} value={'beneficiary'}>
      My inheritances
      </Radio>
      </Radio.Group>
      <Divider />
      {data?<Table dataSource={data.wills} columns={willsColumns} rowKey={"index"} />:'Loading..'}

      <Divider />
      <span >Current timestamp: {ts?ts:'loading..'}</span><br />
        <div style={{margin:32, height:400, border:"1px solid #888888", textAlign:'left'}}>
          <GraphiQL fetcher={graphQLFetcher} docExplorerOpen={true} query={EXAMPLE_GRAPHQL}/>
        </div>
      </div>
    </>
  );
}

export default Manage;
