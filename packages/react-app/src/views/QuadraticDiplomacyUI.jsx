import { Button, Checkbox, Divider, Space } from "antd";
import React, {useEffect, useState} from "react"

export default function QuadraticDiplomacyUI({
  voteCredits,
  contributorEntries,
  tx,
  writeContracts,
}) {
  const [contributors, setContributors] = useState({});
  const [selectedContributors, setSelectedContributors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [availableVoteTokens, setAvailableVoteTokens] = useState(voteCredits.toNumber());

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
          [clickedContributorAddress]: contributors[clickedContributorAddress]
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

  const handleSubmitVote = async() => {
    // Question: Do we need to send separate transactions for each vote?
    for (const contributorAddress of Object.keys(selectedContributors)) {
      await tx(writeContracts.QuadraticDiplomacyContract.vote(
        selectedContributors[contributorAddress].name,
        contributorAddress,
        selectedContributors[contributorAddress].voteTokens,
      ), update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
          );
        }
      });
    }

    setCurrentPage(3);
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
                    {contributors[contributorAddress].name}
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
                      <strong>{contributors[contributorAddress].name}</strong>
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
                onClick={handleSubmitVote}
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
