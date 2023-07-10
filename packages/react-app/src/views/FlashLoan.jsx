import { Button, Divider, Input, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import ERC20Artifact from "@openzeppelin/contracts/build/contracts/IERC20.json";
import { Address, ERC20Balance, Transactions, ContractBalance } from "../components";
import { BASE_URL, bbSupportedERC20Tokens, bbNode } from "../constants";

export default function FlashLoan({
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
  const [withdrawToken, setWithdrawToken] = useState();
  const [showbalance, setShowbalance] = useState(false);
  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const isBuildbearNet = localProvider && localProvider.connection.url.startsWith(`https://rpc.${BASE_URL}`);
  const erc20ABI = ERC20Artifact.abi;

  const erc20Tokens = bbNode ? bbSupportedERC20Tokens[bbNode.forkingChainId] : {};
  let erc20Options = Object.keys(erc20Tokens).map(token => {
    return {
      value: erc20Tokens[token].address,
      label: token,
      decimals: erc20Tokens[token].decimals,
    };
  });
  function tokenArrRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele.label !== value;
    });
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
        <h2>FlashLoan + Arbitrage</h2>
        <Divider />
        <h3 style={{ margin: 8 }}>Select the Token you want to take FlashLoan</h3>
        <div style={{ margin: 8 }}>
          <Select
            style={{ width: "100%" }}
            placeholder="Swap From..."
            onChange={(value, data) => {
              setFromToken({ address: value, decimals: data.decimals, symbol: data.label });
            }}
            options={toToken ? tokenArrRemove(erc20Options, toToken.symbol) : erc20Options}
          />
          <h3 style={{ margin: 8 }}>Select the Token you want to swap</h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Swap To..."
            onChange={(value, data) => setToToken({ address: value, decimals: data.decimals, symbol: data.label })}
            options={fromToken ? tokenArrRemove(erc20Options, fromToken.symbol) : erc20Options}
          />
          <h3 style={{ margin: 8 }}>Enter the flashloan amount </h3>
          <Input
            placeholder="Value"
            style={{ textAlign: "center" }}
            onChange={e => {
              setValue(e.target.value);
            }}
          />

          <Button
            style={{ marginTop: 8 }}
            // disabled={!(fromToken && toToken && value && isTokenApproved)}
            onClick={async () => {
              const result = tx(
                writeContracts.ArbitrageFlashLoan.flashloan(
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
            Run the FlashLoan Arbitrage
          </Button>
        </div>
        <Divider />

        <h3 style={{ margin: 8 }}>Withdraw the Token from the contract</h3>
        <br />

        <h3 style={{ margin: 8 }}>Select the Token you want to withdraw</h3>
        <div style={{ margin: 8 }}>
          <Select
            style={{ width: "100%" }}
            placeholder="Withdraw Token..."
            onChange={(value, data) => {
              setWithdrawToken({ address: value, decimals: data.decimals, symbol: data.label });
            }}
            options={toToken ? tokenArrRemove(erc20Options, toToken.symbol) : erc20Options}
          />
        </div>
        <Button
          style={{ margin: 8 }}
          onClick={async () => {
            const result = tx(writeContracts.ArbitrageFlashLoan.withdrawToken(withdrawToken.address), update => {
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
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
          }}
        >
          Withdraw
        </Button>
        <Divider />
        <Button style={{ margin: 8 }} onClick={() => setShowbalance(true)}>
          View the Contract Balances
        </Button>
        <div style={{ margin: 8 }}>
          {showbalance &&
            erc20Options.map(token => (
              <div style={{ margin: 2, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {token.label}
                {"  "}
                <ContractBalance
                  tokenAddress={token.value}
                  contractAddress={writeContracts.ArbitrageFlashLoan.address}
                  decimals={token.decimals}
                  size={16}
                />
              </div>
            ))}
        </div>
        <Divider />
        {/* <Divider /> */}
      </div>
      <div style={{ padding: "50px", maxWidth: "900px", margin: "auto" }}>
        <h3 style={{ margin: 8, fontSize: 20, fontWeight: 600 }}>How ArbitrageFlashLoan works?</h3>
        <div style={{ margin: 8 }}>
          Entire logic is in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            ArbitrageFlashLoan.sol:
          </span>{" "}
          Smart contract is present in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            packages/hardhat/contracts
          </span>{" "}
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            withdrawToken():
          </span>{" "}
          This function allows users to withdraw tokens From the contract
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            flashloan():
          </span>{" "}
          This function allows users to execute the ArbitrageFlashloan. The user needs to input the token's address and
          the amount of flashloan.
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            executeOperation():
          </span>{" "}
          This function is called after your contract has received the flash loaned amount
          <br />
          <br />
        </div>
      </div>

      {isBuildbearNet ? <Transactions /> : null}
    </div>
  );
}
