// import { useContractReader } from "eth-hooks";
// import { ethers } from "ethers";
// import { Input, Form, Button } from "antd";
import React, { useEffect, useState } from "react";
import { Poem } from "../components";
import { firebase } from "../utils";
// import { Link } from "react-router-dom";

function Home({ tx, address, readContracts, writeContracts, typedSigner, ensProvider }) {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.db
      .collection("poems")
      .orderBy("_createdAt", "desc")
      .onSnapshot(snapshot => {
        const data = [];

        snapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id });
        });

        console.log(data);

        setPoems(data);
      });

    return unsubscribe;
  }, []);

  return (
    <div style={{ margin: "10px auto", maxWidth: "600px", paddingTop: "10px", paddingBottom: "10px" }}>
      {poems.map(poem => (
        <Poem
          tx={tx}
          poem={poem}
          key={poem.id}
          ensProvider={ensProvider}
          readContracts={readContracts}
          writeContracts={writeContracts}
        />
      ))}
    </div>
  );
}

export default Home;
