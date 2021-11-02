import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title={<div >{"🟢 Loogies "} {" "} {" x "} {" "}{"  Flemjamins 💦"}</div>}
        subTitle=""
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
