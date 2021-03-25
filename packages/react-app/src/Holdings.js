import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "react-apollo";
import { HOLDINGS_QUERY, HOLDINGS_MAIN_QUERY, HOLDINGS_MAIN_INKS_QUERY } from "./apollo/queries";
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { isBlocklisted } from "./helpers";
import { useParams, Link, useHistory } from "react-router-dom";
import { Row, Col, Divider, Switch, Button, Empty, Popover } from "antd";
import { SendOutlined, RocketOutlined } from "@ant-design/icons";
import { AddressInput, Loader } from "./components";
import SendInkForm from "./SendInkForm.js";
import UpgradeInkButton from "./UpgradeInkButton.js";
import Blockies from "react-blockies";

const mainClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_MAINNET,
  cache: new InMemoryCache(),
})

export default function Holdings(props) {

  let { address } = useParams();

  address = address ? address : props.address

  const [ens, setEns] = useState()

  useEffect(()=> {
    const getEns = async () => {
    let _ens = await props.mainnetProvider.lookupAddress(address)
    setEns(_ens)
  }
    getEns()
  },[address])

  const [holdings, setHoldings] = useState() // Array with the token id's currently held
  const [tokens, setTokens] = useState({}); // Object holding information about relevant tokens
  const [myCreationOnly, setmyCreationOnly] = useState(true);

  const [blockNumber, setBlockNumber] = useState(0)
  const [data, setData] = useState() // Data filtered for latest block update that we have seen

  const { loading: loadingMain, error: errorMain, data: dataMain } = useQuery(HOLDINGS_MAIN_QUERY, {
    variables: { owner: address },
    client: mainClient,
    pollInterval: 4000
  });

  const [mainInksQuery, { loading: loadingMainInks, error: errorMainInks, data: dataMainInks }] = useLazyQuery(HOLDINGS_MAIN_INKS_QUERY)

  const { loading, error, data: dataRaw } = useQuery(HOLDINGS_QUERY, {
    variables: { owner: address },
    pollInterval: 4000
  });

  const getMetadata = async (jsonURL) => {
    const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
    const data = await response.json();
    return data;
  };

  const getTokens = (_data) => {
    _data.forEach(async (token) => {
      if (isBlocklisted(token.ink.jsonUrl)) return;
      let _token = token;
      _token.network = 'xDai'
      _token.ink.metadata = await getMetadata(token.ink.jsonUrl);
      //setTokens((tokens) => [...tokens, _token]);
      let _newToken = {}
      _newToken[_token.id] = _token
      setTokens((tokens) => ({...tokens, ..._newToken}));
    });
    updateHoldings((data && data.tokens)?data.tokens:[], (dataMain && dataMain.tokens)?dataMain.tokens:[])
  };

  const getMainInks = async (_data) => {
    let _inkList = _data.map(a => a.ink);
    let mainInks = await mainInksQuery({
      variables: { inkList: _inkList }
    })
  };


  const getMainTokens = (_data, inks, ownerIsArtist = false) => {
    _data.forEach(async (token) => {
      if (isBlocklisted(token.jsonUrl)) return;
      let _token = Object.assign({}, token);
      const _tokenInk = inks.filter(ink => ink.id === _token.ink)
      _token.ink = _tokenInk[0]
      if (ownerIsArtist && _token.ink.artist.address !== address.toLowerCase()) return;
      _token.network = 'Mainnet'
      _token.ink.metadata = await getMetadata(token.jsonUrl);
      let _newToken = {}
      _newToken[_token.id] = _token
      setTokens((tokens) => ({...tokens, ..._newToken}));
    });
    updateHoldings((data && data.tokens)?data.tokens:[], (dataMain && dataMain.tokens)?dataMain.tokens:[])
    console.log(tokens)
  };

  const updateHoldings = (_tokens, _mainTokens) => {
    let tokenList = _tokens.map(i => i.id)
    let mainTokenList = _mainTokens.map(i => i.id)
    setHoldings([...tokenList, ...mainTokenList])
    console.log(holdings)
  }

  const handleFilter = () => {
    setmyCreationOnly((myCreationOnly) => !myCreationOnly);
    setTokens({})
    if(!myCreationOnly) {
        getTokens(data.tokens)
        getMainTokens(dataMain.tokens, dataMainInks.inks)
      }
      else {
        getTokens(
          data.tokens
            .filter(
              (token) =>
                token.ink.artist.address === address.toLowerCase()
            )
            .reverse()
        );
        if(dataMain.tokens && dataMain.inks) {
          getMainTokens(dataMain.tokens, dataMainInks.inks, true)
        }
      }
  };

  useEffect(() => {

    const getHoldings = async (_data) => {
      let _blockNumber = parseInt(_data.metaData.value)
      console.log(blockNumber, _blockNumber)
      if(_blockNumber >= blockNumber) {
      setData(_data)
      setBlockNumber(_blockNumber)
    }
    };

    dataRaw ? getHoldings(dataRaw) : console.log("loading data");
  }, [dataRaw]);

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
    if(!address || (data && data.tokens && data.tokens.length <= 0)){
      return <Empty/>
    } else {
    return `Error! ${error.message}`;
    }
  }

  return (
    <div style={{maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
    <Blockies
      seed={address.toLowerCase()}
      size={12} scale={6}
      className="holdings_blockie"
    />
    <h2 style={{ margin: 10 }}>{ens ? ens : address.slice(0, 6)}</h2>
      <Row>
        <Col span={12}>
          <p style={{ margin: 0 }}>
            <b>All Holdings:</b> {holdings ? holdings.length : 0}
          </p>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>
            <b>{`${props.address == address ? 'My' : "Holder's"} inks: `}</b>
            {(holdings && tokens)
              ? holdings.filter(
                  (id) =>
                    id in tokens && tokens[id].ink.artist.address === address.toLowerCase()
                ).length
              : 0}
          </p>
        </Col>
      </Row>

      <Divider />
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
          {`Created by ${props.address == address ? 'me' : 'holder'}:  `}
          <Switch defaultChecked={!myCreationOnly} onChange={handleFilter} />
        </Col>
      </Row>
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
          {holdings
            ? holdings.filter((id) => id in tokens).map((id) => (
                <li
                  key={id}
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
                  to={{pathname: "/ink/"+tokens[id].ink.id}}
                  style={{ color: "black" }}
                >
                    <img
                      src={tokens[id].ink.metadata.image}
                      alt={tokens[id].ink.metadata.name}
                      width="150"
                      style={{
                        border: "1px solid #e5e5e6",
                        borderRadius: "10px"
                      }}
                    />
                    <h3
                      style={{ margin: "10px 0px 5px 0px", fontWeight: "700" }}
                    >
                      {tokens[id].ink.metadata.name.length > 18
                        ? tokens[id].ink.metadata.name.slice(0, 15).concat("...")
                        : tokens[id].ink.metadata.name}
                    </h3>

                    <p style={{ color: "#5e5e5e", margin: "0", zoom: 0.8 }}>
                      Edition: {tokens[id].ink.count}/{tokens[id].ink.limit}
                    </p>
                  </Link>
                  <Divider style={{ margin: "10px 0" }} />
                  <Row justify={"space-between"}>
                  {tokens[id].network==="xDai"
                  ? <>
                  <Popover content={
                    <SendInkForm tokenId={tokens[id].id} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} transactionConfig={props.transactionConfig}/>
                  }
                  title="Send Ink">
                    <Button size="small" type="secondary" style={{margin:4,marginBottom:12}}><SendOutlined/> Send</Button>
                  </Popover>
                  <UpgradeInkButton
                    tokenId={tokens[id].id}
                    injectedProvider={props.injectedProvider}
                    gasPrice={props.gasPrice}
                    upgradePrice={props.upgradePrice}
                    transactionConfig={props.transactionConfig}
                    buttonSize="small"
                  /></>
                  : <Button type="primary" style={{ margin:8, background: "#722ed1", borderColor: "#722ed1"  }} onClick={()=>{
                      console.log("item",id)
                      window.open("https://opensea.io/assets/0xc02697c417ddacfbe5edbf23edad956bc883f4fb/"+id)
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
