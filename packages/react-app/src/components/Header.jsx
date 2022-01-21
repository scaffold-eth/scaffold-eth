import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <div class="logo">
        <img src="roboto-logo.svg" width="130" height="130" alt="Roboto" />
        <p style={{ fontFamily: "Pacifico", fontSize: 36, marginBottom: 0 }}>Roboto</p>
      </div>
    </a>
  );
}
