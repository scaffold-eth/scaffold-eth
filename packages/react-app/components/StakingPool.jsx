import React, { useEffect, useState } from "react";
import { Card, Input, Button } from "antd";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";
import { getFromIPFS } from "../helpers/ipfs";

function StakingPool({ id, address, tx, writeContracts, readContracts }) {
  const [details, setDetails] = useState({ name: "Hello Sample Pool" });
  const [stakeAmount, setStakeAmount] = useState(0);
  const zero = ethers.BigNumber.from(0);

  const poolBalance = useContractReader(readContracts, "StakingGTC", "getPoolBalance", [id]) || zero;
  const userPoolBalance = useContractReader(readContracts, "StakingGTC", "getUserPoolBalance", [id, address]) || zero;
  const userTokenBalance = useContractReader(readContracts, "GTC", "balanceOf", [address]) || zero;
  const poolDetails = useContractReader(readContracts, "StakingGTC", "getPoolDetailsCID", [id]) || "";

  const fetchDetailsFromIPFS = async hash => {
    console.log(`Pool hash`, hash);
    const data = await getFromIPFS(hash);
    const _details = JSON.parse(data.toString());

    setDetails(_details);
  };

  const approveContract = async () => {
    const result = tx(
      writeContracts.GTC.approve(readContracts.StakingGTC.address, ethers.utils.parseUnits("" + stakeAmount)),
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
  };

  const stakePool = async () => {
    const result = tx(writeContracts.StakingGTC.stakePool(id, ethers.utils.parseUnits("" + stakeAmount)), update => {
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
  };

  const unstakePool = async () => {
    const result = tx(writeContracts.StakingGTC.unstakePool(id), update => {
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
  };

  // fetch all details of this pool from IPFS
  useEffect(() => {
    if (poolDetails && poolDetails.length > 0) {
      fetchDetailsFromIPFS(poolDetails);
    }
  }, [poolDetails]);

  return (
    <Card
      size="small"
      title={details.name}
      extra={<span>Pool TVL: {ethers.utils.formatEther(poolBalance).toString()} GTC</span>}
      style={{ width: "100%" }}
    >
      {/* Hello Sample Pool {id}. Your Balance for this pool is {ethers.utils.formatUnits(userPoolBalance).toString()} */}
      <div className="w-full flex flex-1 justify-between items-center">
        {/* Stake */}
        <div className="flex flex-1 border flex-col py-4 px-10">
          <div className="text-center w-full">
            Stake from GTC Balance of {ethers.utils.formatEther(userTokenBalance).toString()}
          </div>
          <div className="mt-4">
            <Input
              type="number"
              addonAfter={<span>GTC</span>}
              value={stakeAmount}
              onChange={e => setStakeAmount(e.target.value)}
            />
          </div>
          <div className="mt-4 text-center">
            <Button onClick={approveContract}>Approve Contract</Button>
            <span className="mr-2" />
            <Button onClick={stakePool}>Stake</Button>
          </div>
        </div>

        <div className="mr-4" />

        {/* Unstake */}
        <div className="flex flex-1 border flex-col py-4 px-10 h-full">
          <div className="text-center w-full">Unstake</div>
          <div className="mt-4 text-center">
            <Button onClick={unstakePool}>Unstake {ethers.utils.formatEther(userPoolBalance).toString()} GTC</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StakingPool;
