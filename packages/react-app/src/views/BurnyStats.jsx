import { gql, useQuery } from "@apollo/client";
import { Button, Input, Table, Typography, Statistic, Row, Col } from "antd";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import React, { useState } from "react";
import { Address } from "../components";
import { BurnyBoyList } from "./BurnyBoyList";
const { ethers } = require("ethers");

function BurnyStats({ data, loading, contractAddress, setBurnyBoyFilters, mainnetProvider, blockExplorer }) {
  return (
    <>
      {data ? (
        <>
          <Row gutter="8" justify="center">
            <Col>
              <Statistic title="BurnyBoys" value={data.block.burnyBoyTotal} />
            </Col>
            <Col>
              <Statistic title="Minters" value={data.block.minterTotal} />
            </Col>
            <Col>
              <Statistic
                title="Min Basefee"
                value={Number(ethers.utils.formatUnits(data.block.minBaseFee, "gwei")).toFixed(1)}
              />
            </Col>
            <Col>
              <Statistic
                title="Max Basefee"
                value={Number(ethers.utils.formatUnits(data.block.maxBaseFee, "gwei")).toFixed(1)}
              />
            </Col>
          </Row>
          <div style={{ padding: 12 }}>...</div>
          <Typography.Title>Burniest Boy</Typography.Title>
          <BurnyBoyList
            data={data}
            burnyBoys={data && [data.block.maxBaseFeeBurnyBoy]}
            contractAddress={contractAddress}
            setBurnyBoyFilters={setBurnyBoyFilters}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
          />
          <Typography.Title>Ice cold</Typography.Title>
          <BurnyBoyList
            data={data}
            burnyBoys={data && [data.block.minBaseFeeBurnyBoy]}
            contractAddress={contractAddress}
            setBurnyBoyFilters={setBurnyBoyFilters}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
          />
        </>
      ) : (
        <Typography>{loading ? "Loading..." : deployWarning}</Typography>
      )}
    </>
  );
}

export default BurnyStats;
