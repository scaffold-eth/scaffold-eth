import React, { useEffect, useState, useMemo } from "react";
import { Button, Checkbox, Divider, Space, List, Steps, Typography, Badge, Spin, Row, Col } from "antd";
import { SmileTwoTone, LikeTwoTone, CheckCircleTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Address } from "../components";
const { Title, Text } = Typography;
const axios = require("axios");

export default function QuadraticDiplomacyVote({
  contributorEntries,
  isVoter,
  mainnetProvider,
  currentDistribution,
  address,
  userSigner,
  serverUrl,
}) {
  const [selectedContributors, setSelectedContributors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [spentVoteTokens, setSpentVoteTokens] = useState(0);
  const [isSendingTx, setIsSendingTx] = useState(false);

  if (Object.keys(selectedContributors).length === 0 && currentDistribution.id) {
    setSelectedContributors(
      currentDistribution.members.reduce((entries, current) => {
        entries[current] = 0;
        return entries;
      }, {}),
    );
  }

  const contributors = useMemo(
    () =>
      currentDistribution.id &&
      currentDistribution.members.reduce((entries, current) => {
        entries[current] = 0;
        return entries;
      }, {}),
    [currentDistribution.id],
  );

  const remainingVoteTokens = useMemo(
    () => currentDistribution.id && currentDistribution.voteAllocation - spentVoteTokens,
    [currentDistribution.id, spentVoteTokens],
  );

  if (!isVoter) {
    return (
      <div style={{ border: "1px solid", padding: "40px", width: 800, margin: "auto", marginTop: 64, textAlign: "left" }}>
        <Title level={4} style={{ fontFamily: "Space Mono" }}>Access denied</Title>
        <p>You are not part of the members of this election.</p>
      </div>
    );
  }

  const handleContributorVote = (e, op, clickedContributorAddress) => {
    // adjust available vote tokens
    setSpentVoteTokens(prevSpentVoteTokens => (op === "add" ? prevSpentVoteTokens + 1 : prevSpentVoteTokens - 1));

    // update contributor vote tokens
    setSelectedContributors(prevSelectedContributors => ({
      ...prevSelectedContributors,
      [clickedContributorAddress]:
        op === "add"
          ? Math.min(prevSelectedContributors[clickedContributorAddress] + 1, currentDistribution.voteAllocation)
          : Math.max(prevSelectedContributors[clickedContributorAddress] - 1, 0),
    }));
  };

  const handleSubmitVotes = async () => {
    const wallets = [];
    const amounts = [];

    const sortedVotes = Object.keys(selectedContributors).sort();

    const message =
      "qdip-vote-" +
      currentDistribution.id +
      address.toLowerCase() +
      sortedVotes.join() +
      sortedVotes.map(voter => selectedContributors[voter]).join();

    const signature = await userSigner.signMessage(message);

    setIsSendingTx(true);

    axios
      .post(serverUrl + "distributions/" + currentDistribution.id + "/vote", {
        address: address,
        votes: selectedContributors,
        signature: signature,
      })
      .then(response => {
        console.log(response);
        setIsSendingTx(false);
        setSpentVoteTokens(0);
        setCurrentStep(2);
      })
      .catch(e => {
        console.log("Error on vote");
        setIsSendingTx(false);
      });
  };

  if (!currentDistribution.id) {
    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
        <Title level={4}>No Current Distribution</Title>
      </div>
    );
  }

  if (
    currentDistribution.id &&
    currentStep != 2 &&
    currentDistribution.votes &&
    currentDistribution.votes[address]
  ) {
    setSelectedContributors(currentDistribution.votes[address]);
    setCurrentStep(2);
  }

  return (
    <div style={{ border: "1px solid", padding: "40px", width: 800, margin: "auto", marginTop: 64, textAlign: "left" }}>
      <Title level={3}>Distribution {currentDistribution.id}</Title>
      <Divider />
      {currentStep === 1 ? (
        <List
          size="large"
          itemLayout="horizontal"
          style={{ width: "600px", margin: "0 auto" }}
          header={
            <Space direction="vertical">
              <Title level={4} style={{ fontFamily: "Space Mono" }}>Allocate votes</Title>
              <Title level={5}>
                Remaining vote tokens:&nbsp;&nbsp;
                <Badge
                  showZero
                  overflowCount={1000}
                  count={remainingVoteTokens}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Title>
            </Space>
          }
          footer={
            <Row justify="end">
              {!isSendingTx ? (
                <>
                  <Button type="primary" onClick={handleSubmitVotes}>
                    Commit votes
                  </Button>
                </>
              ) : (
                <Spin size="small" />
              )}
            </Row>
          }
          dataSource={Object.entries(selectedContributors)}
          renderItem={([contributorAddress, contributor]) => (
            <>
              <Badge.Ribbon
                showZero
                overflowCount={1000}
                text={<Title level={5}>{contributor} </Title>}
                style={{
                  backgroundColor: contributor ? "#eb2f96" : "grey",
                  height: 24,
                  width: 30,
                  marginRight: -5,
                }}
              />
              <List.Item
                key={contributorAddress}
                extra={
                  <Button.Group>
                    <Button
                      danger
                      ghost
                      onClick={e => handleContributorVote(e, "remove", contributorAddress)}
                      disabled={!contributor}
                    >
                      <MinusOutlined />
                    </Button>
                    <Button
                      type="primary"
                      ghost
                      onClick={e => handleContributorVote(e, "add", contributorAddress)}
                      disabled={!remainingVoteTokens}
                    >
                      <PlusOutlined />
                    </Button>
                  </Button.Group>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Address address={contributorAddress} fontSize={16} size="short" ensProvider={mainnetProvider} />
                  }
                />
              </List.Item>
            </>
          )}
        />
      ) : (
        currentStep === 2 && (
          <>
            <Title level={3} style={{ fontFamily: "Space Mono" }}>Thank you for voting.</Title>
            <p>The allocation to this workstream will be informed by your votes.</p>
            <Title level={5} style={{ marginTop: "24px" }}>Your votes:</Title>
            {Object.entries(selectedContributors).map(([contributorAddress, voteTokens]) => (
              <p key={contributorAddress}>
                <Address address={contributorAddress} fontSize={16} size="short" ensProvider={mainnetProvider} /> (
                <Text>{voteTokens}</Text>)
              </p>
            ))}
          </>
        )
      )}
    </div>
  );
}
