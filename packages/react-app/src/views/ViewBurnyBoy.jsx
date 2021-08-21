import { Alert, Button, Col, Menu, Row, List, Card, Typography, Collapse, Space, Breadcrumb } from "antd";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams, Redirect, Link } from "react-router-dom";
import { Account, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch, Address, AddressInput } from "../components";
import { INFURA_ID, NETWORK, NETWORKS, generateSVG } from "../constants";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useGasPrice,
  useOnBlock,
  useUserSigner,
} from "../hooks";

const { ethers } = require("ethers");

function ViewBurnyBoy({ readContracts, blockExplorer, mainnetProvider, targetNetwork, totalSupply }) {
  let { id } = useParams();
  const fetchedId = useRef();

  //const rawTokenURI = useContractReader(readContracts, "BurnNFT", "tokenURI", [id]);
  const [tokenURI, setTokenURI] = useState();
  useEffect(() => {
    const getTokenData = async () => {
      let rawTokenURI = await readContracts.BurnNFT.tokenURI(id);

      if (rawTokenURI) {
        const STARTS_WITH = "data:application/json;base64,";
        let tokenURIJSON = JSON.parse(atob(rawTokenURI.slice(STARTS_WITH.length)));
        setTokenURI(tokenURIJSON);
        fetchedId.current = id;
        console.log(tokenURIJSON);
      }
    };
    if (id && readContracts && id !== fetchedId.current) getTokenData();
  }, [id, readContracts]);

  const tokenView = tokenURI ? (
    <>
      <div>
        {id !== "1" && <Link to={`/token/${parseInt(id) - 1}`}>{"<"}</Link>}
        <span style={{ fontSize: 24, marginRight: 8 }}>{tokenURI.name}</span>
        {id !== totalSupply.toString() && <Link to={`/token/${parseInt(id) + 1}`}>></Link>}
      </div>
      <img src={tokenURI && tokenURI.image} height="200" alt="" />

      <div style={{ padding: 4 }}>
        <p>
          <span>Owner: </span>
          <Address address={tokenURI.owner} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
        </p>
        <p>
          <a
            href={`https://${targetNetwork.name == "rinkeby" ? `testnets.` : ""}opensea.io/assets/${
              readContracts.BurnNFT.address
            }/${id}`}
            target="_blank"
          >
            OpenSea
          </a>
          <span>{` / `}</span>
          <a href={`${blockExplorer}/token/${readContracts.BurnNFT.address}?a=${id}`} target="_blank">
            Etherscan
          </a>
        </p>
        <p>{tokenURI.description}</p>
        {/*<p>{item.uri.attributes[0]["value"]}</p>*/}
        {/*<img src={url} height="200" alt="" />*/}
      </div>
    </>
  ) : (
    <span>loading...</span>
  );

  return (
    <div>{id && totalSupply && parseInt(id) > parseInt(totalSupply.toString()) ? <Redirect to="/" /> : tokenView}</div>
  );
}

export default ViewBurnyBoy;
