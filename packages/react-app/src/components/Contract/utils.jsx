import React from "react";

import Address from "../Address";

const { utils } = require("ethers");

const tryToDisplay = (thing, asText = false, blockExplorer) => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      const displayable = "Ξ" + utils.formatUnits(thing, "ether");
      return asText ? displayable : <span style={{ overflowWrap: "break-word", width: "100%" }}>{displayable}</span>;
    }
  }
  if (thing && thing.indexOf && thing.indexOf("0x") === 0 && thing.length === 42) {
    return asText ? thing : <Address address={thing} fontSize={22} blockExplorer={blockExplorer} />;
  }
  if (thing && thing.constructor && thing.constructor.name === "Array") {
    const mostReadable = v => (["number", "boolean"].includes(typeof v) ? v : tryToDisplayAsText(v));
    const displayable = JSON.stringify(thing.map(mostReadable));
    return asText ? (
      displayable
    ) : (
      <span style={{ overflowWrap: "break-word", width: "100%" }}>{displayable.replaceAll(",", ",\n")}</span>
    );
  }
  //better formatting of tx results
  if (thing && thing.constructor && thing.constructor.name === "Object" && Object.keys(thing).length === 17) {
    //17 keys should be reliable to target a tx result object
    const gasPriceInGwei = 20; //sorry–could not find where to set gas price!
    const costOfTransactionInEth = thing.gasLimit.mul(gasPriceInGwei).mul(1000000000);
    thing.costOfTransactionInEth = utils.formatUnits(costOfTransactionInEth, "ether");
    if (thing.gasLimit && thing.gasLimit != null) thing.gasLimit = utils.formatUnits(thing.gasLimit, "wei");
    if (thing.gasPrice && thing.gasPrice != null) thing.gasPrice = utils.formatUnits(thing.gasPrice, "gwei");
    if (thing.maxFeePerGas && thing.maxFeePerGas != null)
      thing.maxFeePerGas = utils.formatUnits(thing.maxFeePerGas, "wei");
    if (thing.maxPriorityFeePerGas && thing.maxPriorityFeePerGas != null)
      thing.maxPriorityFeePerGas = utils.formatUnits(thing.maxPriorityFeePerGas, "wei");
    if (thing.value && thing.value != null) thing.value = utils.formatUnits(thing.value, "ether");

    const betterOrderedThing = {
      costOfTransactionInEth: thing.costOfTransactionInEth,
      gasLimit: thing.gasLimit,
      gasPrice: gasPriceInGwei,
      maxFeePerGas: thing.maxFeePerGas,
      maxPriorityFeePerGas: thing.maxPriorityFeePerGas,
      value: thing.value,
      nonce: thing.nonce,
      from: thing.from,
      to: thing.to,
      hash: thing.hash,
      chainId: thing.chainId,
      type: thing.type,
      accessList: thing.accessList,
      r: thing.r,
      s: thing.s,
      v: thing.v,
      data: thing.data,
      wait: thing.wait,
    };
    thing = betterOrderedThing;
  }
  return JSON.stringify(thing);
};

const tryToDisplayAsText = thing => tryToDisplay(thing, true);

export { tryToDisplay, tryToDisplayAsText };
