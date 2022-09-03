import React, { useState } from "react";
import { Button, Input, Card, Form } from "antd";

const { BufferList } = require("bl");
const ipfsClient = require("ipfs-http-client");

const { REACT_APP_INFURA_ID, REACT_APP_INFURA_SECRET } = process.env;
const projectId = REACT_APP_INFURA_ID;
const projectSecret = REACT_APP_INFURA_SECRET;

const auth = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function ImageToIPFS() {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  // IPFS Bits:
  const [sending, setSending] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [buffer, setBuffer] = useState();

  const addToIPFS = async fileToUpload => {
    const result = await ipfs.add(fileToUpload);
    return result;
  };

  const getFromIPFS = async hashToGet => {
    for await (const file of ipfs.get(hashToGet)) {
      console.log(file.path);
      if (!file.content) continue;
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      console.log(content);
      return content;
    }
  };

  /* useEffect(()=>{
        if(ipfsHash) asyncGetFile()
    },[ipfsHash])

    let ipfsDisplay = ""
    if(ipfsHash){
        if(!ipfsContents){
            ipfsDisplay = (
                <Spin />
            )
        }else{
            ipfsDisplay = (
                <pre style={{margin:8,padding:8,border:"1px solid #dddddd",backgroundColor:"#ededed"}}>
                {ipfsContents}
                </pre>
            )
        }
    } */

  const changeHandler = async event => {
    setSelectedFile(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      console.log("buffer: ", buffer);
    };
    setIsSelected(true);
  };

  return (
    <div style={{ width: 500, margin: "auto", marginTop: 64 }}>
      <h3> Choose a file:</h3>
      <Form>
        <Input type="file" accept="image/*" onChange={changeHandler} />
        <div style={{ margin: "32px" }} />
        <Button
          type="primary"
          disabled={!selectedFile}
          onClick={async () => {
            console.log("UPLOADING...");
            setSending(true);

            const result = await addToIPFS(selectedFile);
            if (result && result.path) {
              setIpfsHash(result.path);
            }
            setSending(false);
          }}
        >
          Upload Image to IPFS
        </Button>
      </Form>

      <div style={{ width: 500, margin: "auto", marginTop: 64 }}>
        <div>{ipfsHash ? <h1>Your image is uploaded!</h1> : <p>{""}</p>}</div>
        {ipfsHash ? (
          <Card>
            <img src={"https://ipfs.io/ipfs/" + ipfsHash} alt="From IPFS" style={{ width: "300px" }} />
          </Card>
        ) : (
          <p>{""}</p>
        )}
        <div>
          {ipfsHash ? (
            <a href={"https://ipfs.io/ipfs/" + ipfsHash} target="blank">
              {ipfsHash}
            </a>
          ) : (
            <p>{""}</p>
          )}
        </div>
      </div>
    </div>
  );
}
