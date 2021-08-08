import { Button, Checkbox, Divider, Space } from "antd";
import React, {useEffect, useState} from "react"

export default function QuadraticDiplomacyUI({
  readContracts,
  contributorCount,
}) {
  const VOTE_CREDITS = 5;

  const [contributors, setContributors] = useState({});
  const [selectedContributors, setSelectedContributors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  // This will come from config.
  const [availableVoteTokens, setAvailableVoteTokens] = useState(VOTE_CREDITS);

  useEffect(async () => {
    let loadedContributors = {};
    for(let i = 0; i < contributorCount; i++) {
      let contributor = await readContracts["QuadraticDiplomacyContract"].contributors(i);
      loadedContributors[contributor.contributorAddress] = contributor.name;
    }

    setContributors(loadedContributors);
  }, [contributorCount]);

  const handleContributorSelection = (e) => {
    const clickedContributorAddress = e.target.getAttribute("data-address");

    setSelectedContributors((prevSelectedContributors) => {
      if (selectedContributors[clickedContributorAddress]) {
        const state = { ...prevSelectedContributors };
        delete state[clickedContributorAddress];
        return state;
      } else {
        return {
          ...prevSelectedContributors,
          [clickedContributorAddress]: {
            name: contributors[clickedContributorAddress],
            voteTokens: 0
          }
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

  return (
    <>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        {currentPage === 1 ? (
          <>
            <h4>1. Who've you been working with?</h4>
            <Divider />
            <ul style={{ listStyle: 'none' }}>
              {Object.keys(contributors).map((contributorAddress) => (
                <li
                  key={contributorAddress}
                >
                  <Checkbox
                    onClick={handleContributorSelection}
                    data-address={contributorAddress}
                    checked={selectedContributors[contributorAddress]}
                  >
                    {contributors[contributorAddress]}
                  </Checkbox>
                </li>
              ))}
            </ul>
            <Divider />
            <div style={{ margin: 8 }}>
              <Button
                type='primary'
                onClick={() => setCurrentPage(2)}>
                Next
              </Button>
            </div>
            <Divider />
          </>
        ) : currentPage === 2 ? (
          <>
            <h4>2. Reward Contributors</h4>
            <Divider />
            <p><strong>Remaining vote tokens: </strong> {availableVoteTokens}</p>
            <Divider />
            <ul style={{ listStyle: 'none' }}>
              {Object.keys(selectedContributors).map((contributorAddress) => (
                <li key={contributorAddress}>
                  <Space direction="vertical">
                    <Space>
                      <strong>{contributors[contributorAddress]}</strong>
                      <span>(votes: {selectedContributors[contributorAddress].voteTokens})</span>
                    </Space>
                    <Space>
                      <Button
                        onClick={(e) => handleContributorVote(e, 'remove', contributorAddress)}
                        disabled={!selectedContributors[contributorAddress].voteTokens}
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
                onClick={() => setCurrentPage(3)}
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
    </>
  );
}
