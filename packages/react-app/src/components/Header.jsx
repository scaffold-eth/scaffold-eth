import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://dao.buidlguidl.com">
      <PageHeader
        title="🏰 BuidlGuidl DAO LLC "
        subTitle="(🤠 Registered Wyoming DAO LLC 2021-001041159)"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
