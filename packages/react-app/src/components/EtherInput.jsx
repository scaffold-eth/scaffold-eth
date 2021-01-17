import React, { useState, useEffect } from "react";
import { Input } from "antd";

/*
<EtherInput
  price={props.price}
  value={amount}
  onChange={value => {
    setAmount(value);
  }}
/>
*/

export default function EtherInput(props) {
  const [mode, setMode] = useState(props.price ? "USD" : "ETH");
  const [display, setDisplay] = useState();
  const [value, setValue] = useState();

  const currentValue = typeof props.value !== "undefined" ? props.value : value;

  const option = title => {
    if (!props.price) return "";
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          //if (mode === "USD") {
            setMode("ETH");
            setDisplay(currentValue);
          // } else {
          //   setMode("USD");
          //   if (currentValue) {
          //     const usdValue = "" + (parseFloat(currentValue) * props.price).toFixed(2);
          //     setDisplay(usdValue);
          //   } else {
          //     setDisplay(currentValue);
          //   }
         // }
        }}
      >
        {title}
      </div>
    );
  };

  let prefix;
  let addonAfter;
  // if (mode === "USD") {
  //   prefix = "$";
  //   addonAfter = option("USD 🔀");
  // } else {
    prefix = "Ξ";
    addonAfter = option("ETH 🔀");
  //}

  useEffect(
    ()=>{
      if(!currentValue){
        setDisplay("");
      }
    }
  ,[ currentValue ])

  return (
    <Input
      placeholder={props.placeholder ? props.placeholder : "amount in " + mode}
      autoFocus={props.autoFocus}
      prefix={prefix}
      value={display}
      addonAfter={addonAfter}
      onChange={async e => {
        const newValue = e.target.value;
        // if (mode === "USD") {
        //   const ethValue = parseFloat(newValue) / props.price;
        //   setValue(ethValue);
        //   if (typeof props.onChange === "function") {
        //     props.onChange(ethValue);
        //   }
        //   setDisplay(newValue);
        // } else {
          setValue(newValue);
          if (typeof props.onChange === "function") {
            props.onChange(newValue);
          }
          setDisplay(newValue);
        //}
      }}
    />
  );
}
