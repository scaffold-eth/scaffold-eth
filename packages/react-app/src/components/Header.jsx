import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="🏰 BuidlGuidl"
        subTitle="building on Ethereum in public"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
