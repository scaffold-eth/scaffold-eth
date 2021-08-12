import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Safe, { EthersAdapter, SafeFactory, SafeTransaction } from '@gnosis.pm/safe-core-sdk'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
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
  const [currentThresold, setcurrentThresold] = useState([])
  const [thresold, setthresold] = useState(0)
  const [owners, setOwners] = useState([])
  const [transactions, setTransactions] = useState([])
  const [value, setValue] = useState(0)
  const [selector, setSelector] = useState('')
  const [params, setParams] = useState([])
  const [data, setData] = useState('0x0000000000000000000000000000000000000000')
  let safeAddress = '0x1bC345644D51b3E28F801c5523238C3C133FbDbe';
  const ethAdapter = new EthersAdapter({ ethers, signer: userSigner })
  const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

  const loadGnosis = async () => {

    // const safeFactory = await SafeFactory.create({ ethAdapter })
    // const safeAccountConfig = { owners: ownerspayload, threshold: thresholdVal }
    // const safe = await safeFactory.deploySafe(safeAccountConfig)
    // safeAddress = await safe.getAddress();
    // const safeinstance = await serviceClient.getSafeInfo(safeAddress);
    // console.log(safeinstance)
    const contract = await ethAdapter.getSafeContract(safeAddress)
    const owners = await contract.getOwners();
    const thresold = await contract.getThreshold();
    setOwners(owners)
    setthresold(thresold)
  }

  useEffect(async () => {
    await loadGnosis()
  }, []);

  useEffect(async () => {
    const transactions = await serviceClient.getPendingTransactions(safeAddress)
    const currentThresold = [];
    for (let i = 0; i < transactions.results.length; i++) {
      const signers = [];
      currentThresold.push(transactions.results[i].confirmations.length)
      for (let j = 0; j < transactions.results[i].confirmations.length; j ++) {
        signers.push(transactions.results[i].confirmations[j].owner)
      }
      transactions.results[i].signers = signers;
    }
    setcurrentThresold(currentThresold)
    setTransactions(transactions.results)
  });



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
              const nonce = await safeSdk.getNonce()
              const partialTx = {
                to,
                data,
                value: value.toString()
              }

              const safeTransaction = await safeSdk.createTransaction(partialTx)
              await safeSdk.signTransaction(safeTransaction)
              
              
              const hash = await safeSdk.getTransactionHash(safeTransaction)
              await serviceClient.proposeTransaction(safeAddress, safeTransaction.data,  hash, safeTransaction.signatures.get(address.toLowerCase()))
            }}
          >
            Sign Transaction
          </Button>

        </div>
      </div>
      <Divider />
      <div style={{ margin: 8 }}>
        {
          transactions.length > 0 && transactions.map((transaction, index) => (
            <div>
              <p>To: {transaction.to.substring(0, 6) + "......" + transaction.to.substring(transaction.to.length - 7, transaction.to.length - 1)}</p>
              <p>Data: {transaction.data.substring(0, 6) + "......" + transaction.data.substring(transaction.data.length - 7, transaction.data.length - 1)}</p>
              <p>Value: {transaction.value / 1e18} ETH</p>
              {owners.includes(address) && currentThresold[index] >= thresold && <Button
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
              {owners.includes(address) && !transaction.signers.includes(address) && currentThresold[index] < thresold && <Button
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
                  const hash = transaction.safeTxHash;
                  const signature = await safeSdk.signTransactionHash(hash);
                  await serviceClient.confirmTransaction(hash, signature.data)
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
