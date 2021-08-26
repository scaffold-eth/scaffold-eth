import React from "react";
import { Address } from "..";
const { utils } = require("ethers");

const tryToDisplay = thing => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
<<<<<<< HEAD
      return formatUnits(thing, "ether");
=======
      return "Ξ" + utils.formatUnits(thing, "ether");
>>>>>>> master
    }
  }
  if (thing && thing.indexOf && thing.indexOf("0x") === 0 && thing.length === 42) {
    return <Address address={thing} fontSize={22} />;
  }
  return JSON.stringify(thing);
};

export default tryToDisplay;
