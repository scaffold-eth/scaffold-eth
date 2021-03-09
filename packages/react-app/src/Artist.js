import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useParams, Link, useHistory } from "react-router-dom";
import { useQuery } from "react-apollo";
import { ARTISTS_QUERY } from "./apollo/queries";
import { isBlocklisted } from "./helpers";
import { Row, Col, Divider, Button, Form, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Blockies from "react-blockies";
import { AddressInput, Loader } from "./components";

export default function Artist(props) {
  const { address } = useParams();
  const [inks, setInks] = useState([]);
  const [searchArtist] = Form.useForm();
  const history = useHistory();

  const { loading, error, data } = useQuery(ARTISTS_QUERY, {
    variables: { address: address },
  });

  const search = async (values) => {
    try {
      const newAddress = ethers.utils.getAddress(values["address"]);
      setInks([]);
      history.push("/artist/" + newAddress);
    } catch (e) {
      console.log("not an address");
      notification.open({
        message: "📛 Not a valid address!",
        description: "Please try again",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const SearchForm = () => {
    return (
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
            rules={[
              { required: true, message: "Search for an Address or ENS" },
            ]}
          >
            <AddressInput
              ensProvider={props.mainnetProvider}
              placeholder={"Search artist"}
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
  };

  useEffect(() => {
    const getMetadata = async (jsonURL) => {
      const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
      const data = await response.json();
      return data;
    };

    const getInks = (data) => {
      setInks([]);
      data.forEach(async (ink) => {
        if (isBlocklisted(ink.jsonUrl)) return;
        let _ink = ink;
        _ink.metadata = await getMetadata(ink.jsonUrl);
        setInks((inks) => [...inks, _ink]);
      });
    };

    data !== undefined && data.artists[0]
      ? getInks(data.artists[0].inks)
      : console.log("loading");
  }, [data]);

  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
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
      <Row style={{ marginBottom: 20 }}>
        <Col span={24}>
          <SearchForm />
        </Col>
      </Row>
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
          {inks
            ? inks.map((ink) => (
                <li
                  key={ink.id}
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    margin: 10,
                    padding: 10,
                    border: "1px solid #e5e5e6",
                    borderRadius: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <Link
                    to={{ pathname: "/ink/" + ink.id }}
                    style={{ color: "black" }}
                  >
                    <img
                      src={ink.metadata.image}
                      alt={ink.metadata.name}
                      width="150"
                      style={{
                        border: "1px solid #e5e5e6",
                        borderRadius: "10px",
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
                      {ink.mintPrice > 0 &&
                      (ink.limit === 0 || ink.count < ink.limit) ? (
                        <>
                          <p
                            style={{
                              color: "#5e5e5e",
                              margin: "0",
                            }}
                          >
                            <b>{ink.mintPrice / 1e18} </b>
                          </p>

                          <img
                            src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                            alt="xdai"
                            style={{ marginLeft: 5 }}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                            alt="xdai"
                            style={{ marginLeft: 5, visibility: "hidden" }}
                          />
                        </>
                      )}
                    </Row>
                    <Divider style={{ margin: "8px 0px" }} />
                    <p style={{ color: "#5e5e5e", margin: "0", zoom: 0.8 }}>
                      {"Edition: " +
                        ink.count +
                        (ink.limit > 0 ? "/" + ink.limit : "")}
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
