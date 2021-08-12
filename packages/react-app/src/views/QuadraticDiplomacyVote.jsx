import { Button, Checkbox, Divider, Space } from "antd";
import React, {useEffect, useState} from "react"

export default function QuadraticDiplomacyVote({
  voteCredits,
  contributorEntries,
  tx,
  writeContracts,
}) {
  const [contributors, setContributors] = useState({});
  const [selectedContributors, setSelectedContributors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [availableVoteTokens, setAvailableVoteTokens] = useState(0);

  useEffect(async () => {
    const initialContributors = contributorEntries.reduce((entries, current) => {
      entries[current.wallet] = {
        name: current.name,
        voteTokens: 0,
      }

      return entries;
    }, {})

    setContributors(initialContributors);
  }, [contributorEntries]);

  useEffect(async () => {
    if (voteCredits) {
      setAvailableVoteTokens(voteCredits.toNumber());
    }
  }, [voteCredits]);

  const handleContributorSelection = (e, contributorAddress) => {
    setSelectedContributors((prevSelectedContributors) => {
      if (selectedContributors[contributorAddress]) {
        const state = { ...prevSelectedContributors };
        delete state[contributorAddress];
        return state;
      } else {
        return {
          ...prevSelectedContributors,
          [contributorAddress]: contributors[contributorAddress]
        }
      }
    })
  }

  const handleContributorVote = (e, op, clickedContributorAddress) => {
    setAvailableVoteTokens((prevVotes) => {
      return op === 'add' ? prevVotes - 1 : prevVotes + 1;
    })

    const newContributorVote = op === 'add'
      ? selectedContributors[clickedContributorAddress].voteTokens + 1
      : selectedContributors[clickedContributorAddress].voteTokens - 1;

    setSelectedContributors((prevSelectedContributors) => {
      return {
        ...prevSelectedContributors,
        [clickedContributorAddress]: {
          ...prevSelectedContributors[clickedContributorAddress],
          voteTokens: newContributorVote
        }
      }
    })
  }

  const handleSubmitVotes = async() => {
    const names = [];
    const wallets = [];
    const amounts = [];

    Object.entries(selectedContributors).map(([contributorAddress, contributor]) => {
      names.push(contributor.name);
      wallets.push(contributorAddress);
      amounts.push(contributor.voteTokens);
    });

    await tx(writeContracts.QuadraticDiplomacyContract.voteMultiple(
      names,
      wallets,
      amounts,
    ), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setCurrentPage(3);
      }
    });
  }

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
      {currentPage === 1 ? (
        <>
          <h4><strong>1. Who've you been working with?</strong></h4>
          <Divider />
          <ul style={{ listStyle: 'none' }}>
            {Object.entries(contributors).map(([contributorAddress, contributor]) => (
              <li
                key={contributorAddress}
              >
                <Checkbox
                  onClick={(e) => handleContributorSelection(e, contributorAddress)}
                  checked={selectedContributors[contributorAddress]}
                >
                  {contributor.name}
                </Checkbox>
              </li>
            ))}
          </ul>
          <Divider />
          <div style={{ margin: 8 }}>
            <Button
              type='primary'
              onClick={() => setCurrentPage(2)}
              disabled={!Object.keys(selectedContributors).length}
            >
              Next
            </Button>
          </div>
          <Divider />
        </>
      ) : currentPage === 2 ? (
        <>
          <h4><strong>2. Vote Contributors</strong></h4>
          <Divider />
          <p><strong>Remaining vote tokens: </strong> {availableVoteTokens}</p>
          <Divider />
          <ul style={{ listStyle: 'none' }}>
            {Object.entries(selectedContributors).map(([contributorAddress, contributor]) => (
              <li key={contributorAddress}>
                <Space direction="vertical">
                  <Space>
                    <strong>{contributor.name}</strong>
                    <span>(votes: {contributor.voteTokens})</span>
                  </Space>
                  <Space>
                    <Button
                      onClick={(e) => handleContributorVote(e, 'remove', contributorAddress)}
                      disabled={!contributor.voteTokens}
                    >
                      <span>-</span>
                    </Button>
                    <Button
                      onClick={(e) => handleContributorVote(e, 'add', contributorAddress)}
                      disabled={!availableVoteTokens}
                    >
                      <span>+</span>
                    </Button>
                  </Space>
                </Space>
              </li>
            ))}
          </ul>
          <Space>
            <Button
              onClick={() => setCurrentPage(1)}
            >
              Go back
            </Button>
            <Button
              type='primary'
              onClick={handleSubmitVotes}
            >
              Commit votes
            </Button>
          </Space>
        </>
      ) : currentPage === 3 && (
        <>
          <h4><strong>Thank you for voting.</strong></h4>
          <p>The allocation to this workstream will be informed by your votes. See you next month!</p>
        </>
      )}
    </div>
  );
}
