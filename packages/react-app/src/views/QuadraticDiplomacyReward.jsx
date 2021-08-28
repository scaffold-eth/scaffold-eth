import React, { useState, useMemo } from "react";
import { Alert, Input, Button, Divider, Space, Typography, Table, Tag, Select, notification } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Address } from "../components";
const { Text, Title } = Typography;
const { ethers } = require("ethers");

const TOKENS = ["ETH", "GTC", "DAI"];
const REWARD_STATUS = {
  PENDING: "reward_status.pending",
  COMPLETED: "reward_status.completed",
  FAILED: "reward_status.failed",
};

export default function QuadraticDiplomacyReward({
  tx,
  writeContracts,
  mainnetContracts,
  userSigner,
  votesEntries,
  contributorEntries,
  price,
  isAdmin,
  mainnetProvider,
}) {
  const [totalRewardAmount, setTotalRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState(REWARD_STATUS.PENDING);
  const [selectedToken, setSelectedToken] = useState("");

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

  const columns = useMemo(
    () => [
      {
        title: "Address",
        dataIndex: "address",
        render: address => <Address address={address} fontSize={16} size="short" ensProvider={mainnetProvider} />,
      },
      {
        title: "Nº of votes",
        dataIndex: "vote",
        defaultSortOrder: "descend",
        align: "center",
        sorter: (a, b) => a.vote - b.vote,
      },
      {
        title: "Quadratic votes",
        dataIndex: "votesSqrt",
        align: "center",
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
        align: "center",
        sorter: (a, b) => a.rewardAmount - b.rewardAmount,
        render: rewardAmount => (
          <p>
            {rewardAmount.toFixed(2)} {selectedToken.toUpperCase()}
          </p>
        ),
      },
      {
        title: "Has Voted",
        dataIndex: "hasVoted",
        align: "center",
        filters: [
          { text: "Yes", value: true },
          { text: "No", value: false },
        ],
        onFilter: (value, record) => record.hasVoted === value,
        render: hasVoted =>
          hasVoted ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="red" />,
      },
    ],
    [mainnetProvider, selectedToken],
  );

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

  const handlePayment = async payFromSelf => {
    // ToDo. Do some validation (non-empty elements, etc.)
    const wallets = [];
    const amounts = [];

    // choose appropriate function from contract
    let func;
    if (selectedToken === "ETH") {
      dataSource.forEach(({ address, rewardAmount }) => {
        wallets.push(address);
        // Flooring some decimals to avoid rounding errors => can result in not having enough funds.
        amounts.push(ethers.utils.parseEther((Math.floor(rewardAmount * 10000) / 10000).toString()));
      });

      func = payFromSelf
        ? // payable functions need an `overrides` param.
          // relevant docs: https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
          writeContracts.QuadraticDiplomacyContract.sharePayedETH(wallets, amounts, {
            value: ethers.utils.parseEther(totalRewardAmount.toString()),
          })
        : writeContracts.QuadraticDiplomacyContract.shareETH(wallets, amounts);
    } else {
      const tokenAddress = writeContracts[selectedToken].address;
      const userAddress = await userSigner.getAddress();
      const tokenContract = writeContracts[selectedToken].connect(userSigner);
      // approve only if have to pay from self wallet
      if (payFromSelf) {
        await tx(
          tokenContract.approve(
            writeContracts.QuadraticDiplomacyContract.address,
            ethers.utils.parseUnits(totalRewardAmount.toString(), 18),
          ),
        );
      }

      dataSource.forEach(({ address, rewardAmount }) => {
        wallets.push(address);
        // Flooring some decimals to avoid rounding errors => can result in not having enough funds.
        amounts.push(ethers.utils.parseUnits((Math.floor(rewardAmount * 10000) / 10000).toString()));
      });
      func = payFromSelf
        ? writeContracts.QuadraticDiplomacyContract.sharePayedToken(wallets, amounts, tokenAddress, userAddress)
        : writeContracts.QuadraticDiplomacyContract.shareToken(wallets, amounts, tokenAddress);
    }

    await tx(func, update => {
      // ToDo. Handle errors.
      if (update && (update.status === "confirmed" || update.status === 1)) {
        notification.success({
          message: "Payment sent!",
        });
        setRewardStatus(REWARD_STATUS.COMPLETED);
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
      <Space split>
        <Input
          type="number"
          disabled={!selectedToken} // disable if no token selected
          value={totalRewardAmount}
          addonBefore="Total Amount to Distribute"
          addonAfter={
            <Select defaultValue="Select token..." onChange={setSelectedToken}>
              {TOKENS.map(tokenName => (
                <Select.Option value={tokenName}>{tokenName}</Select.Option>
              ))}
            </Select>
          }
          onChange={e => setTotalRewardAmount(e.target.value.toLowerCase())}
        />
      </Space>
      <Divider />
      <Space direction="vertical" style={{ width: "100%" }}>
        {missingVotingMembers?.length > 0 && (
          <Alert
            showIcon
            type="warning"
            message={<Title level={5}>Votes are pending from:</Title>}
            description={missingVotingMembers.map(entry => (
              <p key={entry.wallet}>
                <Address address={entry.wallet} fontSize={16} size="short" ensProvider={mainnetProvider} />
              </p>
            ))}
          />
        )}
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10 }}
          footer={() => (
            <Space>
              <Button
                onClick={() => handlePayment(true)}
                disabled={rewardStatus === REWARD_STATUS.COMPLETED || !totalRewardAmount || !dataSource?.length}
                size="large"
              >
                Pay 💸
              </Button>
              <Button
                onClick={() => handlePayment(false)}
                disabled={rewardStatus === REWARD_STATUS.COMPLETED || !totalRewardAmount || !dataSource?.length}
                size="large"
              >
                Pay from contract 💸
              </Button>
            </Space>
          )}
        />
      </Space>
      <Divider />
    </div>
  );
}
