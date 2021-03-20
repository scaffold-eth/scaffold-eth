import React, { useState } from "react";
import { Card, Button, Input, Layout } from "antd";

const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;

export default function StartMemory() {

  const onChange = e => {
    console.log(e);
  };
  
  return (
    <div >

          <Layout>
      <Sider>
          <h2>Start a Memory</h2>
          <div>Describe a memorable event. All who want to remember it with you can become a witness </div>
        </Sider>
      <Layout>
        <Header>
          </Header>
        <Content>
          <Input placeholder="Name of your activity" allowClear onChange={onChange} />
            <br />
            <br />
          <TextArea placeholder="Example description" allowClear onChange={onChange} />
           <p> </p>
            <Button >Publish</Button>
            <p> </p>
          </Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </Layout>

    </div>
  );
}
