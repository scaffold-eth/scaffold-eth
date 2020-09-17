import { Row, Button, Input } from "antd";
import React, { useState } from "react";
import { RightSquareOutlined } from "@ant-design/icons";
import { Transactor } from "../../helpers";
import {
  useGasPrice,
  useContractLoader,
  useContractReader
} from "../../hooks";

function Round(props) {
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  const tx = Transactor(props.userProvider, gasPrice)
  const readContracts = useContractLoader(props.localProvider)
  const writeContracts = useContractLoader(props.userProvider)

  const [roundDuration, setRoundDuration] = useState();

  const startRoundButton = (
    <Button
      key="startRound"
      onClick={()=>{
        tx( writeContracts.CLR.startRound(roundDuration) )
      }}
    >
      <RightSquareOutlined /> Start
    </Button>
  );

  return (
    <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto", marginTop:64}}>
      <Row> Start Round </Row>
      <Row>
        <Input
          placeholder="round duration"
          value={roundDuration}
          onChange={e => {
            setRoundDuration(e.target.value);
          }}
          addonAfter={startRoundButton}
        />
      </Row>
    </div>
  );
}

export default Round;
