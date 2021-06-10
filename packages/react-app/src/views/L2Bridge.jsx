/* eslint-disable jsx-a11y/accessible-emoji */

import { utils, ethers } from "ethers";
import { Button, Input, Form, Select, InputNumber, Table, Radio } from "antd";
import React, { useState, useEffect } from "react";
import { useContractLoader, useOnBlock } from "../hooks";
import { NETWORKS } from "../constants";
import { Transactor } from "../helpers";

export default function L2ArbitrumBridge({ address, userSigner }) {
  const [L1EthBalance, setL1EthBalance] = useState("...");
  const [L2EthBalance, setL2EthBalance] = useState("...");
  const [L1Provider, setL1Provider] = useState("");
  const [L2Provider, setL2Provider] = useState("");
  const [rollup, setRollup] = useState("arbitrum");

  const rollupConfig = {
    arbitrum: { L1RPC: NETWORKS.rinkeby, L2RPC: NETWORKS.rinkebyArbitrum },
    optimism: { L1RPC: NETWORKS.kovan, L2RPC: NETWORKS.kovanOptimism },
  };

  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  const tx = Transactor(userSigner);

  useEffect(() => {
    async function setProviders() {
      const L1RPC = rollupConfig[rollup].L1RPC;
      const L2RPC = rollupConfig[rollup].L2RPC;
      setL1Provider(new ethers.providers.StaticJsonRpcProvider(L1RPC.rpcUrl));
      setL2Provider(new ethers.providers.StaticJsonRpcProvider(L2RPC.rpcUrl));
      setL1EthBalance("...");
      setL2EthBalance("...");
    }
    setProviders();
  }, [rollup]);

  const contracts = useContractLoader(userSigner);

  useOnBlock(L1Provider, async () => {
    console.log(`⛓ A new mainnet block is here: ${L1Provider._lastBlockNumber}`);
    const yourL1Balance = await L1Provider.getBalance(address);
    setL1EthBalance(yourL1Balance ? ethers.utils.formatEther(yourL1Balance) : "...");
    const yourL2Balance = await L2Provider.getBalance(address);
    setL2EthBalance(yourL2Balance ? ethers.utils.formatEther(yourL2Balance) : "...");
  });

  const { Option } = Select;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 12,
        offset: 8,
      },
    },
  };

  const columns = [
    {
      title: "",
      dataIndex: "token",
      key: "token",
      align: "center",
    },
    {
      title: `${rollupConfig[rollup].L1RPC.name} L1 Balance`,
      dataIndex: "l1",
      key: "l1",
      align: "center",
    },
    {
      title: `${rollupConfig[rollup].L1RPC.name} ${rollup} Balance`,
      dataIndex: "l2",
      key: "l2",
      align: "center",
    },
  ];

  const data = [
    {
      key: "1",
      token: "ETH",
      l1: "Ξ" + L1EthBalance,
      l2: "Ξ" + L2EthBalance,
    },
    // {
    //   key: '2',
    //   token: 'A TOKEN',
    //   l1: 'TOK 33',
    //   l2: 'TOK 22',
    // }
  ];

  const [form] = Form.useForm();

  const onAssetChange = value => {
    console.log(value);
  };

  async function onFinish(values) {
    console.log(contracts);
    console.log(values.amount.toString());
    console.log(rollup);
    let newTx;
    try {
      if (rollup === "arbitrum") {
        newTx = await tx(contracts.Inbox.depositEth(address, { value: utils.parseEther(values.amount.toString()) }));
      } else if (rollup === "optimism") {
        newTx = await tx(contracts.OVM_L1ETHGateway.deposit({ value: utils.parseEther(values.amount.toString()) }));
      }
      await newTx.wait();
      console.log("woop!");
    } catch (e) {
      console.log(e);
      console.log("something went wrong!");
    }
  }

  const onReset = () => {
    form.resetFields();
  };

  const wrongNetwork = selectedChainId !== rollupConfig[rollup].L1RPC.chainId;

  return (
    <div style={{ padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
        <h2>Welcome to the L2 Bridge!</h2>
        <Radio.Group
          value={rollup}
          onChange={e => {
            setRollup(e.target.value);
          }}
          style={{ marginBottom: 10 }}
        >
          <Radio.Button value="arbitrum">Arbitrum</Radio.Button>
          <Radio.Button value="optimism">Optimism</Radio.Button>
        </Radio.Group>

        <Table columns={columns} dataSource={data} pagination={false} style={{ marginBottom: 20 }} />

        <Form {...formItemLayout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="assetType"
            label="Select Asset Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select an asset type" onChange={onAssetChange} allowClear>
              <Option value="eth">ETH</Option>
              <Option disabled value="erc20">
                ERC-20
              </Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input disabled placeholder={address} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount to bridge"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={wrongNetwork}>
              {wrongNetwork ? `Switch wallet to ${rollupConfig[rollup].L1RPC.name}` : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
