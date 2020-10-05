import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import { ARTISTS_QUERY } from "./apollo/queries"
import { isBlacklisted } from "./helpers";
import { Row, Col, Divider } from "antd";
import Blockies from "react-blockies";
import { Loader } from "./components"

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

    data !== undefined && data.artists[0] ? getInks(data.artists[0].inks) : console.log("loading");
  }, [data]);

  if (loading) return <Loader/>;
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
                  <b>Inks:</b>{" "}
                  {data.artists.length ? data.artists[0].inkCount : 0}
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
                    borderRadius: "10px",
                    fontWeight: "bold"
                  }}
                >
                <Link
                  to={{pathname: "/ink/"+ink.id}}
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
                    <h3
                      style={{ margin: "10px 0px 5px 0px", fontWeight: "700" }}
                    >
                      {ink.metadata.name.length > 18
                        ? ink.metadata.name.slice(0, 15).concat("...")
                        : ink.metadata.name}
                    </h3>

                    <Row
                      align="middle"
                      style={{ textAlign: "center", justifyContent: "center" }}
                    >
                      {(ink.mintPrice > 0 && (ink.limit === 0 || ink.count < ink.limit))
                        ? (<><p
                        style={{
                          color: "#5e5e5e",
                          margin: "0"
                        }}
                      >
                        <b>{ink.mintPrice / 1e18} </b>
                      </p>

                      <img
                        src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                        alt="xdai"
                        style={{ marginLeft: 5 }}
                      /></>)
                      : null }
                    </Row>
                    <Divider style={{ margin: "8px 0px" }} />
                    <p
                      style={{
                        color: "#5e5e5e",
                        margin: "0",
                        zoom: 0.8
                      }}
                    >

                      {ink.sales.length ? 'Last sold: $' + ink.sales[0].price / 1e18 : null}
                    </p>
                    <p style={{ color: "#5e5e5e", margin: "0", zoom: 0.8 }}>
                      {'Edition: ' + ink.count + (ink.limit>0?'/' + ink.limit:'')}
                    </p>
                  </Link>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
