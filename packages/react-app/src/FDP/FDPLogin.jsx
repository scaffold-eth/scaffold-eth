import { useState } from "react";
import { Input, Form } from "antd";
import { Transactor } from "../helpers";
import { Link, Route, Switch, useLocation } from "react-router-dom";

import { FdpStorage } from "@fairdatasociety/fdp-storage";
//import { FdpStorage } from "../fdp-storage/fdp-storage.ts";
//const FDP = require("@fairdatasociety/fdp-storage");

export default function FDPLogin({ address, userSigner }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [form] = Form.useForm();

  const tx = Transactor(userSigner);

  //var fdp = new FdpStorage({ options: ensOptions });
  //fdp.ens = new mainnetENSproxy(address);
  //fdp.createAccount(username, password);
  //fdp.connection.bee = new Bee(newUrl);

  async function onFinish(values) {
    console.log(values);
    /*let newTx;
    try {
      newTx = await tx(
        contracts.Inbox.depositEth(1, {
          value: utils.parseEther(values.amount.toString()),
          gasLimit: 300000,
        }),
      );

      await newTx.wait();
      console.log("woop!");
    } catch (e) {
      console.log(e);
      console.log("something went wrong!");
    }*/
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 12,
        offset: 8,
      },
    },
  };

  return (
    <div>
      <br />
      <h1>Fair Data Society Login</h1>
      <Form
        {...formItemLayout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        initialValues={{ username: "", password: "" }}
      >
        <Form.Item label="Username" name="username">
          <Input placeholder={username} />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input placeholder={password} />
        </Form.Item>
      </Form>

      <br />
      <h3>Don't have account ?</h3>
      <Link to={{ pathname: "https://create.dev.fairdatasociety.org" }} target="_blank" rel="noopener noreferrer">
        Create Account
      </Link>
    </div>
  );
}
