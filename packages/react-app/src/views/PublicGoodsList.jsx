import React from "react";
import { useContractReader } from "eth-hooks";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Contract, utils } from "ethers";
import { publicGoodABI } from "../contracts/external_contracts";
import { Input, Button, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { Checkbox } from "antd";

import useMyReader from "../hooks/useMyReader";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

const PublicGoodsList = ({
  readContracts,
  writeContracts,
  localProvider,
  targetNetwork,
  injectedProvider,
  tx,
  address,
}) => {
  const [fund, setFund] = useState("");
  const [tokensInfo, setTokensInfo] = useState(null);
  const publicGoods = useContractReader(readContracts, "Weightage", "getPublicGoods");
  const stakeToken = useContractReader(readContracts, "Weightage", "stakeToken");
  const contractAddress = readContracts && readContracts.Weightage && readContracts.Weightage.address;
  const contract = useMemo(() => {
    if (!stakeToken || !injectedProvider) return null;
    return new Contract(stakeToken, publicGoodABI, injectedProvider.getSigner());
  }, [stakeToken, injectedProvider]);
  const myBalance = useMyReader(contract, "balanceOf", JSON.stringify([address]));
  const allowance = useMyReader(contract, "allowance", JSON.stringify([address, contractAddress]));
  const [fundTokens, setFundTokens] = useState([]);

  const history = useHistory();
  const tokenName = useMyReader(contract, "symbol");

  const lowApproval = useMemo(() => {
    if (!allowance || !fund) return true;
    const sellAmount = utils.parseEther(fund);
    if (allowance.lt(sellAmount)) return true;
    return false;
  }, [allowance, fund]);

  const fetchTokensInfo = useCallback(async () => {
    if (!publicGoods || !stakeToken) return;

    const info = [];
    for (let i = 0; i < publicGoods.length; i++) {
      const contract = new Contract(publicGoods[i], publicGoodABI, localProvider);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const uniswapPrice = await contract.getPrice();

      const userStake = await contract.stakeAmount(address, stakeToken.toLowerCase());
      const price = (uniswapPrice && utils.formatEther(uniswapPrice)) || "0.0";
      const formattedStake = (userStake && utils.formatEther(userStake)) || "0.0";

      info.push({ name, symbol, price, address: publicGoods[i], stake: formattedStake });
    }

    setTokensInfo(info);
  }, [publicGoods, localProvider, address, stakeToken]);

  const approveTokens = () => {
    tx(contract.approve(contractAddress, utils.parseEther("100000000000")));
  };

  const sendTokens = () => {
    tx(writeContracts.Weightage.stake(utils.parseEther(fund), fundTokens));
  };

  const toggleToken = tokenAddress => {
    setFundTokens(tokens => {
      if (tokens.includes(tokenAddress)) return tokens.filter(token => token !== tokenAddress);
      return [...tokens, tokenAddress];
    });
  };

  useEffect(() => {
    fetchTokensInfo();
  }, [publicGoods, fetchTokensInfo]);

  if (!injectedProvider) {
    return (
      <div style={{ margin: "0 auto", maxWidth: 560, paddingTop: 20, textAlign: "left" }}>
        <h2>Please connect your wallet</h2>
      </div>
    );
  }

  return (
    <div style={{ margin: "0 auto", maxWidth: 560, paddingTop: 20, textAlign: "left" }}>
      <h2>Public Goods List</h2>
      {!tokensInfo && <Spin />}
      {tokensInfo && stakeToken && (
        <div>
          {tokensInfo.map((t, i) => (
            <div style={{ padding: "20px 15px", marginBottom: 20, border: "1.5px solid #eee", borderRadius: 7 }}>
              <p style={{ margin: 0 }}>
                <b>Name: </b>
                {t.name}
              </p>
              <p style={{ margin: 0 }}>
                <b>Symbol: </b>
                {t.symbol}
              </p>
              <p style={{ margin: 0 }}>
                <b>Price: </b>
                {t.price}
              </p>
              <p style={{ margin: 0 }}>
                <b>Stake: </b>
                {t.stake}
              </p>
              <div>
                <Button
                  style={{ marginTop: 10, marginRight: 15 }}
                  type="primary"
                  onClick={() => history.push(`/whale/${t.address}`)}
                >
                  Fund Project
                </Button>
                <Button style={{ marginTop: 10 }} onClick={() => history.push(`/sell/${t.address}`)}>
                  Sell tokens
                </Button>
              </div>
              <Checkbox style={{ marginTop: 10 }} onChange={() => toggleToken(t.address)}></Checkbox>
            </div>
          ))}
          <h3>Fund projects with {tokenName}</h3>
          <p>My balance: {utils.formatEther(myBalance || "0")}</p>
          <Input
            type="number"
            placeholder="20 tokens"
            style={{ marginBottom: 10 }}
            value={fund}
            onChange={e => setFund(e.target.value)}
          />
          {lowApproval ? (
            <Button disabled={!fund} onClick={approveTokens}>
              Approve tokens
            </Button>
          ) : (
            <Button disabled={!fund || !fundTokens.length} onClick={sendTokens}>
              Stake Tokens
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicGoodsList;
