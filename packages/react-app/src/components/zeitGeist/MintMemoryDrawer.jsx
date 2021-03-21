import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import React, { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view'
const { BufferList } = require('bl')
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

//EXAMPLE STARTING JSON:
const STARTING_JSON = {
  "witness_memory": "<enter ipfs image url here>",
  "other": "Berlin cloud high"
}

//helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path)
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    console.log(content)
    return content
  }
}


const { Option } = Select;

// class MintMemoryDrawer extends React.Component {
// class MintMemoryDrawer extends React.Component {
export default function MintMemoryDrawer ({
  becomeWitness, markAsCompleted, a_id
}) {

  // state = { visible: false };
  const [visible, setVisible] = useState(false);
  const [ yourJSON, setYourJSON ] = useState( STARTING_JSON );
  const [ sending, setSending ] = useState()
  const [ ipfsHash, setIpfsHash ] = useState("")
  const [ ipfsDownHash, setIpfsDownHash ] = useState()

  const [ downloading, setDownloading ] = useState()
  const [ ipfsContent, setIpfsContent ] = useState()


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
              <Button disabled={ipfsHash ? false : true} onClick={() => markAsCompleted(a_id)} type="primary">
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
                  onChange={(e)=>{
                    setIpfsDownHash(e.target.value)
                  }}
                  />
                </Form.Item>
              <Button style={{margin:8}} loading={sending} size="large" shape="round" type="primary" onClick={async()=>{
                  console.log("DOWNLOADING...",ipfsDownHash)
                setDownloading(true)
                setIpfsContent()
                  const result = await getFromIPFS(ipfsDownHash)//addToIPFS(JSON.stringify(yourJSON))
                  if(result && result.toString) {
                    setIpfsContent(result.toString())
                  }
                  setYourJSON({
                    player_memory: ipfsDownHash,
                    activity_id: a_id,
                    ...yourJSON
                  })
                  setDownloading(false)
              }}>Download from IPFS</Button>



                {/* <div style={{ paddingTop:32, width:740, margin:"auto" }}>
                <Input
                  value={ipfsDownHash}
                  placeHolder={"IPFS hash (like QmadqNw8zkdrrwdtPFK1pLi8PPxmkQ4pDJXY8ozHtz6tZq)"}
                  onChange={(e)=>{
                    setIpfsDownHash(e.target.value)
                  }}
                />
              </div>
              <Button style={{margin:8}} loading={sending} size="large" shape="round" type="primary" onClick={async()=>{
                  console.log("DOWNLOADING...",ipfsDownHash)
                setDownloading(true)
                setIpfsContent()
                  const result = await getFromIPFS(ipfsDownHash)//addToIPFS(JSON.stringify(yourJSON))
                  if(result && result.toString) {
                    setIpfsContent(result.toString())
                  }
                  setDownloading(false)
              }}>Download from IPFS</Button> */}

              <pre  style={{padding:16, width:500, margin:"auto",paddingBottom:150}}>
                {ipfsContent}
              </pre>


              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                {/* <Form.Item
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
              </Form.Item> */}
              <p>
                If you're happy with the players submission, add your own note or ipfs-hash/url-link to the token metadata below
              </p>

            <div style={{ paddingTop:32, width:740, margin:"auto", textAlign:"left" }}>
              <ReactJson
                style={{ padding:8 }}
                src={yourJSON}
                theme={"pop"}
                enableClipboard={false}
                onEdit={(edit,a)=>{
                  setYourJSON(edit.updated_src)
                }}
                onAdd={(add,a)=>{
                  setYourJSON(add.updated_src)
                }}
                onDelete={(del,a)=>{
                  setYourJSON(del.updated_src)
                }}
              />
            </div>

            <Button style={{margin:8}} loading={sending} size="large" shape="round" type="primary" onClick={async()=>{
                console.log("UPLOADING...",yourJSON)
                setSending(true)
                setIpfsHash()
                const result = await ipfs.add(JSON.stringify(yourJSON))//addToIPFS(JSON.stringify(yourJSON))
                if(result && result.path) {
                  setIpfsHash(result.path)
                }
                setSending(false)
                console.log("RESULT:",result)
            }}>Upload to IPFS</Button>

            <div  style={{padding:16,paddingBottom:150}}>
              {ipfsHash}
            </div>


              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    );
  }
// })

// export default MintMemoryDrawer