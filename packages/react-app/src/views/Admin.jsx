import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Button, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import randomstring from "randomstring";
// import { Link } from "react-router-dom";

function Admin({ tx, readContracts, writeContracts }) {
  const [challenge, setChallenge] = useState("");
  const [form] = Form.useForm();
  const size = "large";

  const admitHolder = async () => {
    const result = tx(writeContracts.YourContract.buyTicket({ value: ethers.utils.parseEther("0.01") }), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  const createNewChallenge = () => {
    const randomch = randomstring.generate(10);

    setChallenge(randomch);
  };

  useEffect(() => {
    createNewChallenge();
  }, []);

  return (
    <section>
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>Hello Ticket App</div>

      {/* Generate Admission signature: start */}

      <div style={{ margin: "20px auto", maxWidth: "500px", border: "1px solid" }}>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>Generate Admission signature</div>
        <div style={{ marginBottom: "20px", padding: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <Typography.Text style={{ fontSize: 18 }} copyable={{ text: challenge }}>
              {challenge}
            </Typography.Text>
          </div>
          <Form
            name="createBoard"
            layout="vertical"
            form={form}
            initialValues={{ voterControl: "asAccessControl" }}
            onFinish={admitHolder}
          >
            <Form.Item name="tokenId" label="Token ID" rules={[{ required: true }]}>
              <Input type="text" size={size} placeholder="Your ticket ID..." />
            </Form.Item>
            <Form.Item name="signature" label="Holder Signature" rules={[{ required: true }]}>
              <Input type="text" size={size} placeholder="Holder signature..." />
            </Form.Item>

            <div>
              <Button
                onClick={() => {
                  createNewChallenge();
                  form.resetFields();
                }}
              >
                Reset
              </Button>
              <span style={{ marginLeft: "10px" }} />
              <Button type="primary" onClick={() => form.submit()}>
                Admit Holder
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {/* Generate Admission signature: end */}
    </section>
  );
}

export default Admin;
