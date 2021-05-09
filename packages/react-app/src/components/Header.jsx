import React from "react";
import { PageHeader } from "antd";
import { Link } from "react-router-dom";

// displays a page header

export default function Header({extra}) {
  return (
      <PageHeader
        title=<a href="/">✍️ signator.io</a>
        subTitle="ethereum signer app"
        extra={extra}
      />
  );
}
