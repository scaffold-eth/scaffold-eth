import { formatUnits } from "@ethersproject/units";

const tryToDisplay = thing => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      return formatUnits(thing, "ether");
    }
  }
  return JSON.stringify(thing);
};

export default tryToDisplay;
