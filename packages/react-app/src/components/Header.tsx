import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://github.com/austintgriffith/scaffold-eth",
  title: "🏗 scaffold-eth",
  subTitle: "forkable Ethereum dev stack focused on fast product iteration",
};