import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="🤝 Good Tokens"
        subTitle="putiing NFTs to good work ⚒️"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
