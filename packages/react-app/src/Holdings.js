import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useQuery } from "react-apollo";
import { HOLDINGS_QUERY, HOLDINGS_MAIN_QUERY } from "./apollo/queries";
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { isBlacklisted } from "./helpers";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Divider, Switch, Button, Empty, Popover, Form, notification } from "antd";
import { SendOutlined, UploadOutlined, SearchOutlined, ShareAltOutlined } from "@ant-design/icons";
import { AddressInput, Address, Loader } from "./components";
import SendInkForm from "./SendInkForm.js";
import UpgradeInkButton from "./UpgradeInkButton.js";

const mainClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_MAINNET,
  cache: new InMemoryCache(),
})

export default function Holdings(props) {
  const [tokens, setTokens] = useState([]);
  const [myCreationOnly, setmyCreationOnly] = useState(true);
  const [searchArtist] = Form.useForm();
  const history = useHistory();

  const { loading: loadingMain, error: errorMain, data: dataMain } = useQuery(HOLDINGS_MAIN_QUERY, {
    variables: { owner: props.address },
    client: mainClient
  });

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
      if (isBlacklisted(token.ink.jsonUrl)) return;
      let _token = token;
      _token.ink.metadata = await getMetadata(token.ink.jsonUrl);
      setTokens((tokens) => [...tokens, _token]);
    });
  };

  const handleFilter = () => {
    setmyCreationOnly((myCreationOnly) => !myCreationOnly);
    setTokens([])
    !myCreationOnly
      ? getTokens(data.tokens)
      : getTokens(
          data.tokens
            .filter(
              (token) =>
                token.ink.artist.address === props.address.toLowerCase()
            )
            .reverse()
        );
  };

  const search = async (values) => {
    try {
      const newAddress = ethers.utils.getAddress(values["address"]);
      history.push("/artist/"+newAddress);
    } catch (e) {
      console.log("not an address");
      notification.open({
        message: "📛 Not a valid address!",
        description: "Please try again"
      });
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const searchForm = (
    <Row style={{ justifyContent: "center" }}>
      <Form
        form={searchArtist}
        layout={"inline"}
        name="searchArtist"
        onFinish={search}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Search for an Address or ENS" }]}
        >
          <AddressInput
            ensProvider={props.mainnetProvider}
            placeholder={"to address"}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            <SearchOutlined />
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );

  const SearchArtist = () => {
    return (
    <Popover content={searchForm} title="Search artist">
      <Button type="secondary" disabled={loading}>
        Artist <SearchOutlined />
      </Button>
    </Popover>
  );
}

  useEffect(() => {
    data ? getTokens(data.tokens) : console.log("loading");
  }, [data]);

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
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}><SearchArtist/></Col>
        <Col span={12}>
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
                  />
                  </Row>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
