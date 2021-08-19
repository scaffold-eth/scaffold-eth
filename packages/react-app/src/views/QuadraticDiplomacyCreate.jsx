import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Form,
  Input,
  Divider,
  Button,
  List,
  Steps,
  Typography,
  Badge,
  notification,
} from "antd";
import { SmileTwoTone, LikeTwoTone, CheckCircleTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Address } from "../components";
const { Title } = Typography;

export default function QuadraticDiplomacyCreate({ tx, writeContracts }) {
  const [voters, setVoters] = useState([{}]);
  const [voteAllocation, setVoteAllocation] = useState(0);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const names = [];
    const wallets = [];

    voters.forEach(({ name, address }) => {
      names.push(name);
      wallets.push(address);
    });

    console.log('V', voters);
    console.log('names', names);
    console.log('address', wallets);

    await tx(writeContracts.QuadraticDiplomacyContract.addMembersWithVotes(names, wallets, voteAllocation), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setVoters([{}]);
        setVoteAllocation(0);
        form.resetFields();
      }
    });
  };

  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
      <Title level={3}>Add members</Title>
      <Divider />
      <Form form={form} name="basic" onFinish={handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="Vote allocation" name="voteCredit" style={{ textAlign: "left" }}>
          <Input
            type="number"
            placeholder="Voter allocation"
            style={{ width: "50%" }}
            onChange={event => setVoteAllocation(event.target.value)}
          />
        </Form.Item>
        <Divider />
        {voters.map((_, index) => (
          <VoterInput key={index} index={index} setVoters={setVoters} />
        ))}
        <Divider />
        <Form.Item style={{ justifyContent: "center" }}>
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setVoters(prevVoters => [...prevVoters, {}])}
          >
            Add Voter
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const VoterInput = ({ index, setVoters }) => {
  return (
    <>
      <Form.Item label="Name" name={`name[${index}]`} style={{ textAlign: "left", marginBottom: "5px" }}>
        <Input
          placeholder="Voter name"
          style={{ width: "50%" }}
          onChange={event =>
            setVoters(prevVoters => {
              const nextVoters = [...prevVoters];
              nextVoters[index].name = event.target.value;
              return nextVoters;
            })
          }
        />
      </Form.Item>
      <Form.Item label="Address" name={`address[${index}]`}>
        <Input
          placeholder="Voter address"
          onChange={event =>
            setVoters(prevVoters => {
              const nextVoters = [...prevVoters];
              nextVoters[index].address = event.target.value;
              return nextVoters;
            })
          }
        />
      </Form.Item>
    </>
  );
};
