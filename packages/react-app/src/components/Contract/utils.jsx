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
  return JSON.stringify(thing);
};

const tryToDisplayAsText = thing => tryToDisplay(thing, true);

export { tryToDisplay, tryToDisplayAsText };
