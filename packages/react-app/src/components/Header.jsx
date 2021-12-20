import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/scaffold-eth/scaffold-eth/tree/optimistic-loogie-tank" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Loogie Tank"
        subTitle="Own a loogie? Now they can swim! 🌊"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
