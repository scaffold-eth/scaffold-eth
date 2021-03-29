import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-apollo";
import { Link } from "react-router-dom";
import { FOR_SALE_QUERY } from "./apollo/queries";
import { isBlocklisted } from "./helpers";
import { Row, Divider } from "antd";
import { Loader } from "./components"
import { ethers } from "ethers";

export default function ForSale(props) {
  let [allInks, setAllInks] = useState([]);
  let [inks, setInks] = useState({});
  const { loading, error, data, fetchMore } = useQuery(FOR_SALE_QUERY, {
    variables: {
      first: 48,
      skip: 0,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    }
  });

  const getMetadata = async (jsonURL) => {
    const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
    const data = await response.json();
    return data;
  };

  const getInks = (data) => {
    setAllInks([...allInks, ...data])
    data.forEach(async (ink) => {
      if (isBlocklisted(ink.jsonUrl)) return;
      let _ink = ink;
      _ink.metadata = await getMetadata(ink.jsonUrl);
      let _newInk = {}
      _newInk[_ink.inkNumber] = _ink
      setInks((inks) => ({...inks, ..._newInk}));
      //setInks((inks) => [...inks, _ink]);
    });
  };

  const onLoadMore = useCallback(() => {
    if (
      Math.round(window.scrollY + window.innerHeight) >=
      Math.round(document.body.scrollHeight)
    ) {
      fetchMore({
        variables: {
          skip: allInks.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        }
      });
    }
  }, [fetchMore, allInks.length]);

  useEffect(() => {
    data ? getInks(data.inks) : console.log("loading");
  }, [data]);

  useEffect(() => {
  window.addEventListener("scroll", onLoadMore);
  return () => {
    window.removeEventListener("scroll", onLoadMore);
  };
}, [onLoadMore]);


  if (loading) return <Loader/>;
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ width: 600, margin: "0 auto" }}>
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
        {inks
          ? Object.keys(inks)
              .sort((a, b) => inks[b].bestPriceSetAt - inks[a].bestPriceSetAt)
              .map((ink) => (
              <li
                key={inks[ink].id}
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
                to={{pathname: "/ink/"+inks[ink].id}}
                style={{ color: "black" }}
              >
                  <img
                    src={inks[ink].metadata.image}
                    alt={inks[ink].metadata.name}
                    width="150"
                    style={{
                      border: "1px solid #e5e5e6",
                      borderRadius: "10px"
                    }}
                  />
                  <h3
                    style={{ margin: "10px 0px 5px 0px", fontWeight: "700" }}
                  >
                    {inks[ink].metadata.name.length > 18
                      ? inks[ink].metadata.name.slice(0, 15).concat("...")
                      : inks[ink].metadata.name}
                  </h3>

                  <Row
                    align="middle"
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    {(inks[ink].bestPrice > 0)
                      ? (<><p
                      style={{
                        color: "#5e5e5e",
                        margin: "0"
                      }}
                    >
                      <b>{ethers.utils.formatEther(inks[ink].bestPrice)} </b>
                    </p>

                    <img
                      src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                      alt="xdai"
                      style={{ marginLeft: 5 }}
                    /></>)
                    : <>
                    <img
                      src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                      alt="xdai"
                      style={{ marginLeft: 5, visibility: "hidden" }}
                    />
                    </> }
                  </Row>
                  <Divider style={{ margin: "8px 0px" }} />
                  <p style={{ color: "#5e5e5e", margin: "0", zoom: 0.8 }}>
                    {'Edition: ' + inks[ink].count + (inks[ink].limit>0?'/' + inks[ink].limit:'')}
                  </p>
                </Link>
              </li>
            ))
          : null}
        </ul>
        <Row justify="center">
        </Row>
      </div>
    </div>
  );
}
