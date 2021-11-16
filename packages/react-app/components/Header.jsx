import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Guillermo’s Ticket"
        subTitle="Built with NextJS ▲ & scaffold-eth 🏗"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
