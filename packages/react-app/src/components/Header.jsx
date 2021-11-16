import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <div style={{ position: "absolute", left: -20, top: -30 }}>
        <img src="optimistic-loogie.svg" width="130" height="130" alt="Optimistic Loogie" />
      </div>
      <PageHeader
        title={<div style={{ marginLeft: 50 }}>Optimistic Loogies</div>}
        subTitle="Loogies with a smile :-)"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
