import { Row, Col, Button } from "antd";
import React, { useState } from "react";
import { RightSquareOutlined } from "@ant-design/icons";
import { AddressInput } from "../../components"
import { Transactor } from "../../helpers";
import {
  useGasPrice,
  useContractLoader,
  useContractReader
} from "../../hooks";

function Ownership(props) {
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  const tx = Transactor(props.userProvider, gasPrice)
  const readContracts = useContractLoader(props.localProvider)
  const writeContracts = useContractLoader(props.userProvider)

  const owner = useContractReader(readContracts, "CLR", "owner");
  const [newOwner, setNewOwner] = useState();

  return (
    <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto", marginTop:64}}>
      <Row> Transfer Ownership </Row>
      <Row> { owner } </Row>
      <Row>
        <Col span={12}>
          <AddressInput
            ensProvider={props.mainnetProvider}
            placeholder="transfer to address"
            value={newOwner}
            onChange={setNewOwner}
          />
        </Col>
        <Col span={12}>
          <Button
            key="transferOwner"
            onClick={()=>{
              tx( writeContracts.CLR.transferOwnership(newOwner) )
            }}
          > 
            <RightSquareOutlined /> Transfer
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Ownership;
