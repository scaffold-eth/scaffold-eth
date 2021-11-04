import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { Web3Consumer } from "../helpers/Web3Context";
import { getFromIPFS } from "../helpers/ipfs";

function Ipfsup() {
  const [sending, setSending] = useState();
  const [downloading, setDownloading] = useState();
  const [ipfsDownHash, setIpfsDownHash] = useState();
  const [ipfsContent, setIpfsContent] = useState();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div style={{ paddingTop: 32, width: 740, margin: "auto" }}>
        <Input
          value={ipfsDownHash}
          placeHolder="IPFS hash (like QmadqNw8zkdrrwdtPFK1pLi8PPxmkQ4pDJXY8ozHtz6tZq)"
          onChange={e => {
            setIpfsDownHash(e.target.value);
          }}
        />
      </div>
      <Button
        style={{ margin: 8 }}
        loading={sending}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
          console.log("DOWNLOADING...", ipfsDownHash);
          setDownloading(true);
          setIpfsContent();
          const result = await getFromIPFS(ipfsDownHash); // addToIPFS(JSON.stringify(yourJSON))
          if (result && result.toString) {
            setIpfsContent(result.toString());
          }
          setDownloading(false);
        }}
      >
        Download from IPFS
      </Button>

      <pre style={{ padding: 16, width: 500, margin: "auto" }}>{ipfsContent}</pre>
    </div>
  );
}

export default Web3Consumer(Ipfsup);
