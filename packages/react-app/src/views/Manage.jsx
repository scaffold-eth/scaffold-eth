/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Button, Typography, Table, Input, List } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';
import tryToDisplay from "../components/Contract/utils";


  const highlight = { marginLeft: 4, marginRight: 8, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }

function Manage(props) {

  function graphQLFetcher(graphQLParams) {
    return fetch(props.subgraphUri, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

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

  // const purposeColumns = [
  //   {
  //     title: 'Purpose',
  //     dataIndex: 'purpose',
  //     key: 'purpose',
  //   },
  //   {
  //     title: 'Sender',
  //     key: 'id',
  //     render: (record) => <Address
  //                       value={record.sender.id}
  //                       ensProvider={props.mainnetProvider}
  //                       fontSize={16}
  //                     />
  //   },
  //   {
  //     title: 'createdAt',
  //     key: 'createdAt',
  //     dataIndex: 'createdAt',
  //     render: d => (new Date(d * 1000)).toISOString()
  //   },
  //   ];
  // const deployWarning = (
  //   <div style={{marginTop:8,padding:8}}>{"Warning: 🤔 Have you deployed your subgraph yet?"}</div>
  // )


  var ts = Math.floor(new Date().getTime()/1000);

  const value = 1000000;
  const valuetest = (index) => {props.readContracts.Noun.ethBalance(index)};


  return (
      <>
          <h2>Wills created:</h2>
          <List
            bordered
            dataSource={props.setCreate}
            renderItem={(item) => {
              return (
                <List.Item key={item.blockNumber+"_"+item.owner+"_"+item.beneficiary}>
                  Will index: {item.index.toNumber()} -
                  owner:
                  <Address
                      value={item.owner}
                      ensProvider={props.mainnetProvider}
                      fontSize={16}
                    /> -
                    timeLock:{item.deadline.toNumber()} -
                    beneficiary:
                  <Address
                      value={item.beneficiary}
                      ensProvider={props.mainnetProvider}
                      fontSize={16}
                    /> -
                    <Button onClick={async() =>{
                       let test = await props.readContracts.Noun.ethBalance(item.index);
                       console.log(tryToDisplay(test))
                    }
                    }>
                    Balance ETH (console)</Button>


                  -  {item.owner == props.address ?

                    <Button onClick={async() =>{
                                    await props.tx({
                                        to: props.writeContracts.Noun.address,
                                        data: props.writeContracts.Noun.interface.encodeFunctionData("defundWillETH(uint256, address payable , uint256)",[item.index,props.address,value])
                                      });
                                  }
                                  }>

                                  withdraw</Button>
                      :null}

                  =>
                {item.beneficiary == props.address ?
                  <Button disabled={ts<item.deadline.toNumber()} onClick={async() =>{
                    await props.tx({
                        to: props.writeContracts.Noun.address,
                        data: props.writeContracts.Noun.interface.encodeFunctionData("BenefitETH(uint256, address payable , uint256)",[item.index,props.address,value])
                      });
                  }
                  }>
                  claim</Button>
                  :null}


                </List.Item>
              )
            }}
          />

          <div>
            The Graph query

{/*            {data?<Table dataSource={data.purposes} columns={purposeColumns} rowKey={"id"} />:<Typography>{(loading?"Loading...":deployWarning)}</Typography>}

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
