import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a
      href="https://github.com/scaffold-eth/scaffold-eth-examples/tree/abi-uploader"
      target="_blank"
      rel="noopener noreferrer"
    >
      <PageHeader
        title="ABI Ninja"
        subTitle="Interact with Ethereum contracts using their address and ABI"
        style={{ cursor: "pointer" }}
        className="site-page-header"
        avatar={{
          src: "https://user-images.githubusercontent.com/17074344/143511127-9e24b576-d1e2-42e0-b3c4-23e4a594a561.png",
        }}
      />
    </a>
  );
}
