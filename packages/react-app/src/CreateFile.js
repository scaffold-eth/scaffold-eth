import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import {
  UndoOutlined,
  ClearOutlined,
  PlaySquareOutlined,
  HighlightOutlined,
  BgColorsOutlined,
  BorderOutlined,
} from "@ant-design/icons";
import {
  Row,
  Button,
  Input,
  InputNumber,
  Form,
  message,
  Col,
  Slider,
  Space,
} from "antd";
import { useLocalStorage } from "./hooks";
import { addToIPFS, transactionHandler } from "./helpers";
import CanvasDraw from "react-canvas-draw";
import {
  SketchPicker,
  CirclePicker,
  TwitterPicker,
  AlphaPicker,
} from "react-color";
import LZ from "lz-string";
import { Uploader } from "./components";

const Hash = require("ipfs-only-hash");
const pickers = [CirclePicker, TwitterPicker, SketchPicker];

export default function CreateFile(props) {
  let history = useHistory();
  const [sending, setSending] = useState();

  const createFile = () => {};
  const onFinishFailed = () => {};

  const top = (
    <div style={{ width: "90vmin", margin: "0 auto", marginBottom: 16 }}>
      <Form
        layout={"inline"}
        name="createFile"
        onFinish={createFile}
        onFinishFailed={onFinishFailed}
        labelAlign={"middle"}
        style={{ justifyContent: "center" }}
      >
        <Form.Item></Form.Item>

        <Form.Item
          name="title"
          rules={[
            { required: true, message: "What is this work of art called?" },
          ]}
        >
          <Input placeholder={"name"} style={{ fontSize: 16 }} />
        </Form.Item>

        <Form.Item
          name="limit"
          rules={[{ required: true, message: "How many files can be minted?" }]}
        >
          <InputNumber
            placeholder={"limit"}
            style={{ fontSize: 16 }}
            min={0}
            precision={0}
          />
        </Form.Item>

        <Form.Item>
          <Button loading={sending} type="primary" htmlType="submit">
            GO!
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {top}
      <Uploader />
    </div>
  );
}
