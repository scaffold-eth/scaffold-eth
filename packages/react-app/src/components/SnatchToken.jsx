import React, { useState, useCallback, useEffect } from "react";
import { Input, Button, Form, Tooltip, Select, InputNumber, Typography } from "antd";
import { parseUnits, formatUnits } from "@ethersproject/units";
import { ethers } from "ethers";

import { useResolveName, useDebounce } from "../hooks";

export const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const DAI_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "chainId_", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "guy", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, internalType: "bytes4", name: "sig", type: "bytes4" },
      { indexed: true, internalType: "address", name: "usr", type: "address" },
      { indexed: true, internalType: "bytes32", name: "arg1", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "arg2", type: "bytes32" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "LogNote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "dst", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "deny",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "move",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "expiry", type: "uint256" },
      { internalType: "bool", name: "allowed", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "pull",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "push",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "rely",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "wards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const { Option } = Select;
const { Text } = Typography;

const SnatchToken = ({ mainnetProvider, localProvider, tx }) => {
  const [target, setTarget] = useState("ironsoul.eth");
  const [receiver, setReceiver] = useState("");
  const [targetBalance, setTargetBalance] = useState();
  const [targetEthBalance, setTargetEthBalance] = useState();
  const [receiverBalance, setReceiverBalance] = useState();
  const [token, setToken] = useState(DAI_ADDRESS);
  const [tokenList, setTokenList] = useState([]);
  const [amount, setAmount] = useState(10);

  let defaultToken = "DAI";
  let defaultDecimals = 18;

  let tokenListUri = "https://tokens.1inch.eth.link";

  useEffect(() => {
    const getTokenList = async () => {
      try {
        let tokenList = await fetch(tokenListUri);
        let tokenListJson = await tokenList.json();
        let filteredTokens = tokenListJson.tokens.filter(function (t) {
          return t.chainId === 1;
        });
        setTokenList(filteredTokens);
      } catch (e) {
        console.log(e);
      }
    };
    getTokenList();
  }, []);

  const debouncedTarget = useDebounce(target, 500);

  const { addressFromENS, loading, error } = useResolveName(mainnetProvider, debouncedTarget);

  const getTokenBalance = async () => {
    let tokenContract = new ethers.Contract(token, DAI_ABI, localProvider);
    if (addressFromENS) {
      let _targetBalance = await tokenContract.balanceOf(addressFromENS);
      setTargetBalance(_targetBalance);
      let _targetEthBalance = await localProvider.getBalance(addressFromENS);
      setTargetEthBalance(_targetEthBalance);
    }
    if (ethers.utils.isAddress(receiver)) {
      let _receiverBalance = await tokenContract.balanceOf(receiver);
      setReceiverBalance(_receiverBalance);
    }
  };

  useEffect(() => {
    getTokenBalance();
  }, [addressFromENS, receiver]);

  let _token = tokenList.filter(function (el) {
    return el.address === token;
  });

  let decimals;
  let symbol;
  if (_token.length === 0) {
    decimals = defaultDecimals;
    symbol = defaultToken;
  } else {
    decimals = _token[0].decimals;
    symbol = _token[0].symbol;
  }

  let targetBalanceFormatted = targetBalance ? parseFloat(formatUnits(targetBalance, decimals)).toFixed(2) : null;
  let targetEthBalanceFormatted = targetEthBalance ? parseFloat(formatUnits(targetEthBalance, 18)).toFixed(2) : null;
  let receiverBalanceFormatted = receiverBalance ? parseFloat(formatUnits(receiverBalance, decimals)).toFixed(2) : null;

  const impersonateSend = useCallback(async () => {
    const accountToImpersonate = addressFromENS;

    await localProvider.send("hardhat_impersonateAccount", [accountToImpersonate]);
    const signer = await localProvider.getSigner(accountToImpersonate);

    const myTokenContract = new ethers.Contract(token, DAI_ABI, signer);
    console.log(receiver, amount, decimals);
    await tx(myTokenContract.transfer(receiver, parseUnits(amount.toString(), decimals)));
    getTokenBalance();
  }, [addressFromENS, receiver]);

  const getValidationProps = () => {
    if (loading) {
      return {
        validateStatus: "validating",
        help: "Resolving..",
      };
    } else if (error) {
      return {
        validateStatus: "error",
        help: error,
      };
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "left",
        marginTop: "30px",
      }}
    >
      <Form.Item label="ENS name or address of your target:" hasFeedback {...getValidationProps()}>
        <Tooltip placement="bottom" title="Account must have non-zero ETH balance">
          <Input value={target} onChange={e => setTarget(e.target.value)} />
          <Text type="secondary">
            {targetBalanceFormatted && `${targetBalanceFormatted} ${symbol}, ${targetEthBalanceFormatted} ETH`}
          </Text>
        </Tooltip>
      </Form.Item>
      <Form.Item label="Token">
        <Select
          showSearch
          defaultValue={defaultToken}
          onChange={value => setToken(value)}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          optionFilterProp="children"
        >
          {tokenList.map(token => (
            <Option key={token.address} value={token.address}>
              {token.symbol}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Amount">
        <InputNumber
          defaultValue={amount}
          onChange={value => {
            console.log(value);
            setAmount(value);
          }}
        />
      </Form.Item>
      <Form style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Form.Item style={{ flexBasis: "75%" }}>
          <Input size="medium" onChange={e => setReceiver(e.target.value)} placeholder="Put receiver address" />
          <Text type="secondary">{receiverBalanceFormatted && `${receiverBalanceFormatted} ${symbol}`}</Text>
        </Form.Item>
        <Form.Item style={{ flexBasis: "20%" }}>
          <Button onClick={impersonateSend} disabled={error || loading || !receiver}>
            Snatch!
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SnatchToken;
