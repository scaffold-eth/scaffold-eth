import { notification } from "antd";
import axios from "axios";
import { BB_BACKEND_URL, bbNode } from "../constants";

/**
 * This BuildbearTransactor is supposed to be used for buildbear nodes
 */
export default function BuildbearTransactor({ to, token, value }) {
  let data = {};

  if (token)
    data = JSON.stringify({
      address: to,
      token: token,
      balance: value,
    });
  else
    data = JSON.stringify({
      address: to,
      balance: value,
    });

  const config = {
    method: "post",
    url: `${BB_BACKEND_URL}/node/faucet/${token ? "erc20" : "native"}/${bbNode.nodeId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  axios(config)
    .then(() => {
      console.log("Balance updated");
      notification.info({
        message: `${token ? "ERC20" : "Native"} Tokens sent`,
        // description: result.hash,
        placement: "bottomRight",
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
