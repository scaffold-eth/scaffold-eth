import React, { useEffect, useState, useMemo } from "react";
import { Button, Checkbox, Divider, Space, List, Steps, Typography, Badge } from "antd";
import { SmileTwoTone, LikeTwoTone, CheckCircleTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Address } from "../components";
const { Title } = Typography;

export default function QuadraticDiplomacyVote({ voteCredits, contributorEntries, tx, writeContracts, isVoter }) {
  const [selectedContributors, setSelectedContributors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [availableVoteTokens, setAvailableVoteTokens] = useState(0);

  const contributors = useMemo(
    () =>
      contributorEntries.reduce((entries, current) => {
        entries[current.wallet] = {
          name: current.name,
          voteTokens: 0,
        };
        return entries;
      }, {}),
    [contributorEntries],
  );
  const allContributorsSelected = Object.keys(contributors).length === Object.keys(selectedContributors).length;

  useEffect(() => {
    if (voteCredits) {
      setAvailableVoteTokens(voteCredits.toNumber());
    }
  }, [voteCredits]);

  if (!isVoter) {
    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
        <Title level={4}>Access denied</Title>
        <p>You are not part of the members of this election.</p>
      </div>
    );
  }

  const handleSelectAllContributors = () =>
    allContributorsSelected ? setSelectedContributors({}) : setSelectedContributors(contributors);

  const handleContributorSelection = (e, contributorAddress) => {
    setSelectedContributors(prevSelectedContributors => {
      if (prevSelectedContributors[contributorAddress]) {
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
    setAvailableVoteTokens(op === "add" ? availableVoteTokens - 1 : availableVoteTokens + 1);
    // update contributor vote tokens
    setSelectedContributors(prevSelectedContributors => ({
      ...prevSelectedContributors,
      [clickedContributorAddress]: {
        ...prevSelectedContributors[clickedContributorAddress],
        voteTokens:
          op === "add"
            ? Math.min(prevSelectedContributors[clickedContributorAddress].voteTokens + 1, voteCredits.toNumber())
            : Math.max(prevSelectedContributors[clickedContributorAddress].voteTokens - 1, 0),
      },
    }));
  };

  const handleSubmitVotes = async () => {
    const names = [],
      wallets = [],
      amounts = [];

    Object.entries(selectedContributors).forEach(([contributorAddress, { name, voteTokens }]) => {
      names.push(name);
      wallets.push(contributorAddress);
      amounts.push(voteTokens);
    });

    await tx(writeContracts.QuadraticDiplomacyContract.voteMultiple(names, wallets, amounts), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setCurrentStep(3);
      }
    });
  };

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
      <Steps initial={1} current={currentStep} labelPlacement="vertical">
        <Steps.Step
          title="Select Contributors"
          subTitle={`${contributorEntries.length} contributors`}
          icon={<SmileTwoTone />}
        />
        <Steps.Step
          title="Allocate Votes"
          subTitle={`${availableVoteTokens} votes left`}
          icon={<LikeTwoTone twoToneColor="#eb2f96" />}
        />
        <Steps.Step title="Done" subTitle="Thank you!" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} />
      </Steps>
      <Divider />
      {currentStep === 1 ? (
        <List
          size="small"
          itemLayout="horizontal"
          header={<Title level={4}>1. Who've you been working with?</Title>}
          footer={
            <Button
              type="primary"
              onClick={() => setCurrentStep(2)}
              disabled={!Object.keys(selectedContributors).length}
            >
              Next
            </Button>
          }
          dataSource={Object.entries(contributors)}
          renderItem={([contributorAddress, contributor], index) => (
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
                  checked={selectedContributors[contributorAddress]}
                >
                  {contributor.name}
                </Checkbox>
                <Address address={contributorAddress} fontSize={16} size="short" />
              </List.Item>
            </>
          )}
        />
      ) : currentStep === 2 ? (
        <List
          size="large"
          itemLayout="horizontal"
          header={
            <Space direction="vertical">
              <Title level={4}>2. Allocate votes</Title>
              <Title level={5}>
                Remaining vote tokens:&nbsp;&nbsp;
                <Badge
                  showZero
                  overflowCount={1000}
                  count={availableVoteTokens}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Title>
            </Space>
          }
          footer={
            <Space split>
              <Button onClick={() => setCurrentStep(1)}>Go back</Button>
              <Button type="primary" onClick={handleSubmitVotes}>
                Commit votes
              </Button>
            </Space>
          }
          dataSource={Object.entries(selectedContributors)}
          renderItem={([contributorAddress, contributor]) => (
            <>
              <Badge.Ribbon
                showZero
                overflowCount={1000}
                text={<Title level={5}>{contributor.voteTokens} </Title>}
                style={{
                  backgroundColor: contributor.voteTokens ? "#eb2f96" : "grey",
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
                      disabled={!contributor.voteTokens}
                    >
                      <MinusOutlined />
                    </Button>
                    <Button
                      type="primary"
                      ghost
                      onClick={e => handleContributorVote(e, "add", contributorAddress)}
                      disabled={!availableVoteTokens}
                    >
                      <PlusOutlined />
                    </Button>
                  </Button.Group>
                }
              >
                <List.Item.Meta
                  avatar={<Address address={contributorAddress} fontSize={14} size="short" />}
                  title={<strong>{contributor.name}</strong>}
                />
              </List.Item>
            </>
          )}
        />
      ) : (
        currentStep === 3 && (
          <>
            <h4>
              <strong>Thank you for voting.</strong>
            </h4>
            <p>The allocation to this workstream will be informed by your votes. See you next month!</p>
          </>
        )
      )}
    </div>
  );
}
