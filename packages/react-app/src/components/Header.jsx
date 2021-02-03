import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="https://github.com/orbitmechanic/scaffold-eth/tree/TimeLock" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title=" 🏹 TimeLock/dETHlock ☠️"
        subTitle="Manage the future of your assets"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
