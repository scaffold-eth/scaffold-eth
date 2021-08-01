import { ConsoleSqlOutlined, SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { ethers } from "ethers";
import Safe, { EthersAdapter, SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { Address, Balance, EtherInput } from "../components";
import externalConfig from "../contracts/external_contracts.js";
export default function GnosisStarterView({
  purpose,
  userSigner,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [to, setTo] = useState('')
  const [value, setValue] = useState(0)
  const [selector, setSelector] = useState('')
  const [params, setParams] = useState([])
  const [data, setData] = useState('0x0000000000000000000000000000000000000000')
  let safeAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const signer1 = localProvider.getSigner();
  const ethAdapter = new EthersAdapter({ ethers, signer: signer1 })

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Gnosis Transaction Execution</h2>
        <h5>Enter Selector and Params only if the to address is a contract address</h5>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input placeholder="Enter To Address"
            onChange={async (e) => {
              setTo(e.target.value)
            }}
          />
          <EtherInput
            autofocus
            price={price}
            placeholder="Enter Tx Value"
            onChange={value => {
              value = ethers.utils.parseEther(value.toString())
              setValue(value);
            }}
          />

          <Input placeholder="Enter Selector i.e add(uint, uint)"
            onChange={async (e) => {
              setSelector(e.target.value)
            }}
          />

          <Input placeholder="Enter arguments separated by ,"
            onChange={async (e) => {
              setParams(e.target.value.split(','))
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              if (selector !== '' && params.length > 0) {
                const abi = [
                  "function " + selector
                ];
                const index = selector.indexOf('(');
                const fragment = selector.substring(0, index)

                const iface = new ethers.utils.Interface(abi);
                for (let i = 0; i < params.length; i++) {
                  console.log(iface.fragments[0].inputs[i].baseType)
                  if (iface.fragments[0].inputs[i].baseType.includes('uint') || iface.fragments[0].inputs[i].baseType.includes('int')) {
                    params[i] = parseInt(params[i])
                  }
                }
                const data = iface.encodeFunctionData(fragment, params);
                setData(data)
              }

              const id = await ethAdapter.getChainId()
              const contractNetworks = {
                [id]: {
                  multiSendAddress: safeAddress,
                  safeMasterCopyAddress: safeAddress,
                  safeProxyFactoryAddress: safeAddress
                }
              }
              const contract = await ethAdapter.getSafeContract(safeAddress)
              console.log(contract);
              // const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks })
              // const owners = ['0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266']
              // const threshold = 1
              // const safeAccountConfig = { owners, threshold, to: '0x0000000000000000000000000000000000000000', data: '0x', fallbackHandler: '0x0000000000000000000000000000000000000000', paymentToken:'0x0000000000000000000000000000000000000000', payment: 0, paymentReceiver: '0x0000000000000000000000000000000000000000' }

              // const safeSdk = await safeFactory.deploySafe(safeAccountConfig)
              // safeAddress  = safeSdk.getAddress()

              const safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })
              console.log(safeSdk)
              const partialTx = {
                to,
                data,
                value: value.toString()
              }
              console.log(partialTx)
              const safeTransaction = await safeSdk.createTransaction(partialTx)
              console.log(safeTransaction)
              const signer1Signature = await safeSdk.signTransaction(safeTransaction)
              const safeSdk2 = await safeSdk.connect({ ethAdapter, safeAddress })
              const execOptions = { gasLimit: 150000, gas: 45280, safeTxGas: 45280 }
              const executeTxResponse = await safeSdk2.executeTransaction(safeTransaction, execOptions)
              const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
              console.log(receipt);
              const balance = await localProvider.getBalance("0x3e35Ba3AD1921fA9a16ccc73fa980CD5fc764730");
              console.log('bal', balance.toString());

            }}
          >
            Execute Tx
          </Button>

        </div>
      </div>
    </div>
  );
}
