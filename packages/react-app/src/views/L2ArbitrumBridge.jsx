/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { utils, ethers } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Form, Select, Option, InputNumber, Table, Tag, Space } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import {
  useBalance,
  useContractLoader,
} from "../hooks";
import { NETWORKS } from "../constants";

export default function L2ArbitrumBridge({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  price,
  tx,
  readContracts,
  writeContracts,
  userSigner,
}) {
  const L1RPC = NETWORKS.rinkeby;
  const L2RPC = NETWORKS.rinkebyArbitrum;

  const L1Provider = new ethers.providers.StaticJsonRpcProvider(L1RPC.rpcUrl);
  const L2Provider = new ethers.providers.StaticJsonRpcProvider(L2RPC.rpcUrl);
  const yourL1Balance = useBalance(L1Provider, address);
  const yourL2Balance = useBalance(L2Provider, address);
  const L1ethBalance = yourL1Balance ? utils.formatEther(yourL1Balance) : "...";
  const L2ethBalance = yourL2Balance ? utils.formatEther(yourL2Balance) : "...";

  const contracts = useContractLoader(userSigner);
  

  // Then read your DAI balance like:
  // const ArbitrumInbox = useContractReader(contracts, "DAI", "balanceOf", [
  //   "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  // ]);


  const [newPurpose, setNewPurpose] = useState("loading...");
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
      title: '',
      dataIndex: 'token',
      key: 'token',
      align: 'center',
    },
    {
      title: 'L1 Balance',
      dataIndex: 'l1',
      key: 'l1',
      align: 'center',
    },
    {
      title: 'Arbitrum Balance',
      dataIndex: 'l2',
      key: 'l2',
      align: 'center',
    },
  ]

  const data = [
    {
      key: '1',
      token: 'ETH',
      l1: 'Ξ' + L1ethBalance,
      l2: 'Ξ' + L2ethBalance,
    },
    // {
    //   key: '2',
    //   token: 'A TOKEN',
    //   l1: 'TOK 33',
    //   l2: 'TOK 22',
    // }
  ]

  const [form] = Form.useForm();

    const onAssetChange = (value) => {
      console.log(value)
    };

    const onRollupChange = (value) => {
      console.log(value)
    };

    async function onFinish(values){
      console.log(contracts.Inbox);
      console.log(values.amount.toString());
      const tx = await contracts.Inbox.depositEth(1,{value: utils.parseEther(values.amount.toString())});
      //showNotification(tx);
      await tx.wait();
      //loadContractData(freelancerContract);
    };

    const onReset = () => {
      form.resetFields();
    };

  return (
    <div style={{ padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
        <h2>Welcome to the L2 Arbitrum Bridge!</h2>

        <Table columns={columns} dataSource={data} pagination={false}
          style={{marginBottom:20}}
        />

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
            <Select
              placeholder="Select an asset type"
              onChange={onAssetChange}
              allowClear
            >
              <Option value="eth">ETH</Option>
              <Option disabled value="erc20">ERC-20</Option>
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
