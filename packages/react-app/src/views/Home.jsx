import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
// import { useEventListener } from "eth-hooks/events/useEventListener";
// import { Link } from "react-router-dom";

const zero = ethers.BigNumber.from("0");

function Home({ tx, address, typedSigner, localProvider, readContracts, writeContracts }) {
  const [sig, setSig] = useState();

  const price = useContractReader(readContracts, "YourContract", "price", []) || zero;
  // const balance = (useContractReader(readContracts, "YourContract", "balanceOf", [address]) || zero).toNumber();
  const size = "large";
  const [form] = Form.useForm();

  const buyTicket = async () => {
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

  const generateAdmissionSignature = async value => {
    value = { owner: address, ...value };

    const signature = await typedSigner(
      {
        Checkin: [
          { name: "owner", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "challenge", type: "string" },
        ],
      },
      value,
    );

    console.log(value);
    console.log(signature);

    setSig(signature);
    form.resetFields();
  };

  return (
    <section>
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>Hello Ticket App</div>

      {/* Buy a ticket: start */}
      <div style={{ margin: "20px auto", maxWidth: "500px", border: "1px solid" }}>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>Buy A Ticket (1 per address)</div>
        <div style={{ marginBottom: "20px" }}>
          <Button type="primary" onClick={buyTicket}>
            Buy Ticket for Ξ {ethers.utils.formatUnits(price)}
          </Button>
        </div>
      </div>
      {/* Buy a ticket: end */}

      {/* Generate Admission signature: start */}

      <div style={{ margin: "20px auto", maxWidth: "500px", border: "1px solid" }}>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>Generate Admission signature</div>
        <div style={{ marginBottom: "20px", padding: "10px" }}>
          <Form
            name="createBoard"
            layout="vertical"
            form={form}
            initialValues={{ voterControl: "asAccessControl" }}
            onFinish={generateAdmissionSignature}
          >
            <Form.Item name="tokenId" label="Ticket ID" rules={[{ required: true }]}>
              <Input type="text" size={size} placeholder="Your ticket ID..." />
            </Form.Item>
            <Form.Item name="challenge" label="Admin Challenge" rules={[{ required: true }]}>
              <Input type="text" size={size} placeholder="Admin Challenge..." />
            </Form.Item>

            <Button type="primary" onClick={() => form.submit()}>
              Generate Signature
            </Button>
          </Form>
        </div>

        {sig && (
          <div style={{ marginTop: "20px", width: "100%" }}>
            <Typography.Text copyable={{ text: sig }}>{sig}</Typography.Text>
          </div>
        )}
      </div>
      {/* Generate Admission signature: end */}
    </section>
  );
}

export default Home;
