import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import React, { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// class MintMemoryDrawer extends React.Component {
// class MintMemoryDrawer extends React.Component {
export default function MintMemoryDrawer ({
  becomeWitness, markAsCompleted, a_id
}) {

  // state = { visible: false };
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

    return (
      <div>
        <Button type="primary" onClick={showDrawer}>
          <PlusOutlined /> Mint New Memory
        </Button>
        <Drawer
          title="Create a commemaritive token"
          width={720}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Back
              </Button>
              <Button onClick={() => markAsCompleted(a_id)} type="primary">
                Mint Token
              </Button>
            </div>
          }
        >
            <div>
                <p>
                    To remember this, you will now create your own custom NFT Token. 
                    Whatever you put in here, will be stored in the metadata on-chain, creating 
                    a permanent record of your event. So rad!!
                </p>
            </div>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="url"
                  label="Url"
                  rules={[{ required: true, message: 'Please enter url' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="ipfs://"
                    // addonAfter=".com"
                    placeholder="Please enter the ipfs hash of the data you and your friend created of the activity"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'Leave another note',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Leave another greeting here if you want" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    );
  }
// })

// export default MintMemoryDrawer