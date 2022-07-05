import React, { useEffect, useState } from "react";
import { convertHexToNumber, convertHexToUtf8 } from "@walletconnect/utils";
const { BigNumber, ethers } = require("ethers");

const convertHexToUtf8IfPossible = (hex) => {
  try {
    return convertHexToUtf8(hex);
  } catch (e) {
    return hex;
  }
}

export default function WalletConnectTransactionDisplay({payload, provider}) {
  const [paramsArray, setParamsArray] = useState([]);

  useEffect(()=>{
    for (let i = 0; i < paramsArray.length; i++) {
      let param = paramsArray[i];
      let label = param.label;
      let value = param.value;

      if ((label == "From") || (label == "To")) {
        provider.lookupAddress(value).then((ensName) => {
          if (ensName) {
            paramsArray[i] = {label: label, value: ensName};
            setParamsArray(JSON.parse(JSON.stringify(paramsArray)));
          }
        })
        .catch((error) => {
          console.log("Coudn't fetch ENS name for", value, error);
        })
      }
    }
  },[]);

try {  
  if (!payload || !payload.params) {
    return (
        <div>
          Cannot decouple payload.
        </div>
    );
  }

  if (paramsArray.length > 0) {
    const options = [];
    paramsArray.forEach((param) => {
        if (param.value) {
          let marginBottom = "0em";
          if (param.label == "Value") {
            marginBottom = "2em";
          }

          options.push(
            <div key={param.label + param.value} style={{ display: "flex", justifyContent:"center", marginTop: "0.5em", marginBottom: marginBottom }}>
             <div style={{ color: "grey"}}> {param.label}:</div> <div style={{ fontWeight: "bold"}}> {param.value}</div>
            </div>
          )  
        }
    })

    return (
      <pre>
        <div style={{ display: "flex", flexDirection: "column", justifyContent:"space-around"}}>
          {options}
        </div>
      </pre>
    );  
  }

  const getValue = (param, key) => {
    if (!param[key]) {
      return "";
    }

    let value = param[key];

    if (key == "value") {
      return ethers.utils.formatEther(BigNumber.from(value.toString())).toString() + " Ξ"
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

  let params;
  let param_0 = payload.params[0];
  let param_1 = payload.params[1];

  switch (payload.method) {
    case "eth_sendTransaction":
    case "eth_signTransaction":
      params = [
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
        { label: "Address", value: param_0 },
        { label: "Message", value: param_1 },
      ];
      break;
    case "personal_sign":
      params = [
        { label: "Address", value: param_1 },
        {
          label: "Message",
          value: convertHexToUtf8IfPossible(param_0),
        },
      ];
      break;
    default:
      params = [
        {
          label: "params",
          value: JSON.stringify(payload.params, null, "\t"),
        },
      ];
      break;
  }

  params.push({ label: "Method", value: payload.method });

  setParamsArray(params);
}
catch (error) {
    console.error("Cannot prettify transaction", error);

    return (
      <pre>
        {JSON.stringify(payload.params, null, 2)}
      </pre>
    );  
  }
}

