import { notification } from "antd";
import axios from "axios";
import { BB_BACKEND_URL, bbNode } from "../constants";

/**
 * This ERC20Transactor is supposed to be used for buildbear nodes
 */
export default function ERC20Transactor({ to, token, value }) {
  // console.log(value.toString());
  const data = JSON.stringify({
    address: to,
    token: token,
    balance: value,
  });

  const config = {
    method: "post",
    url: `${BB_BACKEND_URL}/node/faucet/erc20/${bbNode.nodeId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  axios(config)
    .then(() => {
      console.log("Balance updated");
      notification.info({
        message: "ERC20 Tokens sent",
        // description: result.hash,
        placement: "bottomRight",
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
