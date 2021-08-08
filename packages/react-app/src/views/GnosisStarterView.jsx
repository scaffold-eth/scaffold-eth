import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Safe, { EthersAdapter, SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { Address, Balance, EtherInput } from "../components";
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
  const [safeTx, setsafeTx] = useState('')
  const [thresold, setthresold] = useState(0)
  const [owners, setOwners] = useState([])
  const [transactions, setTransactions] = useState([])
  const [value, setValue] = useState(0)
  const [selector, setSelector] = useState('')
  const [params, setParams] = useState([])
  const [data, setData] = useState('0x0000000000000000000000000000000000000000')
  let safeAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const ethAdapter = new EthersAdapter({ ethers, signer: userSigner })

  const loadGnosis = async () => {
    const contract = await ethAdapter.getSafeContract(safeAddress)
    const owners = await contract.getOwners();
    console.log(owners)
    const thresold = await contract.getThreshold();
    setOwners(owners)
    setthresold(thresold)
  }

  useEffect(async () => {
    const response = await fetch('http://localhost:8001/transactions').then(data => data.json())
    setTransactions(response)
  });

  useEffect(async () => {
    await loadGnosis()
  }, []);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Gnosis Transaction Initiation</h2>
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
              const safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })
              const partialTx = {
                to,
                data,
                value: value.toString()
              }
              const safeTransaction = await safeSdk.createTransaction(partialTx)
              await safeSdk.signTransaction(safeTransaction)
              const payload = {};
              payload.safeAddress = safeAddress;
              const signer = safeTransaction.signatures.get(userSigner.address.toLowerCase()).signer;

              safeTransaction.data.signer = [];
              safeTransaction.data.signer.push(signer)
              setsafeTx(safeTransaction)
              console.log(safeTransaction)
              safeTransaction.signatures = Object.fromEntries(safeTransaction.signatures);
              payload.data = safeTransaction;

              await fetch('http://localhost:8001/', {
                method: 'POST',
                mode: "cors",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              });
            }}
          >
            Sign Transaction
          </Button>

        </div>
      </div>
      <Divider />
      <div style={{ margin: 8 }}>
        {
          transactions.length > 0 && transactions[0][safeAddress].map((transaction, index) => (
            <div>
              <p>To: {transaction.data.to.substring(0, 6) + "......" + transaction.data.to.substring(transaction.data.to.length - 7, transaction.data.to.length - 1)}</p>
              <p>Data: {transaction.data.data.substring(0, 6) + "......" + transaction.data.data.substring(transaction.data.data.length - 7, transaction.data.data.length - 1)}</p>
              <p>Value: {transaction.data.value / 1e18} ETH</p>
              {owners.includes(address) && transaction.data.signer.includes(address) && transaction.data.signer.length === thresold && <Button
                style={{ marginTop: 8 }}
                onClick={async () => {
                  const id = await ethAdapter.getChainId()
                  const contractNetworks = {
                    [id]: {
                      multiSendAddress: safeAddress,
                      safeMasterCopyAddress: safeAddress,
                      safeProxyFactoryAddress: safeAddress
                    }
                  }
                  const safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })
                  const safeSdk2 = await safeSdk.connect({ ethAdapter, safeAddress })
                  const executeTxResponse = await safeSdk2.executeTransaction(transaction)
                  const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
                  console.log(receipt);
                  await fetch(`http://localhost:8001/${index}`, {
                    method: 'POST',
                    mode: "cors",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      safeAddress
                    })
                  });
                }}>Execute TX</Button>}
              {owners.includes(address) && !transaction.data.signer.includes(address) && transaction.data.signer.length < thresold && <Button
                style={{ marginTop: 8 }}
                onClick={async () => {
                  const id = await ethAdapter.getChainId()
                  const contractNetworks = {
                    [id]: {
                      multiSendAddress: safeAddress,
                      safeMasterCopyAddress: safeAddress,
                      safeProxyFactoryAddress: safeAddress
                    }
                  }
                  const safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })
                  transaction.signatures = new Map(Object.entries(transaction.signatures));
                  // const partialTx = {};
                  // partialTx.to = transaction.data.to;
                  // partialTx.data = transaction.data.data;
                  // partialTx.value = transaction.data.value;
                  // const safeTransaction = await safeSdk.createTransaction(partialTx)
                  // await safeSdk.signTransaction(safeTransaction)
                  // console.log(safeTransaction)
                  await safeSdk.signTransaction(transaction)
                }}
              >
                Sign TX</Button>}
            </div>
          ))
        }
      </div>
    </div>
  );
}
