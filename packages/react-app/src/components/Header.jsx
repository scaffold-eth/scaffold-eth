import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth/defi-smile-donations" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="😎 Defi Smile"
        subTitle="Automatic tranaction splitting used for collecting donations for charity"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
