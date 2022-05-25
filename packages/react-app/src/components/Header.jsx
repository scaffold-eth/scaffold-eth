import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <div id="header">
      <div style={{ position: "absolute", left: -20, top: -30 }}>
        <img src="loogie-board-small.png" alt="LoogieBoard" />
      </div>
      <PageHeader
        title="LoogieBoard"
        subTitle="eat LoogieCoins with your FancyLoogie"
        style={{ cursor: "pointer", marginLeft: 500 }}
      />
    </div>
  );
}
