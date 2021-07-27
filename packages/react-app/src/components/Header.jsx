import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="🏰 BuidlGuidl"
        subTitle={(
          <span>v2.1 - [<a href="https://youtu.be/aYMj00JoIug" target="_blank"><span style={{marginRight:4}}>🎥 </span> 8min speed run</a>] -  [<a href="https://trello.com/b/ppbUs796/buidlguidlcom-idea-board" target="_blank"><span style={{marginRight:4}}>💡 </span> trello</a>] - [<a href="https://gitcoin.co/grants/1636/buidlguidl" target="_blank"><span style={{marginRight:4}}> </span>🤖  Gitcoin grant</a>]</span>
        )}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
