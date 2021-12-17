import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://oe40.me" target="_blank" rel="noopener noreferrer">
      <PageHeader title="🍻 oe40.me" subTitle="Sipping on cool, crisp OΞ 40s!" style={{ cursor: "pointer" }} />
    </a>
  );
}
