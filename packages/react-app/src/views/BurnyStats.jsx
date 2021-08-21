import { gql, useQuery } from "@apollo/client";
import { Button, Input, Table, Typography, Statistic } from "antd";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import React, { useState } from "react";
import { Address } from "../components";
const { ethers } = require("ethers");

function BurnyStats({ data, loading }) {
  return (
    <>
      {data ? (
        <>
          <Statistic title="BurnyBoys" value={data.block.burnyBoyTotal} />
          <Statistic
            title="Max Basefee"
            value={Number(ethers.utils.formatUnits(data.block.maxBaseFee, "gwei")).toFixed(1)}
          />
        </>
      ) : (
        <Typography>{loading ? "Loading..." : deployWarning}</Typography>
      )}

      <div style={{ padding: 64 }}>...</div>
    </>
  );
}

export default BurnyStats;
