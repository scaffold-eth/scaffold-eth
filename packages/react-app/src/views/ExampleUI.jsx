/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Space, Form, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { AddressInput } from '../components';

import { parseEther, formatEther } from "@ethersproject/units";

export default function ExampleUI({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
    const [beneficiaries, setBeneficiaries] = useState(null);
    const [depositValue, setDepositValue] = useState(0);
    const [timeForDethLOCK, setTimeForDethLOCK] = useState(null);




    const onFinishBeneficiaries = values => {
      console.log('New beneficiaries:', values);
      setBeneficiaries(values.beneficiaries);
      // setBeneficiariesShare(values.beneficiariesShare);
    };

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
        <h2>Example UI:</h2>

        <Divider/>
        Funds (ETH):
        <Balance
          address={readContracts?readContracts.YourContract.address:readContracts}
          provider={localProvider}
          dollarMultiplier={price}
        />
        <br />

        Your Contract Address:
        <Address
            value={readContracts?readContracts.YourContract.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        />

        <Divider />

        <div style={{margin:8}}>
          <Input placeholder='Deposit ETH' onChange={(e)=>{
              setDepositValue(e.target.value);
          }}/>


          <Button onClick={()=>{
            /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
            tx({
              to: writeContracts.YourContract.address,
              value: parseEther(depositValue)
            });
            /* this should throw an error about "no fallback nor receive function" until you add it */
          }}>Deposit ETH</Button>
        </div>


      </div>

      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:256 }}>


        <Card style={{marginTop:32}}>


          <div style={{marginTop:8}}>
            <h3> DethLOCK time </h3>
            <div style={{marginTop:2}}>
              <DatePicker onChange={(e)=>{
                  let dateSelected = new Date(e);
                  setTimeForDethLOCK(dateSelected.getTime());
                }}/>
            </div>
          </div>

        </Card>
        <Card style={{marginTop:32}}>
          <h3> Beneficiaries </h3>
          <Form name="dynamic_form_item" onFinish={onFinishBeneficiaries}>
            <Form.List
              name="beneficiaries"
              rules={[
                {
                  validator: async (_, beneficiaries) => {
                    if (!beneficiaries || beneficiaries.length < 1) {
                      return Promise.reject(new Error('Choose at least 1 beneficiary'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...field}
                        name={[field.name, 'beneficiaries']}
                        fieldKey={[field.fieldKey, 'beneficiaries']}
                        rules={[{ required: true, message: 'Missing address' }]}
                      >
                        <Input placeholder="Beneficiary address" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'beneficiariesShare']}
                        fieldKey={[field.fieldKey, 'beneficiariesShare']}
                        rules={[{ required: true, message: 'Missing pct for beneficiary' }]}
                      >
                        <Input placeholder={fields.length > 1 ? 100/fields.length : 100} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '60%' }}
                      icon={<PlusOutlined />}
                    >
                      Add
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Set beneficiaries
              </Button>
            </Form.Item>
          </Form>
          </Card>

      <Button type="primary" onChange={()=>{console.log('Create vault')}}>
            Create vault
          </Button>

      </div>


    </div>
  );
}
