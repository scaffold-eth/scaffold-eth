import React, { useEffect, useState, useMemo } from "react";
import { Button, Checkbox, Divider, Space, List, Steps, Typography, Badge, Spin, Row, Col } from "antd";
import { SmileTwoTone, LikeTwoTone, CheckCircleTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Address } from "../components";
const { Title, Text } = Typography;

export default function QuadraticDiplomacyVote({
  voteCredits,
  contributorEntries,
  tx,
  writeContracts,
  isVoter,
  mainnetProvider,
}) {
  const [selectedContributors, setSelectedContributors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [spentVoteTokens, setSpentVoteTokens] = useState(0);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const availableVoteTokens = voteCredits?.toNumber() ?? 0;
  const remainingVoteTokens = availableVoteTokens - spentVoteTokens;

  const contributors = useMemo(
    () =>
      contributorEntries.reduce((entries, current) => {
        entries[current.wallet] = 0;
        return entries;
      }, {}),
    [contributorEntries],
  );
  const allContributorsSelected = Object.keys(contributors).length === Object.keys(selectedContributors).length;

  if (!isVoter) {
    return (
      <div style={{ border: "1px solid", padding: "40px", width: 800, margin: "auto", marginTop: 64, textAlign: "left" }}>
        <Title level={4} style={{ fontFamily: "Space Mono" }}>Access denied</Title>
        <p>You are not part of the members of this election.</p>
      </div>
    );
  }

  const handleSelectAllContributors = () =>
    allContributorsSelected ? setSelectedContributors({}) : setSelectedContributors(contributors);

  const handleContributorSelection = (e, contributorAddress) => {
    setSelectedContributors(prevSelectedContributors => {
      if (prevSelectedContributors[contributorAddress] !== undefined) {
        const state = { ...prevSelectedContributors };
        delete state[contributorAddress];
        return state;
      } else {
        return {
          ...prevSelectedContributors,
          [contributorAddress]: contributors[contributorAddress],
        };
      }
    });
  };

  const handleContributorVote = (e, op, clickedContributorAddress) => {
    // adjust available vote tokens
    setSpentVoteTokens(prevSpentVoteTokens => (op === "add" ? prevSpentVoteTokens + 1 : prevSpentVoteTokens - 1));

    // update contributor vote tokens
    setSelectedContributors(prevSelectedContributors => ({
      ...prevSelectedContributors,
      [clickedContributorAddress]:
        op === "add"
          ? Math.min(prevSelectedContributors[clickedContributorAddress] + 1, availableVoteTokens)
          : Math.max(prevSelectedContributors[clickedContributorAddress] - 1, 0),
    }));
  };

  const handleSubmitVotes = async () => {
    const wallets = [];
    const amounts = [];

    Object.entries(selectedContributors).forEach(([contributorAddress, voteTokens]) => {
      wallets.push(contributorAddress);
      amounts.push(voteTokens);
    });

    setIsSendingTx(true);
    await tx(writeContracts.QuadraticDiplomacyContract.voteMultiple(wallets, amounts), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setIsSendingTx(false);
        setSpentVoteTokens(0);
        setCurrentStep(3);
      } else if (update.error) {
        setIsSendingTx(false);
      }
    });
  };

  return (
    <div style={{ border: "1px solid", padding: "40px", width: 800, margin: "auto", marginTop: 64, textAlign: "left" }}>
      <Steps initial={1} current={currentStep} labelPlacement="vertical">
        <Steps.Step
          title="Select Contributors"
          subTitle={`${contributorEntries.length} contributors`}
          icon={<SmileTwoTone />}
        />
        <Steps.Step
          title="Allocate Votes"
          subTitle={`${remainingVoteTokens} votes left`}
          icon={<LikeTwoTone twoToneColor="#eb2f96" />}
        />
        <Steps.Step title="Done" subTitle="Thank you!" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} />
      </Steps>
      <Divider />
      {currentStep === 1 ? (
        <List
          size="large"
          itemLayout="horizontal"
          header={<Title level={4} style={{ fontFamily: "Space Mono" }}>1. Who've you been working with?</Title>}
          style={{ width: "600px", margin: "0 auto" }}
          footer={
            <Row justify="end">
                <Button
                  type="primary"
                  onClick={() => setCurrentStep(2)}
                  disabled={!Object.keys(selectedContributors).length}
                >
                  Next
                </Button>
            </Row>
          }
          dataSource={Object.entries(contributors)}
          renderItem={([contributorAddress, votes], index) => (
            <>
              {index === 0 && (
                <List.Item>
                  <Checkbox
                    indeterminate={!allContributorsSelected && Object.keys(selectedContributors).length}
                    checked={allContributorsSelected}
                    onChange={handleSelectAllContributors}
                  >
                    Select All
                  </Checkbox>
                </List.Item>
              )}
              <List.Item key={contributorAddress}>
                <Checkbox
                  size="large"
                  onClick={e => handleContributorSelection(e, contributorAddress)}
                  checked={selectedContributors[contributorAddress] !== undefined}
                >
                  <Address address={contributorAddress} ensProvider={mainnetProvider} fontSize={16} size="short" />
                </Checkbox>
              </List.Item>
            </>
          )}
        />
      ) : currentStep === 2 ? (
        <List
          size="large"
          itemLayout="horizontal"
          style={{ width: "600px", margin: "0 auto" }}
          header={
            <Space direction="vertical">
              <Title level={4} style={{ fontFamily: "Space Mono" }}>2. Allocate votes</Title>
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
                  <Button onClick={() => setCurrentStep(1)} style={{ marginRight: "8px" }} type="secondary">Go back</Button>
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
        currentStep === 3 && (
          <>
            <Title level={3} style={{ fontFamily: "Space Mono" }}>Thank you for voting.</Title>
            <p>The allocation to this workstream will be informed by your votes. See you next month!</p>
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
