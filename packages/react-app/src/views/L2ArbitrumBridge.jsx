/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Form, Select, Option, InputNumber, Table, Tag, Space } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";

export default function L2ArbitrumBridge({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
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
      title: 'L1 Eth Balance',
      dataIndex: 'l1Eth',
      key: 'l1Eth',
      align: 'center',
    },
    {
      title: 'Arbitrum Eth Balance',
      dataIndex: 'l2Eth',
      key: 'l2Eth',
      align: 'center',
    },
  ]

  const data = [
    {
      key: '1',
      l1Eth: 'Ξ 33',
      l2Eth: 'Ξ 22',
    }
  ]

  const [form] = Form.useForm();

    const onAssetChange = (value) => {
      console.log(value)
    };

    const onRollupChange = (value) => {
      console.log(value)
    };

    const onFinish = (values) => {
      console.log(values);
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
            <Input placeholder={address} />
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
