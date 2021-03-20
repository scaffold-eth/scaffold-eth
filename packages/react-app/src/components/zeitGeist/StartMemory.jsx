import React, { useState } from "react";
import { Card, Button, Input, Layout } from "antd";

const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;

export default function StartMemory({
  readContracts, writeContracts, localProvider, userProvider, tx, afterCreated
}) {

  const onChange = e => {
    console.log(e);
    {setnewActivity(e.target.value)}
  };
  const onSubmit = () =>{
    tx( writeContracts.YourContract.createActivity(newActivity) )
    afterCreated()
    // setnewActivity("another one?")
  }

  const [newActivity, setnewActivity] = useState("loading...");
  
  return (
    <div >
    <Layout>
      <Sider>
          <h2>Start a Memory</h2>
          <div>Describe a memorable event. All who want to remember it with you can become a witness </div>
        </Sider>
      <Layout>
        <Content>
          <TextArea placeholder="Example description" allowClear onChange={onChange} />
           <p> </p>
                <Button onClick={onSubmit}>Publish</Button>
            <p> </p>
          </Content>
      </Layout>
    </Layout>

    </div>
  );
}
