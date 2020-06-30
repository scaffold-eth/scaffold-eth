import React from "react";
import Blockies from "react-blockies";

export default function Blockie(props) {
  if (!props.address || typeof props.address.toLowerCase !== "function") {
    return <span />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Blockies seed={props.address.toLowerCase()} {...props} />;
}
