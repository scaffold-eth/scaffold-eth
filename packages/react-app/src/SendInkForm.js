import React, { useState } from 'react'
import { Form, Button } from 'antd';
import { AddressInput } from "./components"
import { Transactor } from "./helpers"
import { useContractLoader } from "./hooks"

export default function SendInkForm(props) {

  const writeContracts = useContractLoader(props.injectedProvider);
  const tx = Transactor(props.injectedProvider)

  const sendInk = async (values) => {
  console.log('Success:', props.address, values, props.tokenId);
  let result = await tx(writeContracts["NFTINK"].safeTransferFrom(props.address, values['to'], props.tokenId))
  };

  const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
  };

  return (
  <Form
  layout={'inline'}
  name="sendInk"
  initialValues={{ tokenId: props.tokenId }}
  onFinish={sendInk}
  onFinishFailed={onFinishFailed}
  >
  <Form.Item
  name="to"
  rules={[{ required: true, message: 'Which address should receive this artwork?' }]}
  >
  <AddressInput
    ensProvider={props.mainnetProvider}
    placeholder={"to address"}
  />
  </Form.Item>

  <Form.Item >
  <Button type="primary" htmlType="submit">
    Send
  </Button>
  </Form.Item>
  </Form>
)
}
