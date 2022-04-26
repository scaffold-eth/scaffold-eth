import React from "react";

// added display of 0 instead of NaN if gas price is not provided

/**
  ~ What it does? ~

  Displays gas gauge

  ~ How can I use? ~

  <GasGauge
    gasPrice={gasPrice}
  />

  ~ Features ~

  - Provide gasPrice={gasPrice} and get current gas gauge
**/

export default function GasGauge(props) {
  return (
    <a
      href="https://ethgasstation.info/"
      className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
    >
      ⛽️ {typeof props.gasPrice === "undefined" ? 0 : parseInt(props.gasPrice, 10) / 10 ** 9}g
    </a>
  );
}
