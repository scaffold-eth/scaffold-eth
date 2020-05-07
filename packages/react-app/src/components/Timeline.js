import React from 'react'
import Blockies from 'react-blockies';
import { Timeline, Typography } from 'antd';
import { SendOutlined, DownloadOutlined, EditOutlined } from  '@ant-design/icons';
const { Text } = Typography;

export default function TimelineDisplay(props) {

  return (
    <Timeline mode="right">

      <Timeline.Item dot={"💾"}>
        <Text delete>
          Clone and Install from the <a target="_blank" rel="noopener noreferrer" href="https://github.com/austintgriffith/scaffold-eth">github repo</a>
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"⚛️"}>
        <Text delete>
          Start your frontend app with: <Text strong>yarn start</Text>
        </Text>
      </Timeline.Item>


      <Timeline.Item dot={"⛓"}>
        <Text delete={props.chainIsUp}>
          Start your local blockchain with: <Text strong>yarn run chain</Text> (and refresh)
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"📝"}>
        <Text delete={props.hasOwner}>
          Compile and deploy your smart contract: <Text strong>yarn run deploy</Text>
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<SendOutlined style={{ fontSize: '16px' }} />} color={props.hasEther?"green":"blue"}>
        <Text delete={props.hasEther}>
          Send test ether to your <Blockies seed={(props.address?props.address:"").toLowerCase()} size={8} scale={2}/> address using (bottom left) faucet
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<DownloadOutlined style={{ fontSize: '16px' }} />} color={props.contractHasEther?"green":"blue"}>
        <Text delete={props.contractHasEther}>
          👀 Notice how the deposit fails if you try? (add medium link)<br/>
          Add a <Text code>payable</Text><Text code>fallback()</Text> function to <Text code>SmartContractWallet.sol</Text> <br/>
          Then, deposit funds into your <Blockies seed={(props.contractAddress?props.contractAddress:"").toLowerCase()} size={8} scale={2}/> smart contract wallet  <br/>
        </Text>
      </Timeline.Item>





    </Timeline>
  );
}
