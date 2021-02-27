import React, { useState } from "react";
import { Form, Button, notification } from "antd";
import { AddressInput } from "./components";
import { Transactor, transactionHandler } from "./helpers";
import { useContractLoader } from "./hooks";
import { getSignature } from "./helpers/getSignature"

export default function TransferOwnershipForm(props) {
    const [sending, setSending] = useState(false);
    const [signature, setSignature] = useState(false);
    const [form] = Form.useForm();
    const metaWriteContracts = useContractLoader(
        props.injectedProvider
    );

    const transferOwnership = async (values) => {

        let signature = await getSignature(
            props.injectedProvider, props.address,
            ['bytes', 'bytes', 'address', 'address', 'string'],
            ['0x19', '0x0', metaWriteContracts["NiftyInk"].address, props.address, props.fileUrl]);
        setSignature(signature);

        setSending(true);

        let contractName = "NiftyInk";
        let regularFunction = "transferOwnership";
        let regularFunctionArgs = [props.fileUrl, props.address, values["to"], signature];

        let txConfig = {
            ...props.transactionConfig,
            contractName,
            regularFunction,
            regularFunctionArgs,
        };

        console.log(txConfig);

        let result;
        try {
            const mainnetBytecode = await props.mainnetProvider.getCode(values["to"]);
            if (
                !mainnetBytecode ||
                mainnetBytecode === "0x" ||
                mainnetBytecode === "0x0" ||
                mainnetBytecode === "0x00"
            ) {
                result = await transactionHandler(txConfig);
                notification.open({
                    message: "👋 Sending successful!",
                    description: "👀 Sent to " + values["to"],
                });
            } else {
                notification.open({
                    message: "📛 Sorry! Unable to send to this address",
                    description: "This address is a smart contract 📡",
                });
            }

            console.log(result);
            //await tx(writeContracts["NiftyToken"].safeTransferFrom(props.address, values['to'], props.tokenId))
            form.resetFields();
            setSending(false);
        } catch (e) {
            console.log(result);
            form.resetFields();
            setSending(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    let output = (
        <Form
            form={form}
            layout={"inline"}
            name="transferOwnership"
            initialValues={{ tokenId: props.tokenId }}
            onFinish={transferOwnership}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name="to"
                rules={[
                    {
                        required: true,
                        message: "Which address are you delegating the ownership rights of the artwork to?",
                    },
                ]}
            >
                <AddressInput
                    ensProvider={props.mainnetProvider}
                    placeholder={"to address"}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={sending}>
                    Transfer Ownership
        </Button>
            </Form.Item>
        </Form>
    );

    return output;
}

