import React, { useState } from "react";
import { Form, Input, Divider, Button, Typography, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { AddressInput } from "../components";
const { Title } = Typography;

export default function QuadraticDiplomacyCreate({ mainnetProvider, tx, writeContracts }) {
  const [voters, setVoters] = useState([""]);
  const [voteAllocation, setVoteAllocation] = useState(0);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    // ToDo. Do some validation (non-empty elements, etc.)
    await tx(writeContracts.QuadraticDiplomacyContract.addMembersWithVotes(voters, voteAllocation), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setVoters([""]);
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
          <VoterInput key={index} index={index} setVoters={setVoters} voters={voters} mainnetProvider={mainnetProvider} />
        ))}
        <Divider />
        <Form.Item style={{ justifyContent: "center" }}>
          {/*ToDo. Restart ant form state (the browser is keeping filled-removed elements)*/}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setVoters(prevVoters => [...prevVoters, ""])}
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

const VoterInput = ({ index, voters, setVoters, mainnetProvider }) => {
  return (
    <>
      <Form.Item label={`Member ${index + 1}`} name={`address[${index}]`} style={{ marginBottom: "5px" }}>
        <Row gutter={8} align="middle">
          <Col flex="auto">
            <AddressInput
              autoFocus
              ensProvider={mainnetProvider}
              placeholder="Enter address"
              value={voters[index]}
              onChange={address => {
                setVoters(prevVoters => {
                  const nextVoters = [...prevVoters];
                  nextVoters[index] = address;
                  return nextVoters;
                });
              }}
            />
          </Col>
          <Col>
            <DeleteOutlined
              style={{ cursor: "pointer", color: "#ff6666" }}
              onClick={event => {
                setVoters(prevVoters => {
                  const nextVoters = [...prevVoters];
                  return nextVoters.filter((_, i) => i !== index);
                });
              }}
            />
          </Col>
        </Row>
      </Form.Item>
    </>
  );
};
