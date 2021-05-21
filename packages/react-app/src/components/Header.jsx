import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="🏰 BuidlGuidl"
        subTitle={(
          <span>v2 - [<a href="https://youtu.be/aYMj00JoIug" target="_blank"><span style={{marginRight:4}}>🎥 </span> 8min speed run</a>]</span>
        )}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
