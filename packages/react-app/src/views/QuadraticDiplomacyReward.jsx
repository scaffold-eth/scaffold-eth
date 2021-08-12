import {
  Form,
  Input,
  Button,
  Card,
  Divider,
  Space,
  Typography,
  notification
} from 'antd'
const { Text } = Typography;
const { ethers } = require("ethers");

import React, {useEffect, useState} from "react"

const REWARD_STATUS = {
  PENDING: 'reward_status.pending',
  COMPLETED: 'reward_status.completed',
  FAILED: 'reward_status.failed',
}

export default function QuadraticDiplomacyReward({
  userSigner,
  votesEntries
}) {
  const [voteResults, setVoteResults] = useState({});
  const [totalSqrtVotes, setTotalSqrtVotes] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState({});

  useEffect(async() => {
    const calculatedVotes = {};
    let totalSqrts = 0;
    for (const entry of votesEntries) {
      const sqrtVote = Math.sqrt(entry.amount.toNumber());

      if (!calculatedVotes[entry.wallet]) {
        calculatedVotes[entry.wallet] = {
          name: entry.name,
          sqrtVote: 0,
        };
      }

      calculatedVotes[entry.wallet].sqrtVote += sqrtVote;
      totalSqrts += sqrtVote;
    }

    setVoteResults(calculatedVotes);
    setTotalSqrtVotes(totalSqrts);
  }, [votesEntries]);

  const handlePayment = async(address, amount) => {
    if (rewardStatus[address] === REWARD_STATUS.COMPLETED || !amount) {
      return;
    }

    setRewardStatus((prev) => ({
      ...prev,
      [address]: REWARD_STATUS.PENDING,
    }))

    try {
      await userSigner.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(amount.toString())
      })

      setRewardStatus((prev) => ({
        ...prev,
        [address]: REWARD_STATUS.COMPLETED,
      }))

      notification.success({
        message: "Payment sent!"
      });
    } catch (error) {
      notification.error({
        message: "Payment Transaction Error",
        description: error.toString(),
      });
      setRewardStatus((prev) => ({
        ...prev,
        [address]: REWARD_STATUS.FAILED,
      }))
    }
  }

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
      <h4><strong>Reward</strong></h4>
      <p><strong>Total sqrt votes</strong>: {totalSqrtVotes.toFixed(2)}</p>
      <Form.Item
        label="Reward amount"
        name="reward_amount"
      >
        <Input
          type="number"
          addonAfter="ETH"
          onChange={event => setRewardAmount(event.target.value)}
        />
      </Form.Item>

      <Divider />
      <Space direction="vertical" style={{ width: '100%' }}>
        {Object.entries(voteResults).map(([address, contributor]) => {
          const contributorShare = contributor.sqrtVote / totalSqrtVotes;
          const contributorReward = contributorShare * rewardAmount;

          return (
            <Card
              title={contributor.name}
              extra={(
                <Button
                  onClick={() => handlePayment(address, contributorReward)}
                  disabled={rewardStatus[address] && rewardStatus[address] !== REWARD_STATUS.FAILED || !contributorReward}
                >
                  Pay 💸
                </Button>
              )}
              key={address}
            >
              <p><strong>Wallet: </strong> {address.slice(0, 6) + '...' + address.slice(-4)}</p>
              <p><strong>Votes sqrt: </strong>
                {contributor.sqrtVote.toFixed(2)}
                {" "}
                <Text type="secondary">({(contributorShare * 100).toFixed(2)}%)</Text>
              </p>
              <p><strong>Reward amount: </strong>
                {contributorReward.toFixed(2)} ETH
              </p>
            </Card>
          )
        })}
      </Space>
      <Divider />
    </div>
  );
}
