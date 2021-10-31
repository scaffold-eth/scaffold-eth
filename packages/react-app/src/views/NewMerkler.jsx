import {
  Alert,
  Button,
  Col,
  Menu,
  Row,
  Input,
  Select,
  Table,
  Radio,
  DatePicker,
  Typography,
  Card,
  Collapse,
  Form,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch, useHistory } from "react-router-dom";
import { Transactor } from "../helpers";
import { AddressInput } from "../components";
import axios from "axios";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useOnRepetition, useBalance } from "eth-hooks";

import { readString } from "react-papaparse";
import { MerkleTree } from "merkletreejs";
import moment from "moment";

const { ethers } = require("ethers");
const dayjs = require("dayjs");

const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET);

function NewMerkler({ readContracts, writeContracts, localProvider, userSigner, address }) {
  const history = useHistory();

  const tx = Transactor(userSigner);

  const [merkleJson, setMerkleJson] = useState([]);
  const [merkleJsonHash, setMerkleJsonHash] = useState();
  const [merkleTree, setMerkleTree] = useState();
  const [amountRequired, setAmountRequired] = useState();

  const [tokenAddress, setTokenAddress] = useState();
  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState("ETH");
  const [allowance, setAllowance] = useState(0);
  const [assetType, setAssetType] = useState("ETH");
  const [balance, setBalance] = useState();
  const [deadline, setDeadline] = useState(Math.round(new Date().getTime() / 1000));
  const [dropper, setDropper] = useState(address);

  const [erc20Contract, setErc20Contract] = useState();

  const [deploying, setDeploying] = useState(false);

  const ethBalance = useBalance(localProvider, address);

  useEffect(() => {
    if (address) {
      setDropper(address);
    }
  }, [address]);

  const getAllowance = async () => {
    if (erc20Contract) {
      let newBalance = await erc20Contract.balanceOf(address);
      setBalance(newBalance);
      let newAllowance = await erc20Contract.allowance(address, readContracts.MerkleDeployer.address);
      console.log(newAllowance, newBalance);
      setAllowance(newAllowance);
    } else {
      setAllowance();
    }
  };

  useOnRepetition(getAllowance, { pollTime: 5000 });

  function hashToken(index, account, amount) {
    return Buffer.from(
      ethers.utils.solidityKeccak256(["uint256", "address", "uint256"], [index, account, amount]).slice(2),
      "hex",
    );
  }

  useEffect(() => {
    if (merkleJson.length > 0) {
      console.log(merkleJson);
      let newMerkleTree = new MerkleTree(
        merkleJson.map(entry => hashToken(...entry)),
        keccak256,
        { sortPairs: true },
      );
      console.log(newMerkleTree.getHexRoot());
      setMerkleTree(newMerkleTree);
    }
  }, [merkleJson]);

  return (
    <Card title="Make a merkler" style={{ maxWidth: 600, margin: "auto", marginTop: 10 }}>
      <Form layout="vertical" initialValues={{ type: assetType, deadline: moment.unix(deadline), owner: address }}>
        <Form.Item label="Type of Merkle drop" name="type">
          <Radio.Group onChange={e => setAssetType(e.target.value)} value={assetType}>
            <Radio value={"ETH"}>ETH</Radio>
            <Radio value={"ERC20"}>ERC20</Radio>
          </Radio.Group>
        </Form.Item>
        {assetType == "ERC20" && (
          <Form.Item
            label="Token Address"
            name="tokenAddress"
            tooltip={{
              title: "The address of the ERC20 token you would like to drop",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input
              onChange={async e => {
                if (ethers.utils.isAddress(e.target.value)) {
                  try {
                    let newTokenContract = readContracts.ERC20.attach(e.target.value);
                    let newDecimals = await newTokenContract.decimals();
                    let newSymbol = await newTokenContract.symbol();
                    let newAllowance = await newTokenContract.allowance(address, readContracts.MerkleDeployer.address);
                    let newBalance = await newTokenContract.balanceOf(address);
                    setTokenAddress(e.target.value);
                    setDecimals(newDecimals);
                    setSymbol(newSymbol);
                    setErc20Contract(newTokenContract);
                    setAllowance(newAllowance);
                    setBalance(newBalance);
                    console.log(newDecimals, newSymbol);
                  } catch (e) {
                    console.log(e);
                    setTokenAddress();
                    setBalance();
                    setAllowance();
                  }
                }
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          label="Recipients and amounts"
          name="recipients"
          style={{ margin: 0 }}
          tooltip={{
            title: "Enter each recipient as a separate row, with their address and the amount in whole units e.g. 1.0",
            icon: <InfoCircleOutlined />,
          }}
        >
          <Input.TextArea
            placeholder={`0xaddress,amount\n0xaddress,amount\n0xaddress,amount`}
            onChange={event => {
              const results = readString(event.target.value, { dynamicTyping: true });

              let newAmountRequired;
              let invalidData;

              try {
                if (results.data) {
                  newAmountRequired = results.data.reduce((previousValue, current) => {
                    if (
                      !ethers.utils.isAddress(current[0]) ||
                      !(current.length == 2 || (current.length == 3 && current[2] == "")) ||
                      !(typeof current[1] === "number")
                    ) {
                      invalidData = true;
                    }
                    return Math.round((previousValue + current[1]) * 1e12) / 1e12;
                  }, 0);
                  console.log({ newAmountRequired });
                  console.log({ invalidData });

                  if (invalidData) {
                    setAmountRequired();
                    setMerkleJson([]);
                    throw "invalid data";
                  }

                  setAmountRequired(newAmountRequired);

                  let transformedData = results.data.map((element, index) => {
                    return [index, element[0], ethers.utils.parseUnits(String(element[1]), decimals)];
                  });

                  setMerkleJson(transformedData);
                }
              } catch (e) {
                console.log(e);
              }
            }}
            rows={4}
          />
        </Form.Item>
        <Collapse ghost>
          <Collapse.Panel header="Advanced settings" key="1">
            <Form.Item
              label="Owner"
              name="owner"
              tooltip={{
                title: "This address can withdraw remaining tokens or ETH once the deadline has passed",
                icon: <InfoCircleOutlined />,
              }}
            >
              <AddressInput autoFocus placeholder="Enter address" value={dropper} onChange={setDropper} />
            </Form.Item>
            <Form.Item
              label="Deadline"
              name="deadline"
              tooltip={{
                title: "After the deadline the owner can withdraw any remaining tokens or ETH",
                icon: <InfoCircleOutlined />,
              }}
            >
              <DatePicker
                showTime
                onChange={v => {
                  setDeadline(Math.round(v.format("X")));
                }}
                value={moment.unix(deadline)}
              />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
        {assetType == "ETH" ? (
          <Button
            loading={deploying}
            type="primary"
            disabled={!amountRequired || Number(ethers.utils.formatEther(ethBalance)) < amountRequired}
            onClick={() => {
              pinata
                .pinJSONToIPFS(merkleJson)
                .then(result => {
                  console.log(result);
                  setMerkleJsonHash(result.IpfsHash);

                  let merkleRoot = merkleTree.getHexRoot();

                  tx(
                    writeContracts.MerkleDeployer.deployEthMerkler(merkleRoot, dropper, deadline, result.IpfsHash, {
                      value: ethers.utils.parseEther(amountRequired.toString()),
                    }),
                  )
                    .then(result => {
                      console.log(result);
                      result.wait().then(receipt => {
                        console.log(receipt.events[0].args._address);
                        setDeploying(false);
                        history.push(`/view/${receipt.events[0].args._address}`);
                      });
                    })
                    .catch(err => {
                      //handle error here
                      console.log(err);
                      setDeploying(false);
                    });
                })
                .catch(err => {
                  //handle error here
                  console.log(err);
                  setDeploying(false);
                });
            }}
          >
            {`Deploy ETH Merkler: ${amountRequired} ${symbol}`}
          </Button>
        ) : ethers.utils.parseUnits(String(amountRequired || "0"), decimals).gt(allowance) ? (
          <Button
            loading={deploying}
            disabled={!allowance}
            onClick={() => {
              setDeploying(true);
              try {
                let signingContract = erc20Contract.connect(userSigner);
                tx(signingContract.approve(writeContracts.MerkleDeployer.address, ethers.constants.MaxUint256)).then(
                  result => {
                    setDeploying(false);
                    getAllowance();
                  },
                );
              } catch (e) {
                console.log(e);
                setDeploying(false);
              }
            }}
          >
            {`Approve Merkle Deployer (${amountRequired} ${symbol})`}
          </Button>
        ) : (
          <Button
            loading={deploying}
            type="primary"
            disabled={!tokenAddress || !amountRequired || !allowance || allowance.isZero()}
            onClick={() => {
              setDeploying(true);
              pinata
                .pinJSONToIPFS(merkleJson)
                .then(result => {
                  //handle results here
                  console.log(result);
                  setMerkleJsonHash(result.IpfsHash);

                  let merkleRoot = merkleTree.getHexRoot();

                  tx(
                    writeContracts.MerkleDeployer.deployTokenMerkler(
                      merkleRoot,
                      tokenAddress,
                      ethers.utils.parseUnits(amountRequired.toString(), decimals),
                      dropper,
                      deadline,
                      result.IpfsHash,
                    ),
                  )
                    .then(result => {
                      console.log(result);
                      result.wait().then(receipt => {
                        console.log(receipt);
                        history.push(`/view/${receipt.events[receipt.events.length - 1].args._address}`);
                      });
                      setDeploying(false);
                    })
                    .catch(err => {
                      //handle error here
                      console.log(err);
                      setDeploying(false);
                    });
                })
                .catch(err => {
                  //handle error here
                  console.log(err);
                });
            }}
          >
            {`Deploy Token Merkler: ${amountRequired} ${symbol}`}
          </Button>
        )}
      </Form>
    </Card>
  );
}

export default NewMerkler;
