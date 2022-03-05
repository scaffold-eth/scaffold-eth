import { useContractReader } from "eth-hooks";
import React, { useState } from "react";
import { ethers } from "ethers";
import { Input, Button } from "antd";
import { useMemo } from "react";
import { useEffect } from "react";
import { Contract } from "ethers";
import { useParams } from "react-router-dom";

import { erc20, publicGoodABI } from "../contracts/external_contracts";
import useMyReader from "../hooks/useMyReader";

const ProjectOwnerUI = ({
  readContracts,
  writeContracts,
  localProvider,
  targetNetwork,
  tx,
  address,
  injectedProvider,
}) => {
  const { address: contractAddress } = useParams();
  const contract = useMemo(() => {
    if (!injectedProvider || !contractAddress) return null;
    return new Contract(contractAddress, publicGoodABI, injectedProvider.getSigner());
  }, [contractAddress, injectedProvider]);

  const poolAddress = useMyReader(contract, "getPool");
  const erc20Balance = useMyReader(contract, "balanceOf", JSON.stringify([address]));
  const allowance = useMyReader(contract, "allowance", JSON.stringify([address, contractAddress]));
  const liquidity = useMyReader(contract, "getLiquidity");
  const uniswapPrice = useMyReader(contract, "getPrice");
  const wethBalance = useContractReader(readContracts, "WETH", "balanceOf", [address]);

  const token0 = useMyReader(contract, "getToken0");
  const token1 = useMyReader(contract, "getToken1");

  const erc20BalanceFormatted = (erc20Balance && ethers.utils.formatEther(erc20Balance)) || "0.0";
  const liquidityFormatted = (liquidity && ethers.utils.formatEther(liquidity)) || "0.0";
  const uniswapPriceFormatted = (uniswapPrice && ethers.utils.formatEther(uniswapPrice)) || "0.0";
  const wethBalanceFormatted = (wethBalance && ethers.utils.formatEther(wethBalance)) || "0.0";

  const [sell, setSell] = useState(null);
  const [tokens, setTokens] = useState(["", ""]);

  const approveTokens = () => {
    tx(contract.approve(contractAddress, ethers.utils.parseEther(sell)));
  };

  const sellTokens = () => {
    tx(contract.sellToken(ethers.utils.parseEther(sell)));
  };

  const lowApproval = useMemo(() => {
    if (!allowance || !sell) return true;
    const sellAmount = ethers.utils.parseEther(sell);
    if (allowance.lt(sellAmount)) return true;
    return false;
  }, [allowance, sell]);

  const fetchTokenSymbol = async tokenAddress => {
    const contract = new Contract(tokenAddress, erc20, localProvider);
    const symbol = await contract.symbol();
    return symbol;
  };

  useEffect(() => {
    const fetchTokens = async (token0, token1) => {
      if (!token0 || !token1) return;
      const symbols = await Promise.all([fetchTokenSymbol(token0), fetchTokenSymbol(token1)]);
      setTokens(symbols);
    };

    fetchTokens(token0, token1);
  }, [token0, token1]);

  return (
    <div style={{ margin: "0 auto", maxWidth: 560, paddingTop: 20, textAlign: "left" }}>
      <p style={{ margin: 0 }}>
        <b>Uniswap Pool:</b>{" "}
        <a target="_blank" href={`${targetNetwork.blockExplorer}/address/${poolAddress}`} rel="noreferrer">
          {poolAddress}
        </a>
      </p>
      <p style={{ margin: 0 }}>
        <b>Pool Liquidity:</b> {liquidityFormatted.substring(0, 7)}
      </p>
      <p style={{ margin: 0 }}>
        <b>
          {tokens[0]} / {tokens[1]}:
        </b>{" "}
        {liquidity && liquidity.gt(0) ? uniswapPriceFormatted.substring(0, 12) : "No liquidity in the pool"}
      </p>
      <p style={{ margin: 0 }}>
        <b>My ERC20 Balance:</b> {erc20BalanceFormatted} tokens
      </p>
      <p>
        <b>My WETH Balance:</b> {wethBalanceFormatted.substring(0, 7)} WETH
      </p>
      <p>
        <b>Token A:</b>{" "}
        <a target="_blank" href={`${targetNetwork.blockExplorer}/address/${token0}`} rel="noreferrer">
          {tokens[0]}
        </a>
        <br />
        <b>Token B:</b>{" "}
        <a target="_blank" href={`${targetNetwork.blockExplorer}/address/${token1}`} rel="noreferrer">
          {tokens[1]}
        </a>
      </p>
      <div style={{ paddingTop: 10, paddingBottom: 20 }}>
        <p>
          <b>Sell Token</b>
        </p>
        <Input
          type="number"
          placeholder="20 tokens"
          style={{ marginBottom: 10 }}
          value={sell}
          onChange={e => setSell(e.target.value)}
        />
        {lowApproval ? (
          <Button disabled={!sell} onClick={approveTokens}>
            Approve tokens
          </Button>
        ) : (
          <Button disabled={!sell} onClick={sellTokens}>
            Sell tokens
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectOwnerUI;
