import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-apollo";
import { ARTISTS_QUERY } from "./apollo/queries"
import { isBlacklisted } from "./helpers";
import { Row, Col, Divider } from "antd";
import Blockies from "react-blockies";

export default function Artist(props) {
  let { address } = useParams();
  let [inks, setInks] = useState([]);
  const { loading, error, data } = useQuery(ARTISTS_QUERY, {
    variables: { address: address }
  });

  useEffect(() => {
    const getMetadata = async (jsonURL) => {
      const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
      const data = await response.json();
      return data;
    };

    const getInks = (data) => {
      data.forEach(async (ink) => {
        if (isBlacklisted(ink.jsonUrl)) return;
        let _ink = ink;
        _ink.metadata = await getMetadata(ink.jsonUrl);
        setInks((inks) => [...inks, _ink]);
      });
    };

    data ? getInks(data.artists[0].inks) : console.log("loading");
  }, [data]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ width: 600, margin: "0 auto" }}>
      <div>
        <Row style={{ textAlign: "center" }}>
          <Col span={12} offset={6}>
            <Blockies
              seed={address.toLowerCase()}
              size={25}
              className="artist_blockie"
            />
            <h2 style={{ margin: 10 }}>{address.slice(0, 12)}</h2>
            <Row>
              <Col span={12}>
                <p style={{ margin: 0 }}>
                  <b>Inks:</b> {data ? data.artists[0].inkCount : 0}
                </p>
              </Col>
              <Col span={12}>
                <p style={{ margin: 0 }}>
                  <b>Total sales:</b> $
                  {inks
                    .filter((ink) => ink.sales.length)
                    .map((ink) => ink.sales)
                    .map((e) => e.flatMap((e) => Number.parseInt(e.price, 0)))
                    .flatMap((e) => e)
                    .reduce((a, b) => a + b, 0) / 1e18}
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Divider />
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
          {inks
            ? inks.map((ink) => (
                <li
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    margin: 10,
                    padding: 10,
                    border: "1px solid #e5e5e6",
                    borderRadius: "10px"
                  }}
                >
                  <a
                    href={ink.metadata.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "black" }}
                  >
                    <img
                      src={ink.metadata.image}
                      alt={ink.metadata.name}
                      width="150"
                      style={{
                        border: "1px solid #e5e5e6",
                        borderRadius: "10px"
                      }}
                    />
                    <h3 style={{ fontWeight: "bold", margin: "10px 0" }}>
                      {ink.metadata.name.length > 18
                        ? ink.metadata.name.slice(0, 15).concat("...")
                        : ink.metadata.name}
                    </h3>
                    <p style={{ color: "#5e5e5e", margin: "0" }}>
                      Last sold: $
                      {ink.sales.length ? ink.sales[0].price / 1e18 : 0}
                    </p>
                    <p style={{ color: "#5e5e5e", margin: "0" }}>
                      Edition: {ink.count}/{ink.limit}
                    </p>
                  </a>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
