import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "react-apollo";
import { HOLDINGS_QUERY, HOLDINGS_MAIN_QUERY, HOLDINGS_MAIN_INKS_QUERY } from "./apollo/queries";
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { isBlocklisted } from "./helpers";
import { Link } from "react-router-dom";
import { Row, Col, Divider, Switch, Button, Empty, Popover } from "antd";
import { SendOutlined, RocketOutlined } from "@ant-design/icons";
import { AddressInput, Loader } from "./components";
import SendInkForm from "./SendInkForm.js";
import UpgradeInkButton from "./UpgradeInkButton.js";

const mainClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_MAINNET,
  cache: new InMemoryCache(),
})

export default function Holdings(props) {
  const [tokens, setTokens] = useState([]);
  const [myCreationOnly, setmyCreationOnly] = useState(true);

  const { loading: loadingMain, error: errorMain, data: dataMain } = useQuery(HOLDINGS_MAIN_QUERY, {
    variables: { owner: props.address },
    client: mainClient
  });

  const [mainInksQuery, { loading: loadingMainInks, error: errorMainInks, data: dataMainInks }] = useLazyQuery(HOLDINGS_MAIN_INKS_QUERY)

  const { loading, error, data } = useQuery(HOLDINGS_QUERY, {
    variables: { owner: props.address }
  });

  const getMetadata = async (jsonURL) => {
    const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
    const data = await response.json();
    return data;
  };

  const getTokens = (data) => {
    data.forEach(async (token) => {
      if (isBlocklisted(token.ink.jsonUrl)) return;
      let _token = token;
      _token.network = 'xDai'
      _token.ink.metadata = await getMetadata(token.ink.jsonUrl);
      setTokens((tokens) => [...tokens, _token]);
    });
  };

  const getMainInks = async (data) => {
    let _inkList = data.map(a => a.ink);
    let mainInks = await mainInksQuery({
      variables: { inkList: _inkList }
    })
  };


  const getMainTokens = (data, inks, ownerIsArtist = false) => {
    data.forEach(async (token) => {
      if (isBlocklisted(token.jsonUrl)) return;
      let _token = Object.assign({}, token);
      const _tokenInk = inks.filter(ink => ink.id === _token.ink)
      _token.ink = _tokenInk[0]
      if (ownerIsArtist && _token.ink.artist.address !== props.address.toLowerCase()) return;
      _token.network = 'Mainnet'
      _token.ink.metadata = await getMetadata(token.jsonUrl);
      setTokens((tokens) => [...tokens, _token]);
    });
  };

  const handleFilter = () => {
    setmyCreationOnly((myCreationOnly) => !myCreationOnly);
    setTokens([])
    if(!myCreationOnly) {
        getTokens(data.tokens)
        getMainTokens(dataMain.tokens, dataMainInks.inks)
      }
      else {
        getTokens(
          data.tokens
            .filter(
              (token) =>
                token.ink.artist.address === props.address.toLowerCase()
            )
            .reverse()
        );
        if(dataMain.tokens && dataMain.inks) {
          getMainTokens(dataMain.tokens, dataMainInks.inks, true)
        }
      }
  };

  useEffect(() => {
    data ? getTokens(data.tokens) : console.log("loading tokens");
  }, [data]);

  useEffect(() => {
    dataMain ? getMainInks(dataMain.tokens) : console.log("loading main inks");
  }, [dataMain]);

  useEffect(() => {
    dataMain && dataMainInks ? getMainTokens(dataMain.tokens, dataMainInks.inks) : console.log("loading main tokens");
  }, [dataMainInks]);

  if (loading) return <Loader/>;
  if (error) {
    if(!props.address || (data && data.tokens && data.tokens.length <= 0)){
      return <Empty/>
    } else {
    return `Error! ${error.message}`;
    }
  }

  return (
    <div style={{maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      <Row>
        <Col span={12}>
          <p style={{ margin: 0 }}>
            <b>All Holdings:</b> {data ? data.tokens.length : 0}
          </p>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>
            <b>My Inks: </b>
            {data
              ? data.tokens.filter(
                  (token) =>
                    token.ink.artist.address === props.address.toLowerCase()
                ).length
              : 0}
          </p>
        </Col>
      </Row>

      <Divider />
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
          Created by me only:{" "}
          <Switch defaultChecked={!myCreationOnly} onChange={handleFilter} />
        </Col>
      </Row>
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
          {tokens
            ? tokens.map((token) => (
                <li
                  key={token.id}
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    margin: 4,
                    padding: 5,
                    border: "1px solid #e5e5e6",
                    borderRadius: "10px",
                    fontWeight: "bold"
                  }}
                >
                <Link
                  to={"ink/"+token.ink.id}
                  style={{ color: "black" }}
                >
                    <img
                      src={token.ink.metadata.image}
                      alt={token.ink.metadata.name}
                      width="150"
                      style={{
                        border: "1px solid #e5e5e6",
                        borderRadius: "10px"
                      }}
                    />
                    <h3
                      style={{ margin: "10px 0px 5px 0px", fontWeight: "700" }}
                    >
                      {token.ink.metadata.name.length > 18
                        ? token.ink.metadata.name.slice(0, 15).concat("...")
                        : token.ink.metadata.name}
                    </h3>

                    <p style={{ color: "#5e5e5e", margin: "0", zoom: 0.8 }}>
                      Edition: {token.ink.count}/{token.ink.limit}
                    </p>
                  </Link>
                  <Divider style={{ margin: "10px 0" }} />
                  <Row justify={"space-between"}>
                  {token.network==="xDai"
                  ? <>
                  <Popover content={
                    <SendInkForm tokenId={token.id} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} transactionConfig={props.transactionConfig}/>
                  }
                  title="Send Ink">
                    <Button size="small" type="secondary" style={{margin:4,marginBottom:12}}><SendOutlined/> Send</Button>
                  </Popover>
                  <UpgradeInkButton
                    tokenId={token.id}
                    injectedProvider={props.injectedProvider}
                    gasPrice={props.gasPrice}
                    upgradePrice={props.upgradePrice}
                    transactionConfig={props.transactionConfig}
                    buttonSize="small"
                  /></>
                  : <Button type="primary" style={{ margin:8, background: "#722ed1", borderColor: "#722ed1"  }} onClick={()=>{
                      console.log("item",token)
                      window.open("https://opensea.io/assets/0xc02697c417ddacfbe5edbf23edad956bc883f4fb/"+token.id)
                    }}>
                     <RocketOutlined />  View on OpenSea
                    </Button>

                  }
                  </Row>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
