import React from "react";
import { convertHexToNumber, convertHexToUtf8 } from "@walletconnect/utils";
const { ethers } = require("ethers");

const convertHexToUtf8IfPossible = (hex) => {
  try {
    return convertHexToUtf8(hex);
  } catch (e) {
    return hex;
  }
}

export default function WalletConnectTransactionDisplay({payload, provider}) {
  const getValue = async (param, key) => {
    if (!param[key]) {
      return "";
    }

    let value = param[key];

    if (key == "value") {
      return ethers.utils.formatEther(convertHexToNumber(value).toString()).toString() + " Ξ"
    }

    if (key == "gasPrice") {
      return ethers.utils.formatUnits(convertHexToNumber(value).toString(), 9).toString() + " gwei"
    }

    if ((key == "nonce") || (key == "gas") || (key == "gasPrice")) {
      return convertHexToNumber(value);
    }

    if (key == "to") {
      console.log(key, value)
    }
    return value;
  }

  if (!payload || !payload.params) {
    return (
        <div>
          Cannot decouple payload.
        </div>
    );
  }

  let params = [];
  let param_0 = payload.params[0];
  let param_1 = payload.params[1];

  switch (payload.method) {
    case "eth_sendTransaction":
    case "eth_signTransaction":
      params = [
        ...params,
        { label: "From", value: getValue(param_0, "from") },
        { label: "To", value: getValue(param_0, "to") },
        {
          label: "Value",
          value: getValue(param_0, "value"),
        },
        {
          label: "Gas Price",
          value: getValue(param_0, "gasPrice"),
        },
        {
          label: "Gas Limit",
          value: param_0.gas ? getValue(param_0, "gas") : getValue(param_0, "gasLimit"),
        },
        {
          label: "Nonce",
          value: getValue(param_0, "nonce"),
        },
        { label: "Data", value: getValue(param_0, "data") }
      ];
      break;

    case "eth_sign":
      params = [
        ...params,
        { label: "Address", value: param_0 },
        { label: "Message", value: param_1 },
      ];
      break;
    case "personal_sign":
      params = [
        ...params,
        { label: "Address", value: param_1 },
        {
          label: "Message",
          value: convertHexToUtf8IfPossible(param_0),
        },
      ];
      break;
    default:
      params = [
        ...params,
        {
          label: "params",
          value: JSON.stringify(payload.params, null, "\t"),
        },
      ];
      break;
  }

  params.push({ label: "Method", value: payload.method });
  console.log(params);

  const options = [];
  params.forEach((param) => {
      if (param.value) {
        let marginBottom = "0em";
        if (param.label == "Value") {
          marginBottom = "2em";
        }

        options.push(
          <div style={{ display: "flex", justifyContent:"center", marginTop: "0.5em", marginBottom: marginBottom }}>
           <div style={{ color: "grey"}}> {param.label}:</div> <div style={{ fontWeight: "bold"}}> {param.value}</div>
          </div>
        )  
      }
  })

  return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent:"space-around"}}>
        {options}
      </div>
  );
}
