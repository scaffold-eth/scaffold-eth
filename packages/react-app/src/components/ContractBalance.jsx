import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import ERC20Artifact from "@openzeppelin/contracts/build/contracts/IERC20.json";

export default function ContractBalance(props) {
  const [balance, setBalance] = useState(0);

  const erc20ABI = ERC20Artifact.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {
    async function getERC20Balance() {
      const ERC20Contract = new ethers.Contract(props.tokenAddress, erc20ABI, signer);

      const bal = await ERC20Contract.balanceOf(props.contractAddress);

      const etherBalance = utils.formatUnits(bal, props.decimals).toString();
      const floatBalance = parseFloat(etherBalance).toFixed(2);
      setBalance(floatBalance);
    }

    const balFetchInterval = setInterval(getERC20Balance, 5000);

    return () => {
      clearInterval(balFetchInterval);
    };
  }, [erc20ABI, signer, props]);

  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: props.size ? props.size : 24,
        padding: 8,
      }}
    >
      {balance}
    </span>
  );
}
