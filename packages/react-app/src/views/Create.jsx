/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Space, Form, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Address, Balance, AddressInput, EtherInput } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader, useEventListener, useBalance } from '../hooks';
import tryToDisplay from "../components/Contract/utils";

export default function Create({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
  const [beneficiaries, setBeneficiaries] = useState(null);
  const [beneficiariesShare, setBeneficiariesShare] = useState([1]);
  const [depositValue, setDepositValue] = useState(0);
  const [timeForDethLOCK, setTimeForDethLOCK] = useState(null);
  const [editable, setEditable] = useState(true);



  const onFinishBeneficiaries = values => {
    console.log('New beneficiaries:', values);
    const result = values.beneficiaries.map(({ beneficiaries }) => beneficiaries);
    const result2 = values.beneficiaries.map(({ beneficiariesShare }) => beneficiariesShare);
      setBeneficiaries(result);
      setBeneficiariesShare(result2);
  };

  const contractBalance = useBalance(localProvider, readContracts.YourContract.address);
  var ts = Math.floor(new Date().getTime()/1000);

  const setCreate = useEventListener(readContracts, "YourContract", "timelockCreated", localProvider, 1);
  console.log("Eventos de creacion: ", setCreate);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
        <h2>Create TimeLock:</h2>


        <Divider/>
        Contract Address:

        <Address
            value={readContracts?readContracts.YourContract.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        /> <br />
        <Balance
          address={readContracts?readContracts.YourContract.address:readContracts}
          provider={localProvider}
          dollarMultiplier={price}
        />
        <div style={{border:"1px solid #cccccc", padding:16, width:600, margin:"auto",marginTop:64}}>
        <div style={{margin:8}}>
          ETH to deposit
          <Input default='0.' onChange={(e)=>{
              setDepositValue(e.target.value);
          }}/>

          </div>

          <Card style={{marginTop:32}}>
{/*
            <div>
              <Switch defaultChecked onChange={
                setEditable(!editable)
              } /> Editable?
            </div>
          */}

            <div style={{marginTop:8}}>
              <h3> DethLOCK time </h3>
              <div style={{marginTop:2}}>
                <DatePicker onChange={(e)=>{
                    let dateSelected = new Date(e);
                    setTimeForDethLOCK(Math.floor(dateSelected.getTime()/1000)); {/* Js is in miliseconds, block.timestamp in sec*/}
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

        <Button type="primary" disabled={!beneficiaries || !timeForDethLOCK} onClick={async ()=>{
          await tx({
              to: writeContracts.YourContract.address,
              value: parseEther(depositValue),
              data: writeContracts.YourContract.interface.encodeFunctionData("Lock(uint, bool, address)",[timeForDethLOCK, editable, beneficiaries[0]])
            });
        }}>
              Create
            </Button>


    </div>
    <h2>Current unixTime: {ts}</h2>
    <h2>Events:</h2>
    <List
      bordered
      dataSource={setCreate}
      renderItem={(item) => {
        return (
          <List.Item key={item.blockNumber+"_"+item.owner+"_"+item.timeForDethLOCK}>owner:
            <Address
                value={item.owner}
                ensProvider={mainnetProvider}
                fontSize={16}
              /> =>
            timeLock:{item.timeForDethLOCK.toNumber()} =>
            amount:{tryToDisplay(item.amount)}=>
            beneficiary:
            <Address
                value={item.beneficiary}
                ensProvider={mainnetProvider}
                fontSize={16}
              /> =>
            {item.owner == address ?
              <Button disabled={ contractBalance == 0. } onClick={async() =>{
                await tx({
                    to: writeContracts.YourContract.address,
                    data: writeContracts.YourContract.interface.encodeFunctionData("withdraw()")
                  });
              }
              }>

              withdraw</Button>
            :null}
            =>
          {item.beneficiary == address ?
            <Button disabled={ts<item.timeForDethLOCK.toNumber() || 0 == contractBalance} onClick={async() =>{
              await tx({
                  to: writeContracts.YourContract.address,
                  data: writeContracts.YourContract.interface.encodeFunctionData("claim()")
                });
            }
            }>

            claim</Button>
          :null}
          </List.Item>
        )
      }}
    />




    </div>
  );
}
