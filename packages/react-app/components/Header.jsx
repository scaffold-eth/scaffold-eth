import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer">
      <PageHeader title="🏗 GTC Staking" subTitle="stake GTC on web3 projects" style={{ cursor: "pointer" }} />
    </a>
  );
}
