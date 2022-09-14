import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "start" }}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Title level={4} style={{ margin: "0 0.5rem 0 0" }}>
            🐼 merge bear minter
          </Title>
        </a>
        <Text type="secondary" style={{ textAlign: "left" }}>
          <a target="_blank" href={"https://qx.app/collection/merge-bears"} rel="noreferrer">
            view on quixotic
          </a>
        </Text>
      </div>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "/",
  title: "🏗 scaffold-eth",
  subTitle: "forkable Ethereum dev stack focused on fast product iteration",
};
