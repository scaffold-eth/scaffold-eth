import React from 'react'
import { ethers } from "ethers";
import { useTimestamp } from "./hooks"
import { Card } from 'antd';

export default function TimeReport(props) {

  // pick a time here: https://www.unixtimestamp.com/index.php and paste it here:
  const TIME_WHEN_VOTES_WILL_BE_COUNTED = 1599019200

  const timestamp = useTimestamp(props.mainnetProvider)
  const timeLeft = TIME_WHEN_VOTES_WILL_BE_COUNTED - timestamp

  let date = new Date(timestamp*1000)

  return (
    <div>
      <Card
        title={(
          <div>
            🕰  Votes will be counted:
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        >
          <div>
            at mainnet timestamp: {TIME_WHEN_VOTES_WILL_BE_COUNTED}
          </div>
          <div>
            current timestamp: {timestamp}
          </div>
          <div>
            ({prettyTimeFromNow(timeLeft)} from now)
          </div>
      </Card>
    </div>
  );

}

function prettyTimeFromNow(timeLeft) {
    var sec_num = timeLeft
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}
