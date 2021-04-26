import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useCircuitCalldata } from "./hooks";

export default function HashCircuitInput() {

  const [hash, setHash] = useState(15893827533473716138720882070731822975159228540693753428689375377280130954696)
  const [inputNum, setInputNum] = useState(0);

  const [isValid, calldata] = useCircuitCalldata(
    "hash",
    ["x", "hash"],
    [inputNum, hash]
  );

  return (
    <div>
      <Input />
    </div>
  );
}
