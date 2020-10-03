import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { HOLDINGS_QUERY } from "./apollo/queries";
import { isBlacklisted } from "./helpers";
import { Row, Col, Divider, Switch, Button } from "antd";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";

export default function Holdings(props) {
  let [tokens, setTokens] = useState([]);
  let [myCreationOnly, setmyCreationOnly] = useState(true);
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

    !myCreationOnly
      ? setTokens(data.tokens)
      : setTokens(
          data.tokens
            .filter(
              (token) =>
                token.ink.artist.address === props.address.toLowerCase()
            )
            .reverse()
        );
  };

  useEffect(() => {
    data ? getTokens(data.tokens) : console.log("loading");
  }, [data]);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
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
        <Col span={24} offset={8}>
          Created by me only:{" "}
          <Switch defaultChecked={!myCreationOnly} onChange={handleFilter} />
        </Col>
      </Row>
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
          {tokens
            ? tokens.map((token) => (
                <li
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    margin: 7,
                    padding: 10,
                    border: "1px solid #e5e5e6",
                    borderRadius: "10px",
                    fontWeight: "bold"
                  }}
                >
                  <a
                    href={token.ink.metadata.external_url}
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
                  </a>
                  <Divider style={{ margin: "10px" }} />
                  <Row justify={"space-between"}>
                    <Button size="small">
                      <SendOutlined /> Send
                    </Button>
                    <Button size="small">
                      <UploadOutlined /> Upgrade
                    </Button>
                  </Row>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
