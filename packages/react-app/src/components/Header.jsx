import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="SailorLoogies"
        subTitle="FancyLoogies go fishing"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
