import React, { useState, useCallback } from "react";
import { Input, Button, Form, Tooltip } from "antd";
import { parseEther } from "@ethersproject/units";
import { ethers } from "ethers";

import { useResolveName, useDebounce } from "../hooks";

import { DAI_ADDRESS, DAI_ABI } from "../constants";

const SnatchPage = ({ mainnetProvider, localProvider, tx }) => {
  const [target, setTarget] = useState("ironsoul.eth");
  const [receiver, setReceiver] = useState("");

  const debouncedTarget = useDebounce(target, 500);

  const { addressFromENS, loading, error } = useResolveName(mainnetProvider, debouncedTarget);

  const impersonateSend = useCallback(async () => {
    const accountToImpersonate = addressFromENS;

    await localProvider.send("hardhat_impersonateAccount", [accountToImpersonate]);
    const signer = await localProvider.getSigner(accountToImpersonate);

    const myDaiContract = new ethers.Contract(DAI_ADDRESS, DAI_ABI, signer);

    tx(myDaiContract.transfer(receiver, parseEther("10")));
  }, [addressFromENS, receiver]);

  const getValidationProps = () => {
    if (loading) {
      return {
        validateStatus: "validating",
        help: "Resolving..",
      };
    } else if (error) {
      return {
        validateStatus: "error",
        help: error,
      };
    } else {
      return {
        validateStatus: "success",
        help: "You are ready!",
      };
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "left",
        marginTop: "30px",
      }}
    >
      <p>ENS name or address of your target: </p>
      <Form.Item hasFeedback {...getValidationProps()}>
        <Tooltip placement="bottom" title="Account must have non-zero ETH balance">
          <Input value={target} onChange={e => setTarget(e.target.value)} />
        </Tooltip>
      </Form.Item>
      <p style={{ marginTop: "20px" }}>Grab 10 DAI from your target 😈 </p>
      <Form style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Form.Item style={{ flexBasis: "75%" }}>
          <Input size="medium" onChange={e => setReceiver(e.target.value)} placeholder="Put receiver address" />
        </Form.Item>
        <Form.Item style={{ flexBasis: "20%" }}>
          <Button onClick={impersonateSend} disabled={error || loading || !receiver}>
            Send DAI
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SnatchPage;
