import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import {
  Button,
  Input,
  InputNumber,
  Form,
  message,
  Typography,
} from "antd";
import { addToIPFS, transactionHandler } from "./helpers";
import {
  SketchPicker,
  CirclePicker,
  TwitterPicker,
} from "react-color";
import { useAtom } from "jotai";
import { Uploader } from "./components";
import { imageUrlAtom } from "./hooks/Uploader";

const Hash = require("ipfs-only-hash");
const pickers = [CirclePicker, TwitterPicker, SketchPicker];

export default function CreateFile(props) {
  let history = useHistory();
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [imageUrl, setImageUrl] = useAtom(imageUrlAtom);

  const mintInk = async (inkUrl, jsonUrl, limit) => {
    let contractName = "NiftyInk";
    let regularFunction = "createInk";
    let regularFunctionArgs = [
      inkUrl,
      jsonUrl,
      props.ink.attributes[0]["value"],
    ];
    let signatureFunction = "createInkFromSignature";
    let signatureFunctionArgs = [
      inkUrl,
      jsonUrl,
      props.ink.attributes[0]["value"],
      props.address,
    ];
    let getSignatureTypes = [
      "bytes",
      "bytes",
      "address",
      "address",
      "string",
      "string",
      "uint256",
    ];
    let getSignatureArgs = [
      "0x19",
      "0x0",
      props.readKovanContracts["NiftyInk"].address,
      props.address,
      inkUrl,
      jsonUrl,
      limit,
    ];

    let createInkConfig = {
      ...props.transactionConfig,
      contractName,
      regularFunction,
      regularFunctionArgs,
      signatureFunction,
      signatureFunctionArgs,
      getSignatureTypes,
      getSignatureArgs,
    };

    console.log(createInkConfig);

    let result = await transactionHandler(createInkConfig);

    return result;
  };

  const createInk = async (values) => {
    console.log("Success:", values);
    console.log("imageUrl", imageUrl);

    setSending(true);

    let imageBuffer = Buffer.from(imageUrl.split(",")[1], "base64");

    let currentInk = props.ink;

    currentInk["attributes"] = [
      {
        trait_type: "Limit",
        value: values.limit.toString(),
      },
    ];
    currentInk["name"] = values.title;
    let newEns;
    try {
      newEns = await props.mainnetProvider.lookupAddress(props.address);
    } catch (e) {
      console.log(e);
    }
    const timeInMs = new Date();
    const addressForDescription = !newEns ? props.address : newEns;
    currentInk["description"] =
      "A Nifty Ink by " +
      addressForDescription +
      " on " +
      timeInMs.toUTCString();

    props.setIpfsHash();

    const imageHash = await Hash.of(imageBuffer);
    console.log("imageHash", imageHash);

    currentInk["image"] = "https://ipfs.io/ipfs/" + imageHash;
    currentInk["external_url"] = "https://nifty.ink/" + imageHash;
    props.setInk(currentInk);
    console.log("Ink:", props.ink);

    var inkStr = JSON.stringify(props.ink);
    const inkBuffer = Buffer.from(inkStr);

    const jsonHash = await Hash.of(inkBuffer);
    console.log("jsonHash", jsonHash);

    try {
      var mintResult = await mintInk(
        imageHash,
        jsonHash,
        values.limit.toString()
      );
    } catch (e) {
      console.log(e);
      setSending(false);
    }

    if (mintResult) {
      const imageResult = addToIPFS(imageBuffer, props.ipfsConfig);
      const inkResult = addToIPFS(inkBuffer, props.ipfsConfig);

      const imageResultInfura = addToIPFS(imageBuffer, props.ipfsConfigInfura);
      const inkResultInfura = addToIPFS(inkBuffer, props.ipfsConfigInfura);

      Promise.all([imageResult, inkResult]).then((values) => {
        console.log("FINISHED UPLOADING TO PINNER", values);
        message.destroy();
      });

      setSending(false);
      history.push("/ink/" + imageHash);

      Promise.all([imageResultInfura, inkResultInfura]).then((values) => {
        console.log("INFURA FINISHED UPLOADING!", values);
      });

      setImageUrl(null);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("errorInfo:", errorInfo);
  };

  const top = (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 25 }}>Upload your own art</Typography.Title>
      <Form
        layout={"inline"}
        name="createFile"
        onFinish={createInk}
        onFinishFailed={onFinishFailed}
        labelAlign={"middle"}
        style={{ justifyContent: "center", marginBottom: "30px" }}
      >
        <Form.Item
          name="title"
          rules={[
            { required: true, message: "What is this work of art called?" },
          ]}
        >
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder={"Name"}
            style={{ fontSize: 16 }}
          />
        </Form.Item>

        <Form.Item
          name="limit"
          rules={[{ required: true, message: "How many files can be minted?" }]}
        >
          <InputNumber
            onChange={(e) => {
              setNumber(e);
            }}
            placeholder={"Limit"}
            style={{ fontSize: 16 }}
            min={0}
            precision={0}
          />
        </Form.Item>

        <Form.Item>
          <Button
            loading={sending}
            type="primary"
            htmlType="submit"
            disabled={!name || !number || !imageUrl}
          >
            Upload
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
