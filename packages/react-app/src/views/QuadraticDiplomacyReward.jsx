import React, { useState, useMemo } from "react";
import { Alert, Input, Button, Divider, Space, Typography, Table, Tag, Select, notification, Spin } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Address } from "../components";
const { Text, Title } = Typography;
const { ethers } = require("ethers");
const axios = require("axios");

const TOKENS = ["ETH", "GTC", "DAI"];
const REWARD_STATUS = {
  PENDING: "reward_status.pending",
  COMPLETED: "reward_status.completed",
  FAILED: "reward_status.failed",
};
const VOTING_TYPES = ["Quadratic", "Common"];

export default function QuadraticDiplomacyReward({
  tx,
  writeContracts,
  userSigner,
  isAdmin,
  mainnetProvider,
  currentDistribution,
  serverUrl,
  address,
}) {
  const [totalRewardAmount, setTotalRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState(REWARD_STATUS.PENDING);
  const [selectedToken, setSelectedToken] = useState("");
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [votingType, setVotingType] = useState("Quadratic");

  const [voteResults, totalVotes, totalSqrtVotes, totalSquare] = useMemo(() => {
    const votes = {};
    let voteCount = 0;
    let sqrts = 0;
    let total = 0;

    if (!currentDistribution.id) {
      return [0, 0, 0, 0];
    }

    Object.entries(currentDistribution.votes).forEach(memberVotes => {
      const votingAddress = memberVotes[0];
      const selectedContributors = memberVotes[1];

      const sortedVotes = Object.keys(selectedContributors).sort();

      const message =
        "qdip-vote-" +
        currentDistribution.id +
        votingAddress +
        sortedVotes.join() +
        sortedVotes.map(voter => selectedContributors[voter]).join();

      const recovered = ethers.utils.verifyMessage(message, currentDistribution.votesSignatures[votingAddress]);

      if (!votes[votingAddress]) {
        votes[votingAddress] = {
          vote: 0,
          // Sum of the square root of the votes for each member.
          sqrtVote: 0,
          hasVoted: true,
          verifiedSignature: recovered.toLowerCase() === votingAddress.toLowerCase(),
        };
      } else {
        votes[votingAddress].hasVoted = true;
        votes[votingAddress].verifiedSignature = recovered.toLowerCase() === votingAddress.toLowerCase();
      }

      Object.entries(selectedContributors).forEach(voteInfo => {
        const contributor = voteInfo[0];
        const vote = voteInfo[1];
        let sqrtVote = Math.sqrt(vote);
        if (votingType === "Common") {
          sqrtVote = vote;
        }

        if (!votes[contributor]) {
          votes[contributor] = {
            vote: 0,
            // Sum of the square root of the votes for each member.
            sqrtVote: 0,
          };
        }

        votes[contributor].sqrtVote += sqrtVote;
        votes[contributor].vote += vote;

        voteCount += vote;
        // Total sum of the sum of the square roots of the votes for all members.
        sqrts += sqrtVote;
      });
    });

    Object.entries(votes).forEach(([wallet, { sqrtVote }]) => {
      if (votingType === "Common") {
        total += sqrtVote;
      } else {
        total += Math.pow(sqrtVote, 2);
      }
    });

    return [votes, voteCount, sqrts, total];
  }, [currentDistribution.id, currentDistribution.id && Object.keys(currentDistribution.votes).sort().join(), votingType]);

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
        title: votingType + " votes",
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
      {
        title: "Verified",
        dataIndex: "verifiedSignature",
        align: "center",
        filters: [
          { text: "Yes", value: true },
          { text: "No", value: false },
        ],
        onFilter: (value, record) => record.verifiedSignature === value,
        render: verifiedSignature =>
          verifiedSignature ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="red" />,
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
        votesShare:
          votingType === "Quadratic"
            ? contributor?.sqrtVote / totalSqrtVotes
            : contributor?.sqrtVote / totalSquare,
        rewardAmount:
          votingType === "Quadratic"
            ? (contributor?.sqrtVote / totalSqrtVotes) * totalRewardAmount
            : (contributor?.sqrtVote / totalSquare) * totalRewardAmount,
        hasVoted: contributor?.hasVoted,
        verifiedSignature: contributor?.verifiedSignature,
      })),
    [voteResults, totalSquare, totalRewardAmount],
  );

  const missingVotingMembers =
    currentDistribution.id &&
    currentDistribution.members
      ?.filter(wallet => !voteResults[wallet]?.hasVoted)
      // Remove duplicated.
      .filter((item, pos, self) => self.indexOf(item) === pos);

  const handleFinishDistribution = async finishDistribution => {
    const message = "qdip-finish-" + currentDistribution.id + address;
    const signature = await userSigner.signMessage(message);

    setIsSendingTx(true);

    axios
      .post(serverUrl + "distributions/" + currentDistribution.id + "/finish", {
        address: address,
        signature: signature,
      })
      .then(response => {
        setIsSendingTx(false);
        setRewardStatus(REWARD_STATUS.COMPLETED);
      })
      .catch(e => {
        console.log("Error finishing the distribution");
        setIsSendingTx(false);
      });
  };

  const handlePayment = async function payFromSelf(close) {
    // ToDo. Do some validation (non-empty elements, etc.)
    const wallets = [];
    const amounts = [];

    setIsSendingTx(true);
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

        if (close) {
          handleFinishDistribution();
        } else {
          setIsSendingTx(false);
        }
      } else if (update.error) {
        setIsSendingTx(false);
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

  if (!currentDistribution.id) {
    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
        <Title level={4}>No Current Distribution</Title>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
      <Title level={3}>Reward Contributors {currentDistribution.id}</Title>
      <Title level={5}>
        Total votes:&nbsp;&nbsp;
        <Tag color="#000000">{totalVotes}</Tag>
      </Title>
      <Title level={5}>
        Total {votingType} votes:&nbsp;&nbsp;
        <Tag color="#52c41a">{totalSqrtVotes.toFixed(2)}</Tag>
        <Select defaultValue={votingType} onChange={setVotingType}>
          {VOTING_TYPES.map(vType => (
            <Select.Option value={vType}>{vType}</Select.Option>
          ))}
        </Select>
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
            message={<Title level={5}>{missingVotingMembers.length} members has not voted yet:</Title>}
            description={missingVotingMembers.map(wallet => (
              <p key={wallet}>
                <Address address={wallet} fontSize={16} size="short" ensProvider={mainnetProvider} />
              </p>
            ))}
          />
        )}
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 100, hideOnSinglePage: true }}
          footer={() =>
            !isSendingTx ? (
              <Space>
                <Button
                  onClick={() => handlePayment(false)}
                  disabled={rewardStatus === REWARD_STATUS.COMPLETED || !totalRewardAmount || !dataSource?.length}
                  size="large"
                >
                  Pay 💸
                </Button>
                <Button
                  onClick={() => handlePayment(true)}
                  disabled={rewardStatus === REWARD_STATUS.COMPLETED || !totalRewardAmount || !dataSource?.length}
                  size="large"
                >
                  Pay and Close 💸🔒
                </Button>
                <Button
                  onClick={() => { if (confirm("Are you sure you want to close the distribution? You can't send payments after a distribution is closed.")) { handleFinishDistribution() }}}
                  size="large"
                >
                  Just Close 🔒
                </Button>
              </Space>
            ) : (
              <Spin size="small" />
            )
          }
        />
      </Space>
      <Divider />
    </div>
  );
}
