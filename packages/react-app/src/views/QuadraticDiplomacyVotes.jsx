import { Button, Checkbox, Divider, Space } from "antd";
import React, {useEffect, useState} from "react"

export default function QuadraticDiplomacyVotes({
  votesEntries,
}) {
  const [votes, setVotes] = useState({});
  console.log('ENTRIEES', votesEntries);

  useEffect(async() => {
    const sumVotes = {}
    for (const entry of votesEntries) {
      if (sumVotes[entry.wallet]) {
        sumVotes[entry.wallet].amount = sumVotes[entry.wallet].amount + entry.amount.toNumber();
      } else {
        sumVotes[entry.wallet] = {
          name: entry.name,
          wallet: entry.wallet,
          amount: entry.amount.toNumber()
        }
      }
    }

    console.log('VOTES', sumVotes);

    setVotes(sumVotes);
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
