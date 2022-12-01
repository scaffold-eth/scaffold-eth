import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <div class="logo">
        <img src="emotilon.svg" width="130" height="130" alt="Emotilon" />
        <p style={{ fontFamily: "Pacifico", fontSize: 36, marginBottom: 0 }}>Emotilon</p>
      </div>
    </a>
  );
}
