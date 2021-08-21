import React, { useState } from "react";
import { Form, Input, Divider, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
const { Title } = Typography;

export default function QuadraticDiplomacyCreate({ tx, writeContracts }) {
  const [voters, setVoters] = useState([{}]);
  const [voteAllocation, setVoteAllocation] = useState(0);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    // ToDo. Do some validation (non-empty elements, etc.)
    const names = [];
    const wallets = [];

    voters.forEach(({ name, address }) => {
      names.push(name);
      wallets.push(address);
    });

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
          {/*ToDo Disable if empty members */}
          <Button type="primary" htmlType="submit" block disabled={!voteAllocation}>
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
      <Form.Item label="Address" name={`address[${index}]`} style={{ marginBottom: "5px" }}>
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
      <div style={{ marginBottom: "20px" }}>
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={event => {
            setVoters(prevVoters => {
              const nextVoters = [...prevVoters];
              return nextVoters.filter((_, i) => i !== index);
            });
          }}
        />
      </div>
    </>
  );
};
