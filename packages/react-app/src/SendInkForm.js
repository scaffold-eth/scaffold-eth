import React, { useState } from 'react'
import { Form, Button, notification } from 'antd';
import { AddressInput } from "./components"
import { Transactor, transactionHandler } from "./helpers"
import { useContractLoader } from "./hooks"

export default function SendInkForm(props) {

  const [sending, setSending] = useState(false)
  const [form] = Form.useForm();

  const sendInk = async (values) => {
    setSending(true)
    console.log('Success:', props.address, values, props.tokenId);

    let contractName = "NiftyToken"
    let regularFunction = "safeTransferFrom"
    let regularFunctionArgs = [props.address, values['to'], props.tokenId]

    let txConfig = {
      ...props.transactionConfig,
      contractName,
      regularFunction,
      regularFunctionArgs
    }

    console.log(txConfig)

    let result
    try {

      const mainnetBytecode = await props.mainnetProvider.getCode(values['to']);
      if (!mainnetBytecode || mainnetBytecode === "0x" || mainnetBytecode === "0x0" || mainnetBytecode === "0x00") {
        result = await transactionHandler(txConfig)
        notification.open({
            message: '👋 Sending successful!',
            description:
            "👀 Sent to " + values['to'],
          });
      } else {
        notification.open({
            message: '📛 Sorry! Unable to send to this address',
            description:
            "This address is a smart contract 📡",
          });
      }

    console.log(result)
    //await tx(writeContracts["NiftyToken"].safeTransferFrom(props.address, values['to'], props.tokenId))
    form.resetFields();
    setSending(false)
  } catch (e) {
    console.log(result)
    form.resetFields();
    setSending(false)
  }
  };

  const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
  };

  let output = (
  <Form
  form={form}
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
  <Button type="primary" htmlType="submit" loading={sending}>
    Send
  </Button>
  </Form.Item>
  </Form>
)

  return output
}
