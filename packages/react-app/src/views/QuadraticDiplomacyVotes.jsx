import { Button, Checkbox, Divider, Space } from "antd";
import React, {useEffect, useState} from "react"

export default function QuadraticDiplomacyVotes({
  votesEntries,
}) {
  const [votes, setVotes] = useState({});

  useEffect(async() => {
    const sumVotes = {};
    let totalSqrts = 0;
    for (const entry of votesEntries) {
      const sqrtVote = Math.sqrt(entry.amount.toNumber());
      console.log(entry.name, sqrtVote);
      if (!sumVotes[entry.wallet]) {
        sumVotes[entry.wallet] = 0;
      }
      sumVotes[entry.wallet] += sqrtVote;
      totalSqrts += sqrtVote;
    }

    console.log('sumVotes', sumVotes);
    console.log('totalSqrts', totalSqrts);

    // setVotes(sumVotes);
  }, [votesEntries]);

  return (
    <>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h4><strong>Votes</strong></h4>
        <Divider />
        <ul style={{ listStyle: 'none' }}>
          {Object.keys(votes).map((address) => (
            <>
              <li
                key={address}
              >
                <p><strong>Name: </strong> {votes[address].name}</p>
                <p><strong>Wallet: </strong> {votes[address].wallet}</p>
                <p><strong>Votes: </strong> {votes[address].amount}</p>
              </li>
              <Divider />
            </>
          ))}
        </ul>
        <Divider />
      </div>
    </>
  );
}
