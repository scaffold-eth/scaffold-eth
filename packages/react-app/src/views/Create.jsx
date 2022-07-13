// import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Input, Form, Button } from "antd";
import React, { useState } from "react";
import { EtherInput } from "../components";
import { addToIPFS } from "../helpers/ipfs";
import { firebase } from "../utils";
// import { Link } from "react-router-dom";

function Create({ address, typedSigner, price }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const inputSize = "large";

  const onFormLayoutChange = v => {
    // console.log({ v });
  };

  const handleSubmit = async v => {
    setLoading(true);

    // add poem to IPFS
    const { path: poem } = await addToIPFS(v.poem);

    // create poem data
    const data = { title: v.title, poet: address, poem, amount: ethers.utils.parseUnits(v.price) };

    // sign poem data
    const signature = await typedSigner(
      {
        Poem: [
          { name: "poet", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "title", type: "string" },
          { name: "poem", type: "string" },
        ],
      },
      data,
    );

    // commit to database
    const createPoem = firebase.functions.httpsCallable("createPoem");

    // send value and signature to backend for validation
    const res = await createPoem({ value: data, signature });

    console.log(res);

    setLoading(false);
  };

  return (
    <div style={{ margin: "10px auto", maxWidth: "600px", paddingTop: "10px", paddingBottom: "10px" }}>
      <div style={{ width: "100%" }}>
        <Form layout="vertical" form={form} onValuesChange={onFormLayoutChange} onFinish={handleSubmit}>
          <Form.Item name="title">
            <Input size={inputSize} placeholder="Title" />
          </Form.Item>
          <Form.Item name="poem">
            <Input.TextArea size={inputSize} rows={4} placeholder="Poem here..." />
          </Form.Item>
          <Form.Item name="price">
            <EtherInput price={price} size={inputSize} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Create;
