import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import React, { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

class MintMemoryDrawer extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showDrawer}>
          <PlusOutlined /> Mint New Memory
        </Button>
        <Drawer
          title="Create a commemaritive token"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
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
      </>
    );
  }
}

export default MintMemoryDrawer