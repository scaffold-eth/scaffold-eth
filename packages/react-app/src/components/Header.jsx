import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="https://punkwallet.io">
      <PageHeader
        title="🧑‍🎤  PunkWallet.io"
        subTitle=""
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
