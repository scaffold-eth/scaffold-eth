import React, { useState, useMemo } from "react";
import { Alert, Button, Divider, Space, Typography, Table, Tag, Row, Col, notification } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Address, EtherInput } from "../components";
const { Text, Title } = Typography;
const { ethers } = require("ethers");

const REWARD_STATUS = {
  PENDING: "reward_status.pending",
  COMPLETED: "reward_status.completed",
  FAILED: "reward_status.failed",
};
const columns = [
  {
    title: "Address",
    dataIndex: "address",
    render: address => <Address address={address} fontSize={16} size="short" />,
  },
  {
    title: "Number of votes",
    dataIndex: "vote",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.vote - b.vote,
  },
  {
    title: "Quadratic votes",
    dataIndex: "votesSqrt",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.votesSqrt - b.votesSqrt,
    render: (votesSqrt, record) => (
      <p>
        {votesSqrt.toFixed(2)} <Text type="secondary">({(record.votesShare * 100).toFixed(2)}%)</Text>
      </p>
    ),
  },
  {
    title: "Reward Amount",
    dataIndex: "rewardAmount",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.rewardAmount - b.rewardAmount,
    render: rewardAmount => <p>{rewardAmount.toFixed(6)} ETH</p>,
  },
  {
    title: "Has Voted",
    dataIndex: "hasVoted",
    filters: [
      { text: "Yes", value: true },
      { text: "No", value: false },
    ],
    onFilter: (value, record) => record.hasVoted === value,
    render: hasVoted =>
      hasVoted ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="red" />,
  },
];

export default function QuadraticDiplomacyReward({
  tx,
  writeContracts,
  votesEntries,
  contributorEntries,
  price,
  isAdmin,
}) {
  const [totalRewardAmount, setTotalRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState(REWARD_STATUS.PENDING);

  const [voteResults, totalVotes, totalSqrtVotes, totalSquare] = useMemo(() => {
    const votes = {};
    let voteCount = 0;
    let sqrts = 0;
    let total = 0;
    votesEntries.forEach(entry => {
      const vote = entry.amount.toNumber();
      const sqrtVote = Math.sqrt(vote);
      if (!votes[entry.wallet]) {
        votes[entry.wallet] = {
          vote: 0,
          // Sum of the square root of the votes for each member.
          sqrtVote: 0,
          hasVoted: false,
        };
      }
      votes[entry.wallet].sqrtVote += sqrtVote;
      votes[entry.wallet].vote += vote;

      if (!votes[entry.wallet].hasVoted) {
        votes[entry.wallet].hasVoted = entry.votingAddress === entry.wallet;
      }

      voteCount += vote;
      // Total sum of the sum of the square roots of the votes for all members.
      sqrts += sqrtVote;
    });

    Object.entries(votes).forEach(([wallet, { sqrtVote }]) => {
      total += Math.pow(sqrtVote, 2);
    });

    return [votes, voteCount, sqrts, total];
  }, [votesEntries]);

  const dataSource = useMemo(
    () =>
      Object.entries(voteResults).map(([address, contributor]) => ({
        key: address,
        address: address,
        vote: contributor?.vote,
        votesSqrt: contributor?.sqrtVote,
        votesShare: Math.pow(contributor?.sqrtVote, 2) / totalSquare,
        rewardAmount: (Math.pow(contributor?.sqrtVote, 2) / totalSquare) * totalRewardAmount,
        hasVoted: contributor?.hasVoted,
      })),
    [votesEntries, totalSquare, totalRewardAmount],
  );

  const missingVotingMembers = contributorEntries?.filter(entry => !voteResults[entry.wallet]?.hasVoted);

  const handlePayment = async () => {
    // ToDo. Do some validation (non-empty elements, etc.)
    const wallets = [];
    const amounts = [];
    // payable functions need an `overrides` param.
    // relevant docs: https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
    const overrides = {
      value: ethers.utils.parseEther(totalRewardAmount.toString()),
    };

    dataSource.forEach(({ address, rewardAmount }) => {
      wallets.push(address);
      amounts.push(ethers.utils.parseEther(rewardAmount.toString()));
    });

    await tx(writeContracts.QuadraticDiplomacyContract.payMultiple(wallets, amounts, overrides), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        notification.success({
          message: "Payment sent!",
        });
        setRewardStatus(REWARD_STATUS.COMPLETED);
      } else {
        notification.error({
          message: "Payment Transaction Error",
        });
        setRewardStatus(REWARD_STATUS.FAILED);
      }
    });
  };

  if (!isAdmin) {
    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
        <Title level={4}>Access denied</Title>
        <p>Only admins can send rewards.</p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
      <Title level={3}>Reward Contributors</Title>
      <Title level={5}>
        Total votes:&nbsp;&nbsp;
        <Tag color="#000000">{totalVotes}</Tag>
      </Title>
      <Title level={5}>
        Total Quadratic votes:&nbsp;&nbsp;
        <Tag color="#52c41a">{totalSqrtVotes.toFixed(2)}</Tag>
      </Title>
      <Divider />
      <Row justify="center">
        <Col sm={10}>
          <EtherInput
            autofocus
            placeholder="Reward amount"
            value={totalRewardAmount}
            onChange={setTotalRewardAmount}
            price={price}
          />
        </Col>
      </Row>
      <Divider />
      <Space direction="vertical" style={{ width: "100%" }}>
        {missingVotingMembers?.length > 0 && (
          <Alert
            showIcon
            type="warning"
            message={<Title level={5}>Votes are pending from:</Title>}
            description={missingVotingMembers.map(entry => (
              <p key={entry.wallet}>
                <Address address={entry.wallet} fontSize={16} size="short" /> (<Text type="danger">{entry.name}</Text>)
              </p>
            ))}
          ></Alert>
        )}
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10 }}
          footer={() => (
            <Button
              onClick={handlePayment}
              disabled={rewardStatus === REWARD_STATUS.COMPLETED || !totalRewardAmount || !dataSource?.length}
              size="large"
            >
              Pay 💸
            </Button>
          )}
        />
      </Space>
      <Divider />
    </div>
  );
}
