import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <div style={{ position: "absolute", left: -20, top: -30 }}>
        <img src="fancy-loogie.svg" width="130" height="130" alt="FancyLoogie" />
      </div>
      <PageHeader
        title={<div style={{ marginLeft: 50 }}>FancyLoogies</div>}
        subTitle="Loogies with accesories"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
