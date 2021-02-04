import React, { useState } from "react";
import { Input, Space, Form, Card, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default function BeneficiariesInput(props) {
  const [setBeneficiariesShare] = useState([1]);

  const onFinishBeneficiaries = values => {
    const result = values.beneficiaries.map(({ beneficiaries }) => beneficiaries);
    console.log("New beneficiaries:", result);
    props.onChange(result);

    const resultsShares = values.beneficiaries.map(({ beneficiariesShare }) => beneficiariesShare);
    setBeneficiariesShare(resultsShares); // compute percenteages
  };

  return (
    <div>
      <Card style={{ marginTop: 32 }}>
        <h3> Beneficiaries </h3>
        <Form name="dynamic_form_item" onFinish={onFinishBeneficiaries}>
          <Form.List
            name="beneficiaries"
            rules={[
              {
                validator: async (_, beneficiaries) => {
                  if (!beneficiaries || beneficiaries.length < 1) {
                    return Promise.reject(new Error("Choose at least 1 beneficiary"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, "beneficiaries"]}
                      fieldKey={[field.fieldKey, "beneficiaries"]}
                      rules={[{ required: true, message: "Missing address" }]}
                    >
                      <Input placeholder="Beneficiary address" />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <Form.Item
                        {...field}
                        name={[field.name, "beneficiariesShare"]}
                        fieldKey={[field.fieldKey, "beneficiariesShare"]}
                        rules={[{ required: true, message: "Missing pct for beneficiary" }]}
                      >
                        <Input placeholder={fields.length > 1 ? 100 / fields.length : 100} />
                      </Form.Item>
                    ) : null}
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} style={{ width: "60%" }} icon={<PlusOutlined />}>
                    Add
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Set beneficiaries
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
