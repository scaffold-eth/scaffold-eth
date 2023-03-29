import { List } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import bbNode from "../nodes.json";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    var config = {
      method: "get",
      url: `https://backend.dev.buildbear.io/node/transaction/${bbNode.nodeId}?page=1&no=10`,
    };

    function getTransactions() {
      axios(config)
        .then(function (response) {
          setTransactions(response.data.transactions);
          setTimeout(getTransactions, 5000);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    getTransactions();
  }, []);

  return (
    <div style={{ width: 600, height: 500, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Transaction Hashes:</h2>
      <List
        bordered
        dataSource={transactions}
        renderItem={item => {
          return (
            <List.Item key={`transaction${item._id}`}>
              <a href={`https://explorer.dev.buildbear.io/${bbNode.nodeId}/tx/${item.hash}`}>{item.hash}</a>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
