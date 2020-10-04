import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { INKS_QUERY } from "./apollo/queries";
import { isBlacklisted } from "./helpers";
import { Row, Button } from "antd";
import { Loader } from "./components"

export default function AllInks(props) {
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
    data.forEach(async (ink) => {
      if (isBlacklisted(ink.jsonUrl)) return;
      let _ink = ink;
      _ink.metadata = await getMetadata(ink.jsonUrl);
      setInks((inks) => [...inks, _ink]);
    });
  };

  const onLoadMore = () => {
    fetchMore({
      variables: {
        skip: inks.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      }
    });
  };

  useEffect(() => {
    data ? getInks(data.inks) : console.log("loading");

    // window.addEventListener("scroll", onLoadMore, );
    // return () => {
    //   window.removeEventListener("scroll", onLoadMore);
    // };
  }, [data]);

  if (loading) return <Loader/>;
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ width: 600, margin: "0 auto" }}>
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
                    fontWeight: "bold"
                  }}
                >
                  <a
                    href={ink.metadata.external_url}
                    style={{ color: "black" }}
                  >
                    <img
                      src={ink.metadata.image}
                      alt={ink.metadata.name}
                      width="120"
                    />
                  </a>
                </li>
              ))
            : null}
        </ul>
        <Row justify="center">
          <Button type="primary" onClick={onLoadMore}>
            Load more
          </Button>
        </Row>
      </div>
    </div>
  );
}
