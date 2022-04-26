import React, { useEffect, useState } from "react";
import { classNames } from "../helpers";
import { SwitchHorizontalIcon } from "@heroicons/react/outline";

// small change in useEffect, display currentValue if it's provided by user

/**
  ~ What it does? ~

  Displays input field for ETH/USD amount, with an option to convert between ETH and USD

  ~ How can I use? ~

  <EtherInput
    autofocus
    price={price}
    value=100
    placeholder="Enter amount"
    onChange={value => {
      setAmount(value);
    }}
  />

  ~ Features ~

  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide value={value} to specify initial amount of ether
  - Provide placeholder="Enter amount" value for the input
  - Control input change by onChange={value => { setAmount(value);}}
**/

export default function EtherInput(props) {
  const [mode, setMode] = useState(props.price ? "USD" : "ETH");
  const [display, setDisplay] = useState();
  const [value, setValue] = useState();

  const currentValue = typeof props.value !== "undefined" ? props.value : value;

  useEffect(() => {
    if (!currentValue) {
      setDisplay("");
    }
  }, [currentValue]);

  return (
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex items-stretch flex-grow focus-within:z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {mode === "USD" ? "$" : "Ξ"}
        </div>
        <input
          autoFocus={props.autoFocus}
          placeholder={props.placeholder ? props.placeholder : "Amount in " + mode}
          className={classNames(
            props.price ? "rounded-none rounded-l-md" : "rounded-md py-2",
            "block w-full pl-8 sm:text-sm border border-gray-300 focus:outline-none dark:text-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none",
          )}
          value={display}
          onChange={async e => {
            const newValue = e.target.value;
            if (mode === "USD") {
              const possibleNewValue = parseFloat(newValue);
              if (possibleNewValue) {
                const ethValue = possibleNewValue / props.price;
                setValue(ethValue);
                if (typeof props.onChange === "function") {
                  props.onChange(ethValue);
                }
                setDisplay(newValue);
              } else {
                setDisplay(newValue);
              }
            } else {
              setValue(newValue);
              if (typeof props.onChange === "function") {
                props.onChange(newValue);
              }
              setDisplay(newValue);
            }
          }}
        />
      </div>
      {props.price && (
        <button
          type="button"
          className="-ml-px relative inline-flex items-center px-2.5 py-2 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
          onClick={() => {
            if (mode === "USD") {
              setMode("ETH");
              setDisplay(currentValue);
            } else {
              setMode("USD");
              if (currentValue) {
                const usdValue = "" + (parseFloat(currentValue) * props.price).toFixed(2);
                setDisplay(usdValue);
              } else {
                setDisplay(currentValue);
              }
            }
          }}
        >
          <SwitchHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
