import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title={<div >{"🟢 Loogies "} {" "} {" x "} {" "}{"  Flemjamins 💦"}</div>}
        subTitle="Huck a Loogie! Receive Flemjamins in return!"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
