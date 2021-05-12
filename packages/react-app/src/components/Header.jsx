import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header({ extra }) {
  return <PageHeader extra={extra} />;
}
