import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    // <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
    //   <PageHeader
    //     title="We Are As Gods"
    //     subTitle="forkable Ethereum dev stack focused on fast product iteration"
    //     style={{ cursor: "pointer" }}
    //   />
    // </a>
    <h1 className="main-header">
      We <span className="underlined">are</span> as gods
    </h1>
  );
}
