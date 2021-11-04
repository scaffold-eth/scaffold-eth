import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Web3Consumer } from "../helpers/Web3Context";
import dynamic from "next/dynamic";
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
import { ipfs } from "../helpers/ipfs";

// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "It's actually a bison?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Buffalo",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "green",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
  ],
};

function Ipfsup() {
  const [yourJSON, setYourJSON] = useState(STARTING_JSON);
  const [sending, setSending] = useState();
  const [ipfsHash, setIpfsHash] = useState();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div style={{ paddingTop: 32, width: 740, margin: "auto", textAlign: "left" }}>
        <ReactJson
          style={{ padding: 8 }}
          src={yourJSON}
          theme="pop"
          enableClipboard={false}
          onEdit={(edit, a) => {
            setYourJSON(edit.updated_src);
          }}
          onAdd={(add, a) => {
            setYourJSON(add.updated_src);
          }}
          onDelete={(del, a) => {
            setYourJSON(del.updated_src);
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
          console.log("UPLOADING...", yourJSON);
          setSending(true);
          setIpfsHash();
          const result = await ipfs.add(JSON.stringify(yourJSON)); // addToIPFS(JSON.stringify(yourJSON))
          if (result && result.path) {
            setIpfsHash(result.path);
          }
          setSending(false);
          console.log("RESULT:", result);
        }}
      >
        Upload to IPFS
      </Button>

      <div style={{ padding: 16, paddingBottom: 150 }}>{ipfsHash}</div>
    </div>
  );
}

export default Web3Consumer(Ipfsup);
