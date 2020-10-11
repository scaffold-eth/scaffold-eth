import React, { useState } from 'react'
import { ethers } from "ethers"
import { Row, Popover, Button, Form, notification, InputNumber, Popconfirm } from 'antd';
import { ShoppingCartOutlined, ShopOutlined  } from '@ant-design/icons';
import { useContractLoader } from "./hooks"
import { Transactor, transactionHandler } from "./helpers"

export default function NiftyShop(props) {

  const [buying, setBuying] = useState(false)
  const [priceForm] = Form.useForm();

  const writeContracts = useContractLoader(props.injectedProvider);
  const metaWriteContracts = useContractLoader(props.metaProvider?props.metaProvider:props.injectedProvider);

  let shopButton
  let [newPrice, setNewPrice] = useState(0)

  const setPrice = async (values) => {
    console.log("values",values)
    setBuying(true)
    let multipliedPrice = (values['price'] * 10 ** 18).toLocaleString('fullwide', {useGrouping:false})
    console.log(multipliedPrice)
    let result

    try {

    if(props.type === 'ink') {


    let contractName = "NiftyInk"
    let regularFunction = "setPrice"
    let regularFunctionArgs = [props.itemForSale, multipliedPrice]
    let signatureFunction = "setPriceFromSignature"
    let signatureFunctionArgs = [props.itemForSale, multipliedPrice]
    let getSignatureTypes = ['bytes','bytes','address','string','uint256','uint256']
    let getSignatureArgs = ['0x19','0x0',metaWriteContracts["NiftyInk"].address,props.itemForSale,multipliedPrice,props.priceNonce]

    let txConfig = {
      ...props.transactionConfig,
      contractName,
      regularFunction,
      regularFunctionArgs,
      signatureFunction,
      signatureFunctionArgs,
      getSignatureTypes,
      getSignatureArgs,
    }

    console.log(txConfig)

    result = await transactionHandler(txConfig)
      /*
    let signature = await getSignature(
      props.injectedProvider, props.address,
      ['bytes','bytes','address','string','uint256','uint256'],
      ['0x19','0x0',metaWriteContracts["NiftyInk"].address,props.itemForSale,multipliedPrice,props.priceNonce])

    result = await tx(metaWriteContracts["NiftyInk"].setPriceFromSignature(props.itemForSale, multipliedPrice, signature, { gasPrice:props.gasPrice } ))
    */
  } else if(props.type === 'token') {

    let contractName = "NiftyToken"
    let regularFunction = "setTokenPrice"
    let regularFunctionArgs = [props.itemForSale, multipliedPrice]

    let txConfig = {
      ...props.transactionConfig,
      contractName,
      regularFunction,
      regularFunctionArgs
    }

    console.log(txConfig)

    result = await transactionHandler(txConfig)

    //result = await tx(writeContracts["NiftyToken"].setTokenPrice(props.itemForSale, multipliedPrice, { gasPrice:props.gasPrice } ))
  }
    notification.open({
      message: 'New price set for ' + props.ink.name,
      description: '$'+parseFloat(values['price']).toFixed(2)
    });
    priceForm.resetFields();
    setNewPrice(parseFloat(values['price']).toFixed(2))
    setBuying(false)
    console.log("result", result)
  } catch (e) {
    setBuying(false)
    console.log('error',e)
    notification.open({
      message: 'Price set unsuccessful',
      description:
      e.message,
    });
  }
  }

  const buyInk = async (values) => {
    console.log("values", values)
    setBuying(true)
    let bigNumber = ethers.utils.bigNumberify(props.price)
    let hex = bigNumber.toHexString()

    let result

    let contractName = "NiftyToken"
    let regularFunctionArgs = [props.itemForSale]
    let payment = hex
    let regularFunction
    if(props.type === 'ink') {
      regularFunction = "buyInk"
    //result = await tx(writeContracts["NiftyToken"].buyInk(props.itemForSale, { value: hex } ))
  } else if(props.type === 'token') {
      regularFunction = "buyToken"
  }

    let txConfig = {
      ...props.transactionConfig,
      contractName,
      regularFunction,
      regularFunctionArgs,
      payment
    }

    console.log(txConfig)

    try {
    result = await transactionHandler(txConfig)

        //result = await tx(writeContracts["NiftyToken"].buyToken(props.itemForSale, { value: hex } ))
    console.log(result)
    setBuying(false)
    if(result) {
    notification.open({
      message: <><span style={{marginRight:8}}>💵</span>Purchased Ink</>,
      description: 'You bought one ' + props.ink.name + ' for $'+parseFloat(ethers.utils.formatEther(props.price)).toFixed(2)
    });
  }
} catch(e) {
  setBuying(false)

}
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  if(props.visible === false) {
    shopButton = (<></>)
  } else if(props.address && props.ownerAddress && props.address.toLowerCase() === props.ownerAddress) {
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
      <InputNumber min={0} precision={3}
      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
      </Form.Item>

      <Form.Item >
      <Button type="primary" htmlType="submit" loading={buying}>
      Set Price
      </Button>
      </Form.Item>
      </Form>

      </Row>
    )

    if(props.type === 'token') {
    shopButton = (
      <Popover content={setPriceForm}
      title={"Set price:"}>
        <Button type="secondary" style={{ marginBottom: 12 }}><ShopOutlined />{newPrice>0?'$'+newPrice:(props.price>0?'$'+parseFloat(ethers.utils.formatEther(props.price)).toFixed(2):'Sell')}</Button>
      </Popover>
    )
  } else if (props.type === 'ink' && (props.price > 0 || newPrice > 0)) {
    shopButton = (
    <Popover content={setPriceForm}
    title={"Set price:"}>
      <Button type="secondary"><ShopOutlined />{newPrice>0?'$'+newPrice:'$'+parseFloat(ethers.utils.formatEther(props.price)).toFixed(2)}</Button>
    </Popover>
  )
  } else if (props.type === 'ink') {
    shopButton = setPriceForm
  }
  } else if (props.price > 0) {

    shopButton = (
      <Popconfirm
        title={'Purchase "'+props.ink.name+'" for $'+parseFloat(ethers.utils.formatEther(props.price)).toFixed(2)}
        onConfirm={buyInk}
        okText="Purchase"
        cancelText="Cancel"
        icon=<ShoppingCartOutlined/>
      >
      <Button type="primary" style={{ marginBottom: 12 }}><ShoppingCartOutlined />{'$'+parseFloat(ethers.utils.formatEther(props.price)).toFixed(2)}</Button>
      </Popconfirm>
    )
  } else {
    shopButton = (<></>)
  }

    return shopButton
  }
