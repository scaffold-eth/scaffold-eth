import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.6rem 0 1.2rem" }}>
      <a href="/" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center" }}>
        <img src="logo.png" alt="Emotilon Logo" />
        <span level={4} style={{ marginLeft: 20, fontWeight: 700, fontSize: 50 }}>
          Emotilon
        </span>
      </a>
      {props.children}
    </div>
  );
}
