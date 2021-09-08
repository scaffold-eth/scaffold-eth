import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/carletex/quadratic-diplomacy" target="_blank" rel="noopener noreferrer">
      <PageHeader title="Quadratic diplomacy" style={{ cursor: "pointer" }} />
    </a>
  );
}
