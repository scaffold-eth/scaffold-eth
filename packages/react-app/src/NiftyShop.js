import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Popover, Button, Form, Typography, Spin, Space, Descriptions, notification, message, InputNumber, Popconfirm } from 'antd';
import { ShoppingCartOutlined, ShopOutlined  } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { Transactor, getSignature } from "./helpers"

export default function NiftyShop(props) {

  const [buying, setBuying] = useState(false)
  const [mintForm] = Form.useForm();
  const [priceForm] = Form.useForm();

  const writeContracts = useContractLoader(props.injectedProvider);
  const metaWriteContracts = useContractLoader(props.metaProvider);
  const tx = Transactor(props.injectedProvider,props.gasPrice)

  let shopButton

  const setPrice = async (values) => {
    console.log("values",values)
    setBuying(true)
    let multipliedPrice = (values['price'] * 10 ** 18).toString()
    let result
    if(props.type === 'ink') {

    let signature = await getSignature(
      props.injectedProvider, props.address,
      ['bytes','bytes','address','string','uint256','uint256'],
      ['0x19','0x0',metaWriteContracts["NiftyInk"].address,props.itemForSale,multipliedPrice,props.priceNonce])

    result = await tx(metaWriteContracts["NiftyInk"].setPriceFromSignature(props.itemForSale, multipliedPrice, signature, { gasPrice:props.gasPrice } ))
  } else if(props.type === 'token') {
    result = await tx(writeContracts["NiftyToken"].setTokenPrice(props.itemForSale, multipliedPrice, { gasPrice:props.gasPrice } ))
  }
    notification.open({
      message: 'New price set for ' + props.ink.name,
      description: 'Ξ'+values['price']
    });
    priceForm.resetFields();
    setBuying(false)
    console.log("result", result)
  }

  const buyInk = async (values) => {
    console.log("values", values)
    setBuying(true)
    let bigNumber = ethers.utils.bigNumberify(props.price)
    let hex = bigNumber.toHexString()

    let result
    if(props.type === 'ink') {
    result = await tx(writeContracts["NiftyToken"].buyInk(props.itemForSale, { value: hex, gasPrice:props.gasPrice } ))
  } else if(props.type === 'token') {
        result = await tx(writeContracts["NiftyToken"].buyToken(props.itemForSale, { value: hex, gasPrice:props.gasPrice } ))
      }
    console.log(result)
    setBuying(false)
    if(result) {
    notification.open({
      message: <><span style={{marginRight:8}}>💵</span>Purchased Ink</>,
      description: 'You bought one ' + props.ink.name + ' for Ξ'+ethers.utils.formatEther(props.price)
    });
  }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  if(props.visible == false) {
    shopButton = (<></>)
  } else if(props.address === props.ownerAddress) {
    const setPriceForm = (
      <Row style={{justifyContent: 'center'}}>

      <Form
      form={priceForm}
      layout={'inline'}
      name="setPrice"
      onFinish={setPrice}
      onFinishFailed={onFinishFailed}
      >
      <Form.Item
      name="price"
      rules={[{ required: true, message: 'What is the price of this ink?' }]}
      >
      <InputNumber min={0} precision={3} placeholder="Ξ" />
      </Form.Item>

      <Form.Item >
      <Button type="primary" htmlType="submit" loading={buying}>
      Set Price
      </Button>
      </Form.Item>
      </Form>

      </Row>
    )
    shopButton = (
      <Popover content={setPriceForm}
      title="Set price:">
        <Button type="primary" style={{ marginBottom: 12 }}><ShopOutlined />{props.price>0?'Ξ'+ethers.utils.formatEther(props.price):'Sell'}</Button>
      </Popover>
    )
  } else if (props.price > 0) {

    shopButton = (
      <Popconfirm
        title={'Buy one "'+props.ink.name+'" for Ξ'+ethers.utils.formatEther(props.price)}
        onConfirm={buyInk}
        okText="Purchase"
        cancelText="Cancel"
        icon=<ShoppingCartOutlined/>
      >
      <Button type="primary" style={{ marginBottom: 12 }}><ShoppingCartOutlined />{'Ξ'+ethers.utils.formatEther(props.price)}</Button>
      </Popconfirm>
    )
  } else {
    shopButton = (<></>)
  }

    return shopButton
  }
