import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-apollo";
import { Link } from "react-router-dom";
import { ADMIN_INKS_QUERY } from "./apollo/queries";
import { isBlocklisted } from "./helpers";
import { Row } from "antd";
import { Loader } from "./components";
import {useUserProvider} from "./hooks";

const ADMIN_ADDRESSES = ["0x859c736870af2abe057265a7a5685ae7b6c94f15"];

export default function CuratedInks(props) {
  let [allInks, setAllInks] = useState([]);
  let [inks, setInks] = useState({});
  const userProvider = useUserProvider(props.localProvider, props.injectedProvider);
  console.log("userProvider: ", userProvider);
  const { loading, error, data, fetchMore } = useQuery(ADMIN_INKS_QUERY, {
    variables: {
      first: 48,
      skip: 0,
      admins: ADMIN_ADDRESSES
    },
    fetchPolicy: "no-cache"
  });

  const getMetadata = async (jsonURL) => {
    const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
    const data = await response.json();
    return data;
  };

  const getInks = (data) => {
    setAllInks([...allInks, ...data]);
    data.forEach(async (ink) => {
      if (isBlocklisted(ink.jsonUrl)) return;
      let _ink = ink;
      _ink.metadata = await getMetadata(ink.jsonUrl);
      let _newInk = {};
      _newInk[_ink.inkNumber] = _ink;
      setInks((inks) => ({ ...inks, ..._newInk }));
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
          skip: allInks.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        },
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

  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ width: 600, margin: "0 auto" }}>
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
          {inks
            ? Object.keys(inks)
                .sort((a, b) => b - a)
                .map((ink) => (
                  <li
                    key={inks[ink].id}
                    style={{
                      display: "inline-block",
                      verticalAlign: "top",
                      margin: 10,
                      fontWeight: "bold",
                    }}
                  >
                    <Link to={"ink/" + inks[ink].id} style={{ color: "black" }}>
                      <img
                        src={inks[ink].metadata.image}
                        alt={inks[ink].metadata.name}
                        width="120"
                      />
                    </Link>
                  </li>
                ))
            : null}
        </ul>
        <Row justify="center"></Row>
      </div>
    </div>
  );
}
