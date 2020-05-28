import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Input, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline } from "./components"
const { Meta } = Card;

const contractName = "Balloons"

export default function MVD(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const writeContracts = useContractLoader(props.injectedProvider);

  const contractAddress = props.readContracts?props.readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)


  const allowance = useContractReader(props.readContracts,contractName,"allowance",[props.address,contractAddress],1777);


  let display = []

  if(props.readContracts && props.readContracts[contractName]){

  }

  const [approveTokens, setApproveTokens] = useState()

  return (
    <div>
      <Card
        title={(
          <div>
            {contractName}
            <div style={{float:'right'}}>
              <Address value={contractAddress} />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={false}>
        { display }
      </Card>

    </div>
  );

}
