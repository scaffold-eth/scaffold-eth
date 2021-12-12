import React, { useState } from "react";
import { useBalance, useGasPrice } from "eth-hooks";
import { ethers } from "ethers";
import { Button } from "antd";

import { Transactor } from "../helpers";

function FaucetHint({ localProvider, targetNetwork, address }) {
  const [faucetClicked, setFaucetClicked] = useState(false);

  // fetch local balance
  const yourLocalBalance = useBalance(localProvider, address);

  // get gas Price from network
  const gasPrice = useGasPrice(targetNetwork, "fast");

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);
  const faucetHintShown =
    !faucetClicked &&
    localProvider?._network &&
    localProvider?._network?.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0;

  if (faucetHintShown) {
    return (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }
  return null;
}

export default FaucetHint;
