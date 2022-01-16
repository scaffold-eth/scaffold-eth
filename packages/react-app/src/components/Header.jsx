import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <div style={{ position: "absolute" }}>
        <img src="roboto-logo.svg" width="130" height="130" alt="Roboto" />
      </div>
      <PageHeader
        title={<div style={{ marginLeft: 100, marginTop: 30, fontFamily: "Pacifico", fontSize: 36 }}>Roboto</div>}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
