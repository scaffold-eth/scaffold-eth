import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Typography } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useEventListener } from "eth-hooks/events/useEventListener";

function OldEnglish({
  readContracts,
  mainnetProvider,
  blockExplorer,
  totalSupply,
  DEBUG,
  writeContracts,
  tx,
  address,
  localProvider,
  oldEnglishContract,
}) {
  const drinks = useEventListener(readContracts, oldEnglishContract, "Drink", localProvider, 1);
  console.log(drinks);

  return (
    <div style={{ margin: "auto", paddingBottom: 32 }}>
      <List
        size="large"
        locale={{ emptyText: `waiting for sips...` }}
        dataSource={drinks.sort((a, b) => b.blockNumber - a.blockNumber)}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender} style={{ justifyContent: "center" }}>
              {item.args.sender == item.args.drinker ? (
                <Typography.Text style={{ fontSize: 28 }}>
                  {`🍻🍻🍻 `}
                  <Address address={item.args.sender} ensProvider={mainnetProvider} style={{ fontSize: 24 }} />
                </Typography.Text>
              ) : (
                <Typography.Text style={{ fontSize: 28 }}>
                  {`🍻🍻🍻 `}
                  <Address address={item.args.sender} ensProvider={mainnetProvider} fontSize={24} />
                  {` => `}
                  <Address address={item.args.drinker} ensProvider={mainnetProvider} fontSize={24} />
                </Typography.Text>
              )}
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default OldEnglish;
