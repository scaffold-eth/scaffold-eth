import { Button, Divider, Input, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import ERC20Artifact from "@openzeppelin/contracts/build/contracts/IERC20.json";
import { Address, ERC20Balance, Transactions } from "../components";
import { BASE_URL, bbSupportedERC20Tokens, bbNode } from "../constants";

export default function Lending({
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
  const [fromToken, setFromToken] = useState("0x6B175474E89094C44Da98b954EedeAC495271d0F");
  const [toToken, setToToken] = useState();
  const [value, setValue] = useState("");
  const [Totalliquidity, setTotalliquidity] = useState("0");
  const [yourLiquidity, setYourLiquidity] = useState("0");
  const [yourBorrowamount, setYourBorrowamount] = useState("0");
  const [daitoborrow, setDaitoborrow] = useState("");
  const [repay, setRepay] = useState("");
  const [withdraw, setWithdraw] = useState("");
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

  async function approveToken() {
    if (fromToken) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const ERC20Contract = new ethers.Contract(fromToken, erc20ABI, signer);
      const allowance = await ERC20Contract.allowance(
        await signer.getAddress(),
        writeContracts.LendingProtocol.address,
      );
      const totalLiquidity = await writeContracts.LendingProtocol.getLiquidity();
      setTotalliquidity(totalLiquidity.toString());
      const borrowamount = await writeContracts.LendingProtocol.getBorrowAmount(await signer.getAddress());
      setYourBorrowamount(borrowamount.toString());
      const yourliquidity = await writeContracts.LendingProtocol.getBalance(await signer.getAddress());
      setYourLiquidity(yourliquidity.toString());
      try {
        if (utils.parseUnits(value, 18).gt(allowance)) {
          const approveTx = await ERC20Contract.approve(
            writeContracts.LendingProtocol.address,
            ethers.constants.MaxUint256,
          );
          await approveTx.wait();
          setIsTokenApproved(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function fetchdata() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const totalLiquidity = await writeContracts.LendingProtocol.getLiquidity();
    setTotalliquidity(totalLiquidity.toString());
    const borrowamount = await writeContracts.LendingProtocol.getBorrowAmount(await signer.getAddress());
    setYourBorrowamount(borrowamount.toString());
    const yourliquidity = await writeContracts.LendingProtocol.getBalance(await signer.getAddress());
    setYourLiquidity(yourliquidity.toString());
  }

  useEffect(() => {
    (async function () {
      if (fromToken && value) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const ERC20Contract = new ethers.Contract(fromToken, erc20ABI, signer);
        const allowance = await ERC20Contract.allowance(
          await signer.getAddress(),
          writeContracts.LendingProtocol.address,
        );
        const totalLiquidity = await writeContracts.LendingProtocol.getLiquidity();
        setTotalliquidity(totalLiquidity.toString());
        const borrowamount = await writeContracts.LendingProtocol.getBorrowAmount(await signer.getAddress());
        setYourBorrowamount(borrowamount.toString());
        const yourliquidity = await writeContracts.LendingProtocol.getBalance(await signer.getAddress());
        setYourLiquidity(yourliquidity.toString());
        try {
          if (value && utils.parseUnits(value, 18).lte(allowance)) {
            setIsTokenApproved(true);
          } else {
            setIsTokenApproved(false);
          }
        } catch (err) {
          setIsTokenApproved(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, value, daitoborrow, repay, withdraw]);

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
        <h2>Lending and Borrowing :</h2>
        <h4>Lend Eth and borrow DAI tokens </h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <h4> Total liquidity: {ethers.utils.formatEther(Totalliquidity)} </h4>
          <h4> liquidity provided : {ethers.utils.formatEther(yourLiquidity)} </h4>
          <h4> Borrowed Amount: {ethers.utils.formatEther(yourBorrowamount)} </h4>
          <h4> Add liquidity(DAI token) </h4>
          <Input
            placeholder="DAI Value"
            style={{ textAlign: "center" }}
            onChange={e => {
              setValue(e.target.value);
            }}
          />
          <Button style={{ marginTop: 8 }} onClick={approveToken} disabled={!(fromToken && value)}>
            {isTokenApproved ? "Approved ✅" : "Approve token"}
          </Button>
          <Button
            style={{ marginTop: 8 }}
            disabled={!(fromToken && value)}
            onClick={async () => {
              if (!isTokenApproved) {
                notification.error({
                  message: "Add Liquidity Error",
                  description: "You need to approve token first",
                });

                return;
              }

              const result = tx(
                writeContracts.LendingProtocol.addLiquidity(utils.parseUnits(value, fromToken.decimals)),
                update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    fetchdata();
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
            Add Liqudity!
          </Button>
          <br /> <br />
          <h4> Borrow DAI tokens </h4>
          <Input
            placeholder="DAI amount to borrow"
            style={{ textAlign: "center" }}
            onChange={e => {
              setDaitoborrow(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            disabled={!daitoborrow}
            onClick={async () => {
              const ethamount = 2 * daitoborrow;
              const result = tx(
                writeContracts.LendingProtocol.borrow(utils.parseUnits(daitoborrow, fromToken.decimals), {
                  value: ethers.utils.parseEther(ethamount.toString()),
                }),
                update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    fetchdata();
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
            Borrow!
          </Button>
          <br /> <br />
          <h4> Withdraw Liquidity </h4>
          <Input
            placeholder="withdraw DAI amount"
            style={{ textAlign: "center" }}
            onChange={e => {
              setWithdraw(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            disabled={!withdraw}
            onClick={async () => {
              const result = tx(
                writeContracts.LendingProtocol.withdraw(utils.parseUnits(withdraw, fromToken.decimals)),
                update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    fetchdata();
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
            withdraw!
          </Button>
          <h4> Repay loan </h4>
          <Input
            placeholder="Repay DAI amount"
            style={{ textAlign: "center" }}
            onChange={e => {
              setRepay(e.target.value);
            }}
          />
          <br />
          <br />
          <Button style={{ marginTop: 8 }} onClick={approveToken} disabled={!(fromToken && repay)}>
            {isTokenApproved ? "Approved ✅" : "Approve token"}
          </Button>
          <Button
            style={{ marginTop: 8 }}
            disabled={!repay}
            onClick={async () => {
              const result = tx(
                writeContracts.LendingProtocol.repay(utils.parseUnits(repay, fromToken.decimals)),
                update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    fetchdata();
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
            Repay!
          </Button>
        </div>
        {/* <Divider /> */}
      </div>
      <div style={{ padding: "50px", maxWidth: "900px", margin: "auto" }}>
        <h3 style={{ margin: 8, fontSize: 20, fontWeight: 600 }}>How Lending works?</h3>
        <div style={{ margin: 8 }}>
          Entire logic of the Lending is in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            lending.sol:
          </span>{" "}
          Smart contract is present in
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            packages/hardhat/contracts
          </span>{" "}
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            addLiquidity():
          </span>{" "}
          This function allows users to deposit DAI tokens into the contract
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            borrow():
          </span>{" "}
          This function allows users to borrow lending tokens, using collateral tokens as collateral
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            repay():
          </span>{" "}
          This function allows users to repay borrowed lending tokens and retrieve collateral tokens.
          <br />
          <br />
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            withdraw():
          </span>{" "}
          Function to withdraw collateral tokens from the contract.
        </div>
      </div>

      {isBuildbearNet ? <Transactions /> : null}
    </div>
  );
}
