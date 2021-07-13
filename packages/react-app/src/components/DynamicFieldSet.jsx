import React from "react";
import { Button, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function DynamicFieldSet({ features, setFeatures }) {

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8, pull:0 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
    };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24 },
        },
    };

    return (
        <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel}>
          <Form.List
            name="names"
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <Input 
                        placeholder="Attached Garage, large yard..."
                        style={{ width: '90%' }} 
                        onChange={(e) => setFeatures(features.concat({fields : e.target.value}))}/>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {add(); setFeatures(features.concat("\n"))}}
                    style={{ width: '60%' }}
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
              
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
    );
}