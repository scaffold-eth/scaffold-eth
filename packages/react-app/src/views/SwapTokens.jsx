import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Select } from "antd";
import React, { useState } from "react";
import { ethers, utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";
import ERC20Artifact from "@openzeppelin/contracts/build/contracts/IERC20.json";
import { Address, Balance, Events } from "../components";
import Transactions from "../components/Transactions";
import { bbSupportedERC20Tokens, bbNode } from "../constants";

export default function SwapTokens({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [value, setValue] = useState("");
  const isBuildbearNet = localProvider && localProvider.connection.url.startsWith("https://rpc.dev.buildbear.io");
  const erc20ABI = ERC20Artifact.abi;

  const erc20Tokens = bbNode ? bbSupportedERC20Tokens[bbNode.forkingChainId] : {};
  let erc20Options = Object.keys(erc20Tokens).map(token => {
    return {
      value: erc20Tokens[token].address,
      label: token,
      decimals: erc20Tokens[token].decimals,
    };
  });
  // erc20Options = [{ value: "native", label: "BB ETH (Native token)" }, ...erc20Options];

  async function approveToken() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const ERC20Contract = new ethers.Contract(fromToken.address, erc20ABI, signer);
    const allowance = await ERC20Contract.allowance(await signer.getAddress(), writeContracts.TokenSwap.address);

    if (ethers.BigNumber.from(value).gt(allowance)) {
      const approveTx = await ERC20Contract.approve(writeContracts.TokenSwap.address, ethers.constants.MaxUint256);
      await approveTx.wait();
    }
  }

  return (
    <div style={{ paddingBottom: 256 }}>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div
        style={{
          border: "1px solid #cccccc",
          padding: 16,
          width: 400,
          margin: "auto",
          marginTop: 64,
          paddingBottom: 30,
        }}
      >
        <h2>SwapTokens:</h2>
        <h4>Swap erc20 tokens for another token</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Select
            style={{ width: "100%" }}
            placeholder="Swap From..."
            onChange={(value, data) => setFromToken({ address: value, decimals: data.decimals })}
            options={erc20Options}
          />
          <Select
            style={{ width: "100%" }}
            placeholder="Swap To..."
            onChange={(value, decimals) => setToToken({ address: value, decimals })}
            options={erc20Options}
          />

          <Input
            placeholder="Value"
            style={{ textAlign: "center" }}
            onChange={e => {
              setValue(e.target.value);
            }}
          />
          <Button style={{ marginTop: 8 }} onClick={approveToken}>
            Approve
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = tx(
                writeContracts.TokenSwap.swap(
                  fromToken.address,
                  toToken.address,
                  utils.parseUnits(value, fromToken.decimals),
                ),
                update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                        update.gasUsed +
                        "/" +
                        (update.gasLimit || update.gas) +
                        " @ " +
                        parseFloat(update.gasPrice) / 1000000000 +
                        " gwei",
                    );
                  }
                },
              );
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Swap!
          </Button>
        </div>
        <Divider />
        TokenSwap Contract Address:
        <Address
          address={readContracts && readContracts.TokenSwap ? readContracts.TokenSwap.address : null}
          ensProvider={mainnetProvider}
          blockExplorer={isBuildbearNet ? `https://explorer.dev.buildbear.io/${bbNode.nodeId}/` : undefined}
          fontSize={16}
        />
      </div>

      {isBuildbearNet ? <Transactions /> : null}
    </div>
  );
}
