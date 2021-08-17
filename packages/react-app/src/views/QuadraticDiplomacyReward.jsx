import React, { useState, useMemo } from "react";
import { Button, Card, Divider, Space, Typography, Badge, notification } from "antd";
import { Address, EtherInput } from "../components";
const { Text, Title } = Typography;
const { ethers } = require("ethers");

const REWARD_STATUS = {
  PENDING: "reward_status.pending",
  COMPLETED: "reward_status.completed",
  FAILED: "reward_status.failed",
};

export default function QuadraticDiplomacyReward({ userSigner, votesEntries, price }) {
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState({});

  const [voteResults, totalSqrtVotes] = useMemo(() => {
    const votes = {};
    let sqrts = 0;
    votesEntries.forEach(entry => {
      const sqrtVote = Math.sqrt(entry.amount.toNumber());
      if (!votes[entry.wallet]) {
        votes[entry.wallet] = {
          name: entry.name,
          sqrtVote: 0,
        };
      }
      votes[entry.wallet].sqrtVote += sqrtVote;
      sqrts += sqrtVote;
    });
    return [votes, sqrts];
  }, [votesEntries]);

  const handlePayment = async (address, amount) => {
    if (rewardStatus[address] === REWARD_STATUS.COMPLETED || !amount) {
      return;
    }

    setRewardStatus(prev => ({
      ...prev,
      [address]: REWARD_STATUS.PENDING,
    }));

    try {
      await userSigner.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(amount.toString()),
      });

      setRewardStatus(prev => ({
        ...prev,
        [address]: REWARD_STATUS.COMPLETED,
      }));

      notification.success({
        message: "Payment sent!",
      });
    } catch (error) {
      notification.error({
        message: "Payment Transaction Error",
        description: error.toString(),
      });
      setRewardStatus(prev => ({
        ...prev,
        [address]: REWARD_STATUS.FAILED,
      }));
    }
  };

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
      <Title level={3}>Reward Contributors</Title>
      <Title level={5}>
        Total sqrt votes:&nbsp;&nbsp;
        <Badge
          showZero
          overflowCount={100000}
          count={totalSqrtVotes.toFixed(2)}
          style={{ backgroundColor: "#52c41a" }}
        />
      </Title>
      <Divider />
      <EtherInput autofocus placeholder="Reward amount" value={rewardAmount} onChange={setRewardAmount} price={price} />
      <Divider />
      <Space direction="vertical" style={{ width: "100%" }}>
        {Object.entries(voteResults).map(([address, contributor]) => {
          const contributorShare = contributor.sqrtVote / totalSqrtVotes;
          const contributorReward = contributorShare * rewardAmount;

          return (
            <Card
              title={contributor.name}
              extra={
                <Button
                  onClick={() => handlePayment(address, contributorReward)}
                  disabled={
                    (rewardStatus[address] && rewardStatus[address] !== REWARD_STATUS.FAILED) || !contributorReward
                  }
                >
                  Pay 💸
                </Button>
              }
              key={address}
            >
              <p>
                <strong>Wallet: </strong> <Address address={address} fontSize={16} size="short" />
              </p>
              <p>
                <strong>Votes sqrt: </strong>
                {contributor.sqrtVote.toFixed(2)} <Text type="secondary">({(contributorShare * 100).toFixed(2)}%)</Text>
              </p>
              <p>
                <strong>Reward amount: </strong>
                {contributorReward.toFixed(2)} ETH
              </p>
            </Card>
          );
        })}
      </Space>
      <Divider />
    </div>
  );
}
