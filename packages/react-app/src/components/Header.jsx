import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex",  flexDirection: "column", flex: 1, alignItems: "start" }}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Title level={4} style={{ margin: "0 0.5rem 0 0" }}>🍌 Banana Auction Machine</Title>
        </a>
        <Text type="secondary" style={{ textAlign: "left" , opacity:0.77, marginLeft:27}}><span>
<a href={"https://github.com/scaffold-eth/scaffold-eth-challenges/tree/banana-auction-machine"} target="_blank">fork/code</a>
</span></Text>
      </div>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://github.com/austintgriffith/scaffold-eth",
  title: "🏗 scaffold-eth",
  subTitle: "forkable Ethereum dev stack focused on fast product iteration",
};
