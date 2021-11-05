import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://greatestlarp.com" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title='🤖 3D EthBot Minter'
        subTitle="Coordination project for the greatest larp!"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
