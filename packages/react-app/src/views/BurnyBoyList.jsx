import { generateSVG } from "../helpers";
import { useParams, Link, useHistory, Redirect } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { List } from "antd";
import { Address, AddressInput } from "../components";
const { ethers } = require("ethers");

export function BurnyBoyList({
  burnyBoys,
  data,
  contractAddress,
  setBurnyBoyFilters,
  mainnetProvider,
  blockExplorer,
  search,
}) {
  let history = useHistory();
  let { viewAddress } = useParams();

  if (viewAddress && !ethers.utils.isAddress(viewAddress)) {
    return <Redirect to="/" />;
  }

  useEffect(() => {
    if (viewAddress) {
      setBurnyBoyFilters({ owner: viewAddress.toLowerCase() });
    }

    return function cleanup() {
      if (viewAddress) {
        setBurnyBoyFilters({});
      }
    };
  }, [viewAddress]);

  return data ? (
    <div style={{ width: 600, margin: "auto" }}>
      {search && (
        <AddressInput
          blockExplorer={blockExplorer}
          mainnetProvider={mainnetProvider}
          placeholder={viewAddress}
          onChange={newAddress => {
            console.log(newAddress);
            if (ethers.utils.isAddress(newAddress)) {
              history.push("/holdings/" + newAddress);
            }
          }}
        />
      )}
      <List
        dataSource={burnyBoys}
        renderItem={item => {
          console.log(item);
          const id = item.id;
          const url = generateSVG({
            tokenId: id,
            rotation: (parseInt(item.baseFee) + parseInt(id) * 30) % 360,
            baseFee: item.baseFee,
            maxBaseFee: data.block.maxBaseFee,
            minBaseFee: data.block.minBaseFee,
            owner: item.owner,
          });

          return (
            <List.Item key={id} extra={<img src={url} height="200" alt="" />}>
              <List.Item.Meta
                title={
                  <div>
                    <span style={{ fontSize: 16, marginRight: 8 }}>
                      {" "}
                      <Link to={`/token/${id}`}>{`Burny Boy #${id}`}</Link>
                    </span>
                  </div>
                }
                description={
                  <div style={{ padding: 4 }}>
                    <p>{`When this was minted on ${new Date(parseInt(item.createdAt) * 1000).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}, the basefee was ${Math.floor(
                      Number(ethers.utils.formatUnits(item.baseFee, "gwei")),
                    )} Gwei`}</p>
                    <p>
                      <span>{`Owner: `}</span>
                      <Address
                        address={item.owner}
                        ensProvider={mainnetProvider}
                        blockExplorer={blockExplorer}
                        fontSize={16}
                      />
                    </p>
                    <p>
                      <a href={`https://opensea.io/assets/${contractAddress}/${id}`} target="_blank">
                        OpenSea
                      </a>
                      <span>{` / `}</span>
                      <a href={`${blockExplorer}/token/${contractAddress}?a=${id}`} target="_blank">
                        Etherscan
                      </a>
                    </p>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  ) : (
    <span>loading...</span>
  );
}
