import { Card, Col, Divider, Input, Row } from "antd";
import { useBalance, useContractReader, useBlockNumber } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useTokenBalance } from "eth-hooks/erc/erc-20/useTokenBalance";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Address, Transactions, Contract } from "../components";
import Curve from "../components/Curve";
import TokenBalance from "../components/TokenBalance";
import Blockies from "react-blockies";

const contractName = "DEX";
const tokenName = "Balloons";

export default function Dex({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  contractConfig,
  signer,
  blockExplorer,
}) {
  let display = [];

  const [form, setForm] = useState({});
  const [values, setValues] = useState({});
  // const tx = props.tx;

  // const writeContracts = props.writeContracts;

  const contractAddress = readContracts && readContracts[contractName] ? readContracts[contractName].address : null;
  const tokenAddress = readContracts && readContracts[contractName] ? readContracts[tokenName].address : null;
  const contractBalance = useBalance(localProvider, contractAddress);

  const tokenBalance = useTokenBalance(readContracts[tokenName], contractAddress, localProvider);
  const tokenBalanceFloat = parseFloat(ethers.utils.formatEther(tokenBalance));
  const ethBalanceFloat = parseFloat(ethers.utils.formatEther(contractBalance));
  const liquidity = useContractReader(readContracts, contractName, "totalLiquidity");

  const rowForm = (title, icon, onClick) => {
    return (
      <Row>
        <Col span={8} style={{ textAlign: "right", opacity: 0.333, paddingRight: 6, fontSize: 24 }}>
          {title}
        </Col>
        <Col span={16}>
          <div style={{ cursor: "pointer", margin: 2 }}>
            <Input
              onChange={e => {
                let newValues = { ...values };
                newValues[title] = e.target.value;
                setValues(newValues);
              }}
              value={values[title]}
              addonAfter={
                <div
                  type="default"
                  onClick={() => {
                    onClick(values[title]);
                    let newValues = { ...values };
                    newValues[title] = "";
                    setValues(newValues);
                  }}
                >
                  {icon}
                </div>
              }
            />
          </div>
        </Col>
      </Row>
    );
  };

  if (readContracts && readContracts[contractName]) {
    display.push(
      <div>
        {rowForm("ethToToken", "💸", async value => {
          let valueInEther = ethers.utils.parseEther("" + value);
          let swapEthToTokenResult = await tx(writeContracts[contractName]["ethToToken"]({ value: valueInEther }));
          console.log("swapEthToTokenResult:", swapEthToTokenResult);
        })}

        {rowForm("tokenToEth", "🔏", async value => {
          let valueInEther = ethers.utils.parseEther("" + value);
          console.log("valueInEther", valueInEther);
          let allowance = await readContracts[tokenName].allowance(address, readContracts[contractName].address);
          console.log("allowance", allowance);

          let approveTx;
          if (allowance.lt(valueInEther)) {
            approveTx = await tx(
              writeContracts[tokenName].approve(readContracts[contractName].address, valueInEther, {
                gasLimit: 200000,
              }),
            );
          }

          let swapTx = tx(writeContracts[contractName]["tokenToEth"](valueInEther, { gasLimit: 200000 }));
          if (approveTx) {
            console.log("waiting on approve to finish...");
            let approveTxResult = await approveTx;
            console.log("approveTxResult:", approveTxResult);
          }
          let swapTxResult = await swapTx;
          console.log("swapTxResult:", swapTxResult);
        })}

        <Divider> Liquidity ({liquidity ? ethers.utils.formatEther(liquidity) : "none"}):</Divider>

        {rowForm("deposit", "📥", async value => {
          let valueInEther = ethers.utils.parseEther("" + value);
          let valuePlusExtra = ethers.utils.parseEther("" + value * 1.03);
          console.log("valuePlusExtra", valuePlusExtra);
          let allowance = await readContracts[tokenName].allowance(address, readContracts[contractName].address);
          console.log("allowance", allowance);
          if (allowance.lt(valuePlusExtra)) {
            await tx(
              writeContracts[tokenName].approve(readContracts[contractName].address, valuePlusExtra, {
                gasLimit: 200000,
              }),
            );
          }
          await tx(writeContracts[contractName]["deposit"]({ value: valueInEther, gasLimit: 200000 }));
        })}

        {rowForm("withdraw", "📤", async value => {
          let valueInEther = ethers.utils.parseEther("" + value);
          let withdrawTxResult = await tx(writeContracts[contractName]["withdraw"](valueInEther));
          console.log("withdrawTxResult:", withdrawTxResult);
        })}
      </div>,
    );
  }

  return (
    <div style={{ margin: "50px 0", paddingBottom: "100px" }}>
      <Row span={24}>
        <Col span={12}>
          <Card
            title={
              <div>
                <Address value={contractAddress} />
                <div style={{ float: "right", fontSize: 24 }}>
                  {parseFloat(ethers.utils.formatEther(contractBalance)).toFixed(4)} ⚖️
                  <TokenBalance name={tokenName} img={"🎈"} address={contractAddress} contracts={readContracts} />
                </div>
              </div>
            }
            size="large"
            loading={false}
          >
            {display}
          </Card>
          <Row span={12}>
            <Contract
              name="Balloons"
              signer={signer}
              provider={localProvider}
              show={["balanceOf", "approve"]}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
          </Row>
        </Col>
        <Col span={12}>
          <div style={{ padding: 20 }}>
            <Curve
              addingEth={values && values["ethToToken"] ? values["ethToToken"] : 0}
              addingToken={values && values["tokenToEth"] ? values["tokenToEth"] : 0}
              ethReserve={ethBalanceFloat}
              tokenReserve={tokenBalanceFloat}
              width={500}
              height={500}
            />
          </div>
        </Col>
      </Row>
      <div style={{ padding: "50px", maxWidth: "900px", margin: "auto" }}>
        <h3 style={{ margin: 8, fontSize: 20, fontWeight: 600 }}>How DEX works?</h3>
        <div style={{ margin: 8 }}>
          Entire logic of the DEX is in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            DEX.sol:
          </span>{" "}
          Smart contract is present in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            packages/hardhat/contracts
          </span>{" "}
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            ethToToken():
          </span>{" "}
          This function allows users to swap Ether for the token. It calculates the token output based on the current
          reserves and performs the token transfer to the caller.
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            tokenToEth():
          </span>{" "}
          This function allows users to swap the token for Ether. It calculates the Ether output based on the current
          reserves and performs the token transfer from the caller to the DEX contract. It then transfers the Ether to
          the caller.
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            deposit():
          </span>{" "}
          This function allows users to deposit tokens and Ether into the liquidity pool. The amount of tokens deposited
          is determined based on the amount of Ether sent with the function call and the current reserves.
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            withdraw():
          </span>{" "}
          This function allows users to withdraw tokens and Ether from the liquidity pool based on the amount of
          liquidity provider tokens (amount) they want to withdraw. It calculates both ETH and tokens at the correct
          ratio.
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            price():
          </span>{" "}
          This function calculates the output amount (yOutput) based on the input amount (xInput) and the reserves of
          the tokens (xReserves and yReserves). It uses the x * y = k where x and y are the reserves of the pool.
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            Ballons
          </span>{" "}
          is an ERC20 token, The
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            Ballons.sol
          </span>{" "}
          is present in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            packages/hardhat/contracts
          </span>{" "}
        </div>
      </div>
      <Transactions />
    </div>
  );
}
