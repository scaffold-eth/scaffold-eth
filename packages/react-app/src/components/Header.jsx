import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header({ extra }) {
  return <PageHeader title={<a href="/">✍️ signator.io</a>} subTitle="ethereum signer app" extra={extra} />;
}
