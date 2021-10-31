import { Alert, Button, Col, Menu, Row, Input, Select, Table, Card, Space, Typography, Spin } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Transactor } from "../helpers";
import axios from "axios";
import { useEventListener } from "../hooks";
import { useContractConfig } from "../hooks";
import { useContractLoader, useContractReader, useOnRepetition } from "eth-hooks";
import { Contract, Address } from "../components";

import { readString } from "react-papaparse";
import { MerkleTree } from "merkletreejs";

const { ethers } = require("ethers");

function ViewMerkler({ localProvider, userSigner, address, localChainId }) {
  let { merkler } = useParams();

  const tx = Transactor(userSigner);

  const [customAddresses, setCustomAddresses] = useState({});

  let contractConfig = useContractConfig({ customAddresses: { Merkler: merkler } });

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  const merkleDeploymentEvents = useEventListener(readContracts, "MerkleDeployer", "Deployed", localProvider, 1);

  const merklerMetadata = merkleDeploymentEvents && merkleDeploymentEvents.find(el => el.args._address == merkler);

  const [merkleJson, setMerkleJson] = useState([]);
  const [merkleJsonHash, setMerkleJsonHash] = useState();
  const [merkleTree, setMerkleTree] = useState();
  const [amountRequired, setAmountRequired] = useState();
  const [merklerBalance, setMerklerBalance] = useState();

  const [claimLookup, setClaimLookup] = useState({});

  const getMerklerBalance = async () => {
    if (merklerMetadata) {
      console.log(merklerMetadata);
      let newBalance;
      if (merklerMetadata.args._token == "0x0000000000000000000000000000000000000000") {
        newBalance = await localProvider.getBalance(merkler);
      } else {
        let newTokenContract = readContracts.ERC20.attach(merklerMetadata.args._token);
        newBalance = await newTokenContract.balanceOf(merkler);
      }
      console.log(newBalance);
      setMerklerBalance(newBalance);
    }
  };

  useOnRepetition(getMerklerBalance, { provider: localProvider });

  useEffect(() => {
    getMerklerBalance();
  }, [merklerMetadata]);

  useEffect(() => {
    let newCustomAddresses = { Merkler: merkler };
    if (merklerMetadata) newCustomAddresses.ERC20 = merklerMetadata.args._tokenAddress;
    setCustomAddresses(newCustomAddresses);
  }, [merklerMetadata]);

  function hashToken(index, account, amount) {
    return Buffer.from(
      ethers.utils.solidityKeccak256(["uint256", "address", "uint256"], [index, account, amount]).slice(2),
      "hex",
    );
  }

  useEffect(() => {
    if (merkleJson.length > 0) {
      let newMerkleTree = new MerkleTree(
        merkleJson.map(entry => hashToken(...entry)),
        keccak256,
        { sortPairs: true },
      );
      //console.log(newMerkleTree.getHexRoot());
      setMerkleTree(newMerkleTree);
    }
  }, [merkleJson]);

  useEffect(() => {
    const getFromIPFS = async () => {
      let treeFileHash = await readContracts.Merkler.treeFile();
      setMerkleJsonHash(treeFileHash);
      console.log(treeFileHash);

      let treeFile = await axios(`https://ipfs.io/ipfs/${treeFileHash}`);
      if (treeFile != null) {
        console.log("ipfsData", treeFile.data);
        setMerkleJson(treeFile.data);
      }
    };

    if (merkler && readContracts && readContracts.Merkler && readContracts.Merkler.address == merkler) {
      getFromIPFS();
    }
  }, [merkler, readContracts && readContracts.Merkler && readContracts.Merkler.address]);

  const getLookup = async () => {
    if (merkler && readContracts && readContracts.Merkler && readContracts.Merkler.address == merkler) {
      for (let step = 0; step <= Math.floor(merkleJson.length / 256); step++) {
        // Runs 5 times, with values of step 0 through 4.
        //console.log(step, Math.floor(merkleJson.length / 256));

        let newClaimedBitMap = await readContracts.Merkler.claimedBitMap(step);
        let newEntry = {};
        newEntry[step] = newClaimedBitMap;
        //console.log(newEntry);

        setClaimLookup(oldLookup => new Object({ ...oldLookup, ...newEntry }));
      }
    }
  };

  useEffect(() => {
    getLookup();
  }, [merkleJson, readContracts.Merkler && readContracts.Merkler.address]);

  return (
    <Card
      title={<Address value={merkler} />}
      style={{ maxWidth: 800, margin: "auto", marginTop: 10 }}
      extra={
        merklerMetadata &&
        merklerBalance && (
          <Space>
            <span>
              {`Merkler balance: ${ethers.utils.formatUnits(merklerBalance, merklerMetadata.args._decimals)} ${
                merklerMetadata.args._symbol
              }`}
            </span>
            {merklerMetadata.args._dropper == address && merklerMetadata.args._deadline.toNumber() < Date.now() / 1000 && (
              <Button
                onClick={async () => {
                  tx(writeContracts.Merkler.withdraw());
                }}
              >
                Withdraw
              </Button>
            )}
          </Space>
        )
      }
    >
      {merklerMetadata && (
        <>
          <Typography.Paragraph>
            <Typography.Text>
              {`${ethers.utils.formatUnits(merklerMetadata.args._amount, merklerMetadata.args._decimals)} ${
                merklerMetadata.args._symbol
              } dropped by `}
            </Typography.Text>
            <Typography.Text copyable>{merklerMetadata.args._dropper}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text>Source: </Typography.Text>
            <a href={`https://ipfs.io/ipfs/${merkleJsonHash}`} target="_blank">
              {merkleJsonHash}
            </a>
          </Typography.Paragraph>
        </>
      )}

      {merkleJson.length > 0 ? (
        <Table
          rowKey="id"
          dataSource={merkleJson.map(row => {
            return {
              id: row[0],
              address: row[1],
              amount: ethers.utils.formatUnits(row[2], merklerMetadata ? merklerMetadata.args._decimals : 18),
              rawAmount: row[2],
            };
          })}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
              sorter: (a, b) => a.id - b.id,
            },
            {
              title: "Address",
              dataIndex: "address",
              key: "id",
              onFilter: (value, record) => record.address.startsWith(value),
              filters: [
                {
                  text: "My address",
                  value: address,
                },
              ],
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "id",
              sorter: (a, b) => a.amount - b.amount,
            },
            {
              title: "Check",
              key: "id",
              fixed: "right",
              width: 100,
              render: (text, row) => {
                try {
                  let claimedWordIndex = Math.floor(Number(row.id) / 256);
                  let claimedBitIndex = Number(row.id) % 256;
                  let claimedWord = claimLookup[claimedWordIndex];
                  let mask = ethers.BigNumber.from(1).shl(claimedBitIndex);
                  //console.log(claimedWordIndex, claimedBitIndex, claimedWord, mask, claimedWord.and(mask));

                  if (claimedWord.and(mask).eq(mask)) {
                    return `Claimed`;
                  } else {
                    return (
                      <Button
                        onClick={async () => {
                          const proof = merkleTree.getHexProof(hashToken(row.id, row.address, row.rawAmount));
                          console.log(row.id, row.address, row.rawAmount, proof);
                          tx(writeContracts.Merkler.redeem(row.id, row.address, row.rawAmount, proof)).then(() => {
                            getLookup();
                          });
                        }}
                      >
                        Claim
                      </Button>
                    );
                  }
                } catch (e) {
                  console.log(e);
                }
              },
            },
          ]}
        />
      ) : (
        <Spin size="large" />
      )}
      {/*<Contract
        name="Merkler"
        signer={userSigner}
        provider={localProvider}
        address={address}
        contractConfig={contractConfig}
      />*/}
    </Card>
  );
}

export default ViewMerkler;
