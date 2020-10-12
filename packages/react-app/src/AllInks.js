import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-apollo";
import { Link } from "react-router-dom";
import { INKS_QUERY } from "./apollo/queries";
import { isBlocklisted } from "./helpers";
import { Row } from "antd";
import { Loader } from "./components"

export default function AllInks(props) {
  let [allInks, setAllInks] = useState([]);
  let [inks, setInks] = useState([]);
  const { loading, error, data, fetchMore } = useQuery(INKS_QUERY, {
    variables: {
      first: 48,
      skip: 0
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
      setInks((inks) => [...inks, _ink]);
    });
  };

  const onLoadMore = useCallback(() => {
    if (
      Math.round(window.scrollY + window.innerHeight) >=
      Math.round(document.body.scrollHeight)
    ) {
      fetchMore({
        variables: {
          skip: inks.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        }
      });
    }
  }, [fetchMore, inks.length]);

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
            ? inks
                .sort((a, b) => b.inkNumber - a.inkNumber)
                .map((ink) => (
                <li
                  key={ink.id}
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    margin: 10,
                    fontWeight: "bold"
                  }}
                >
                  <Link
                    to={"ink/"+ink.id}
                    style={{ color: "black" }}
                  >
                    <img
                      src={ink.metadata.image}
                      alt={ink.metadata.name}
                      width="120"
                    />
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
