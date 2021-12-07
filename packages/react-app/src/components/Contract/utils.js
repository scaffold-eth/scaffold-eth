import React from "react";
import { Address } from "..";

const { utils } = require("ethers");

const tryToDisplay = (thing, asText = false) => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      return "Ξ" + utils.formatUnits(thing, "ether");
    }
  }
  if (thing && thing.indexOf && thing.indexOf("0x") === 0 && thing.length === 42) {
    return asText ? thing : <Address address={thing} fontSize={22} />;
  }
  if (thing && thing.constructor && thing.constructor.name == "Array") {
    const mostReadable = v => (["number", "boolean"].includes(typeof v) ? v : tryToDisplay(v));
    return JSON.stringify(thing.map(mostReadable));
  }
  return JSON.stringify(thing);
};

const tryToDisplayAsText = thing => tryToDisplay(thing, true);

export { tryToDisplay, tryToDisplayAsText };
