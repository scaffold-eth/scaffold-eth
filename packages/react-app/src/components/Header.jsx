import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="🏰 BuidlGuidl"
        subTitle="v2"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
